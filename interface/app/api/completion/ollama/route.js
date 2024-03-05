import { StreamingTextResponse} from "ai";
import { Ollama } from "@langchain/community/llms/ollama";
import {PromptTemplate, ChatPromptTemplate, FewShotChatMessagePromptTemplate} from "@langchain/core/prompts";
import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import {getCurrentSystemPrompt} from "@/utils/dbutils";
import {RunnableSequence, RunnablePassthrough} from "@langchain/core/runnables";
import {StructuredOutputParser} from "langchain/output_parsers";
import {models} from "@/utils/constants";



const TEMPLATE_FN = (sp)=> `<<SYS>>${sp}<</SYS>>

[INST]User: {input}
AI: 
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

    const translationSystemPrompt = `Given a sentence by User, translate that sentence into {language}, you have also to recognize the language which is used for writing the input\n{format_instructions}\nUser: {input}\nAI: `;
    const translationTemplate = TEMPLATE_FN(translationSystemPrompt);
    const translationPrompt = PromptTemplate.fromTemplate(translationSystemPrompt);


    const translationChain = RunnableSequence.from([
        translationPrompt,
        model,
        parser,
    ])

    return {translationChain,formatInstructions};
}

function initResponseChain(promptID, model, promptTemplate) {
    //get the promptWithThatId from database
    const system_prompt = getCurrentSystemPrompt({promptID});


    const template = promptTemplate(system_prompt);


    const PROMPT = ChatPromptTemplate.fromTemplate(template);

    return  RunnableSequence.from([
        PROMPT,
        model,
        new StringOutputParser(),

    ])
}

async function completionWithTranslation({model, promptID, prompt,promptTemplate}) {

    //getting the chain responsable of translation of a sentence and recognizing original language, and the formattation instructions
    const {translationChain, formatInstructions} = initTranslationChain(model);
    //getting the chain responsable of answer a question made in english
    const responseChain = initResponseChain(promptID, model,promptTemplate);
    //getting the chain responsable of retranslation of an answer to a certain language
    const retranslationChain = initRetranslationChain(model);


    const chain = RunnableSequence.from([
        {
            input: translationChain, 
            original_input: new RunnablePassthrough()
        },

        {
            input: (res) => res.input.translation,
            original_input: ({original_input, input}) => ({
                ...original_input, recognized_language: input.recognized_language
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

async function completionWithoutTranslation({promptID, model, prompt,promptTemplate}) {
    //get the promptWithThatId from database
    const system_prompt = getCurrentSystemPrompt({promptID});

    console.log({system_prompt})

    //get the full system prompt injecting the current system_prompt directives into template
    const template = promptTemplate(system_prompt);

    //build the chain
    const PROMPT = PromptTemplate.fromTemplate(template);

    const outputParser = new BytesOutputParser();

    const chain = RunnableSequence.from([
        PROMPT,
        model,
        outputParser,
    ]);

    const stream = await chain.stream({input:prompt});

    return new StreamingTextResponse(stream);
}

export async function POST(req) {
    // Extract the `prompt` from the body of the request
    const { prompt, promptID, translation, modelName } = await req.json();

    console.log({promptID, modelName, translation})
    //taking the template for the desired model
    const promptTemplate = models[modelName].TEMPLATE_FN;

    console.log({prompt: promptTemplate("SYSPRPT")})

    const model = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: models[modelName].name, // Default value
    });

    if(translation === 1 || translation === "1"){
        return await completionWithTranslation({model, promptID, prompt,promptTemplate});
    }

    return await completionWithoutTranslation({promptID, model, prompt,promptTemplate});

}