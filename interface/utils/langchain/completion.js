import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import {ChatPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import {RunnablePassthrough, RunnableSequence} from "@langchain/core/runnables";
import {StructuredOutputParser} from "langchain/output_parsers";
import {getCurrentSystemPrompt} from "@/utils/dbutils2";
import {StreamingTextResponse} from "ai";
import {z} from "zod"
import { Ollama } from "@langchain/community/llms/ollama";
import {CHROMA_COLLECTION, models, prompts} from "../constants";
import {chainCallWithMemory, getMemory} from "@/utils/langchain/chromadbutils";

function initRetranslationChain(model) {
    const outputParser = new BytesOutputParser();

    const retranslationPrompt = ChatPromptTemplate.fromMessages(prompts.RETRANSLATION_PROMPT)

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

    const translationSystemPrompt = prompts.TRANSLATION_PROMPT;
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

export async function completionWithTranslation({model, promptID, prompt,promptTemplate, utilModel}) {
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
            history: async ({input}) => {
                const {translation} = input;
                const {saveToMemory,memory} = await getMemory({
                    utilModel: utilModel,
                    collectionName: CHROMA_COLLECTION
                })
                const {history} = await memory.loadMemoryVariables({prompt: translation});
                console.log({history})
                return history;
            },

        },

        {
            input: responseChain,
            language: ({original_input}) => {
                return original_input.recognized_language;
            },
            responseChainInput: new RunnablePassthrough()

        },
        async ({input,responseChainInput,...rest}) => {
            const {input: oldInput} = responseChainInput;
            const {saveToMemory,memory} = await getMemory({
                utilModel: utilModel,
                collectionName: CHROMA_COLLECTION
            })
            await saveToMemory({
                input: oldInput,
                response: input
            })
            return {language: rest.language, input};
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

export async function completionWithoutTranslation({promptID, model, prompt,promptTemplate, utilModel, previousMessage}) {
    //get the promptWithThatId from database
    const system_prompt = getCurrentSystemPrompt({promptID});
    const {memory,saveToMemory} = await getMemory({
        utilModel,
        collectionName: CHROMA_COLLECTION
    })

    console.log({previousMessage})



    if(previousMessage){
        await saveToMemory({
            input: previousMessage.human,
            response: previousMessage.ai
        })
    }


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

    //const stream = await chain.stream({input:prompt});

    const stream = await chainCallWithMemory({chain, input: prompt, memory})

    return new StreamingTextResponse(stream);
}
