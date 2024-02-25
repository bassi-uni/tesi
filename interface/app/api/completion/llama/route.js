import {LangChainStream, OpenAIStream, StreamingTextResponse} from "ai";
import { HumanMessage} from "@langchain/core/messages";
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import {LlamaCpp} from "@langchain/community/llms/llama_cpp";
import {PromptTemplate} from "@langchain/core/prompts";
import {BytesOutputParser} from "@langchain/core/output_parsers";

const path = "/Users/francescobassignana/models/meta-models/llama-2-13b-chat/13b-llama-ggml-model-q4_0.gguf";
const TEMPLATE = `<<SYS>>You are a helpful assistant, please answer this question being respectful. Provide always concise responses<</SYS>>

[INST]User: {input}
AI: 
[/INST]

`;

const llamaTemplate = (sp) =>  {
    return `<<SYS>>\n${sp} \n<</SYS>>\n\n [INST] Using the following context, please answer the question: {{input}}. \n\n {{history}}[/INST]`;
}

export async function POST(req) {
    // Extract the `prompt` from the body of the request
    const { prompt } = await req.json();

    const PROMPT = PromptTemplate.fromTemplate(TEMPLATE);


    const model = new LlamaCpp({ modelPath: path, maxTokens: 40 , gpuLayers:0 });

    const outputParser = new BytesOutputParser();

    const chain = PROMPT.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
        input: prompt,
    });

    return new StreamingTextResponse(stream);
}