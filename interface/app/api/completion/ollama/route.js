import { StreamingTextResponse} from "ai";
import { Ollama } from "@langchain/community/llms/ollama";
import {PromptTemplate, ChatPromptTemplate, FewShotChatMessagePromptTemplate} from "@langchain/core/prompts";
import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import {getCurrentSystemPrompt} from "@/dbutils";
import {RunnableSequence, RunnablePassthrough} from "@langchain/core/runnables";
import {StructuredOutputParser} from "langchain/output_parsers";



const TEMPLATE_FN = (sp)=> `<<SYS>>${sp}<</SYS>>

[INST]User: {input}
AI: <RESPONSE>
[/INST]

`;


function initRetranslationChain(model) {
    const outputParser = new BytesOutputParser();

    const retranslationPrompt = ChatPromptTemplate.fromMessages([
        ["system", "Given a sentence by User, translate that sentence into {language}, do not add any other extra information or characters"],
        ["user", "Translate this sentence into English:\n'Ciao, come stai?'"],
        ["ai", "Hello, how are you?"],
        ["user", "Translate this sentence into Italian:\n'Je suis un homme'"],
        ["ai", "Sono un uomo"],
        ["user", "Translate this sentence into {language}:\n'{input}'"],
    ])

    return RunnableSequence.from([
        retranslationPrompt,
        (prompt) => {
            console.log({prompt});
            return prompt;
        },
        model,
        outputParser,
    ])
}

function initTranslationChain(model) {
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        recognized_language: "input's language that you have recognized",
        translation: "the translation of the user input into the target language",
    });
    const formatInstructions = parser.getFormatInstructions();

    const translationSystemPrompt = `Given a sentence by User, translate that sentence into {language}\n{format_instructions}\n`;
    const translationTemplate = TEMPLATE_FN(translationSystemPrompt);
    const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);


    const translationChain = RunnableSequence.from([
        translationPrompt,
        (prompt) => {
            console.log({prompt});
            return prompt;
        },
        model,
        parser,
    ])

    return {translationChain,formatInstructions};
}

function initResponseChain(category, model) {
    const system_prompt = getCurrentSystemPrompt({promptID: category});


    const template = TEMPLATE_FN(system_prompt);


    const PROMPT = PromptTemplate.fromTemplate(template);

    return  RunnableSequence.from([
        PROMPT,
        model,
        new StringOutputParser(),

    ])
}

export async function POST(req) {
    // Extract the `prompt` from the body of the request
    const { prompt, category } = await req.json();

    console.log({category})



    const model = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: "openchat:latest", // Default value
    });



    const {translationChain,formatInstructions} = initTranslationChain(model);
    const responseChain = initResponseChain(category, model);
    const retranslationChain = initRetranslationChain(model);




    const chain = RunnableSequence.from([
        {input: translationChain,original_input: new RunnablePassthrough()},

        {
            input: (res) => res.input.translation,
            original_input: ({original_input, input})=> ({
                ... original_input, recognized_language: input.recognized_language
            }),
        },

        {
            input: responseChain,
            language: ({original_input}) => {
                return original_input.recognized_language;
            },

        },
        retranslationChain,
    ]);

    const stream = await chain.stream({
        input: prompt,
        language: "English",
        format_instructions: formatInstructions
    });

    return new StreamingTextResponse(stream);
}