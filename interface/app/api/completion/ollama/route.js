import { StreamingTextResponse} from "ai";
import { Ollama } from "@langchain/community/llms/ollama";
import {PromptTemplate} from "@langchain/core/prompts";
import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import {getCurrentSystemPrompt} from "@/dbutils";
import {RunnableSequence, RunnablePassthrough} from "@langchain/core/runnables";
import {StructuredOutputParser} from "langchain/output_parsers";



const TEMPLATE_FN = (sp)=> `<<SYS>>${sp}<</SYS>>

[INST]User: {input}
AI: 
[/INST]

`;



export async function POST(req) {
    // Extract the `prompt` from the body of the request
    const { prompt, category } = await req.json();

    console.log({category})

    const system_prompt = getCurrentSystemPrompt({promptID: category});


    const template = TEMPLATE_FN(system_prompt);

    console.log({template});

    const PROMPT = PromptTemplate.fromTemplate(template);


    const model = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: "openchat:latest", // Default value
    });

    const outputParser = new BytesOutputParser();
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        recognized_language: "input's language that you have recognized",
        translation: "the translation of the user input into the target language",
    });
    const translationSystemPrompt = `Given a sentence by User, translate that sentence into {language}\n{format_instructions}\n`;
    const translationTemplate = TEMPLATE_FN(translationSystemPrompt);
    const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);



    const translationChain = RunnableSequence.from([
        translationPrompt,
        model,
        parser,
    ])

    const responseChain = RunnableSequence.from([
        PROMPT,
        model,
        new StringOutputParser(),

    ])

    const italianTranslationChain = RunnableSequence.from([
        translationPrompt,
        (prompt) => {
            console.log({prompt})
            return prompt
        },
        model,
        (res) => {
            console.log({resItalian: res})
            try{
                return JSON.parse(res);
            }catch(e){
                return res
            }
        },

    ])


    const chain = RunnableSequence.from([
        translationChain,

        {
            input: (res)=>res.translation,
            recognized_language:(res)=>res.recognized_language ,
            original_input: new RunnablePassthrough()
        },

        {
            input: responseChain ,
            language: ({original_input}) => {
                console.log({original_input})
                return original_input.recognized_language
            },
            format_instructions: (res)=>parser.getFormatInstructions(),
        },

        italianTranslationChain,

        (res) => {
            if(res.translation){
                return res.translation
            }
            return res
        },
        outputParser
    ])

    const stream = await chain.stream({
        input: prompt,
        language: "English",
        format_instructions: parser.getFormatInstructions()
    });

    return new StreamingTextResponse(stream);
}