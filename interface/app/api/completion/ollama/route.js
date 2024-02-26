import { StreamingTextResponse} from "ai";
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
const translationPrompt = PromptTemplate.fromTemplate(`Translate to {language} this sentence: "{input}"`);


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
    });
*/
    const chain = PROMPT.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
        input: prompt
    });

    return new StreamingTextResponse(stream);
}