import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import {ChatPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import {RunnablePassthrough, RunnableSequence} from "@langchain/core/runnables";
import {StructuredOutputParser} from "langchain/output_parsers";
import {getCurrentSystemPrompt} from "@/utils/dbutils";
import {StreamingTextResponse} from "ai";
import {z} from "zod"
import { Ollama } from "@langchain/community/llms/ollama";
import { models } from "../constants";

function initRetranslationChain(model) {
    const outputParser = new BytesOutputParser();

    const retranslationPrompt = ChatPromptTemplate.fromMessages([
        ["system", "Given a sentence by User, translate that sentence into {language}, do not add any other extra information or characters, do not translate words that are used in the same way in all languages or Proper Names. For example, do not translate 'Jhon' or 'New York'. Do not translate code from programming languages. For example, do not translate 'print(\"Hello Word!\")' or 'function'."],
        ["user", "Translate this sentence into English:\n'Ciao, come stai?'"],
        ["ai", "Hello, how are you?"],
        ["user", "Translate this sentence into Italian:\n'Je suis un homme'"],
        ["ai", "Sono un uomo"],
        ["user", "Translate this sentence into Italian:\n'def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)'"],
        ["ai", "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)"],
        ["user", "Translate this sentence into {language}:\n'{input}'"],
    ])

    return RunnableSequence.from([
        retranslationPrompt,
        model,
        outputParser,
    ])
}

function initTranslationChain(model, promptTemplate) {
    // const parser = StructuredOutputParser.fromNamesAndDescriptions({
    //     recognized_language: "input's language that you have recognized",
    //     translation: "the translation of the user input into the target language",
    // });


    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            recognized_language: z.string().describe("input's language that you have recognized"),
            translation: z.string().describe("the translation of the user input into the target language")
        })
    )

    const formatInstructions = parser.getFormatInstructions();

    const translationSystemPrompt = `Given a sentence by User, translate that sentence into {language}, you have also to recognize the language which is used for writing the sentence. 
    Do not provide any code, just translate and recognize the language.
    Do not translate code keywords.
    For example, do not translate "print" or "function".
    {format_instructions}
    Do not provide any other extra information, only the formatted JSON response.
    Examples of translations into English:
    GPT4 Correct User: Dammi la ricetta per la pasta alla carbonara<|end_of_turn|>
    GPT4 Correct Assistant: {{
        "recognized_language": "Italian",
        "translation": "Give me the recipe for pasta alla carbonara"
    }}
    <|end_of_turn|>
    GPT4 Correct User: Trova il bug in questo codice: 
    def fibonacci:  
        if n <= 1:  
            return n  
        else:  
            return(fibonacci(n-1) + fibonacci(n-2))
    <|end_of_turn|>
    GPT4 Correct Assistant: {{
        "recognized_language": "Italian",
        "translation": "Find the bug in the following code: 
    def fibonacci:  
        if n <= 1:  
            return n  
        else:  
            return(fibonacci(n-1) + fibonacci(n-2))"
        }}
    <|end_of_turn|>
    --END OF EXAMPLES--
    `;
    const translationTemplate = promptTemplate(translationSystemPrompt);

    const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);

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

export async function completionWithTranslation({model, promptID, prompt,promptTemplate}) {
    const {name, TEMPLATE_FN: translationPromptTemplate} = models.OPENCHAT;


    const translationModel = new Ollama({
        model: name,
        baseUrl: "http://localhost:11434"
    });


    //getting the chain responsible for translation of a sentence and recognizing original language, and the formattation instructions
    const {translationChain, formatInstructions} = initTranslationChain(translationModel, translationPromptTemplate);
    //getting the chain responsible for answer a question made in english
    const responseChain = initResponseChain(promptID, model,promptTemplate);
    //getting the chain responsible for retranslation of an answer to a certain language
    const retranslationChain = initRetranslationChain(translationModel);


    const chain = RunnableSequence.from([
        {
            input: translationChain,
            original_input: new RunnablePassthrough()
        },
        (res) => {
            console.log({res});
            return res;
        },

        {
            input: ({input}) => input.translation,
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
        (res) => {
            console.log({responseChain: res});
            return res;
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

export async function completionWithoutTranslation({promptID, model, prompt,promptTemplate}) {
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
