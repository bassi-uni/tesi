import {LangChainStream, OpenAIStream, StreamingTextResponse} from "ai";
import { Ollama } from "@langchain/community/llms/ollama";
import {PromptTemplate} from "@langchain/core/prompts";
import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import {getCurrentSystemPrompt} from "@/dbutils";
import {RunnableSequence, RunnablePassthrough} from "@langchain/core/runnables";
const TEMPLATE_FN = (sp)=> `<<SYS>>${sp}<</SYS>>

[INST]User: {input}
AI: 
[/INST]

`;

const translationSystemPrompt = `Given a sentence by User, translate that sentence into {language}`;
const translationTemplate = TEMPLATE_FN(translationSystemPrompt);
const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);


export async function POST(req) {
    // Extract the `prompt` from the body of the request
    const { prompt } = await req.json();


    const system_prompt = getCurrentSystemPrompt();


    const template = TEMPLATE_FN(system_prompt);

    console.log({template});

    const PROMPT = PromptTemplate.fromTemplate(template);


    const model = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: "gemma:7b", // Default value
    });

    const outputParser = new BytesOutputParser();
/*
    const toEnglishTranslationChain = RunnableSequence.from([
        translationPrompt,
        model,
        new StringOutputParser(),
    ])

    const responseChain = RunnableSequence.from([
        PROMPT,
        model,
        new StringOutputParser()
    ])

    const toItalianTranslationChain = RunnableSequence.from([
        translationPrompt,
        model,
        outputParser,
    ])

    const chain = RunnableSequence.from([

        {input: toEnglishTranslationChain, original_input: new RunnablePassthrough()},

        {input: responseChain , language: ({original_input}) => original_input.original_language},

        toItalianTranslationChain,
    ])

    const stream = await chain.stream({
        language: 'English',
        original_language: 'Italian',
        input: prompt
    });*/

    const chain = PROMPT.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
        input: prompt
    });

    return new StreamingTextResponse(stream);
}