import {getCurrentSystemPrompt} from "@/utils/dbutils";
import {PromptTemplate} from "@langchain/core/prompts";
import {Ollama} from "@langchain/community/llms/ollama";
import {models, prompts} from "@/utils/constants";
import {RunnableSequence} from "@langchain/core/runnables";
import {BytesOutputParser} from "@langchain/core/output_parsers";
import { StreamingTextResponse } from "ai";

const meta_template = prompts.META_PROMPT;

const getStructuredChatHistory = ({question, answer}) => `
    User: ${question}
    AI: ${answer}
    `


export const adjustPrompt = async ({question, answer, promptID, suggestions}) => {
    const sys_prompt = getCurrentSystemPrompt({promptID});
    const meta_prompt = PromptTemplate.fromTemplate(meta_template);
    const structured_chat_history = getStructuredChatHistory({question, answer});
    
    const sanitazed_suggestions = suggestions.trim().length === 0 ? "No suggestions" : suggestions;

    const model = new Ollama({
        baseUrl: "http://localhost:11434", 
        model: models.MISTRAL.name, 
    });

    const chain = RunnableSequence.from([
        meta_prompt,
        (meta_prompt) => {
            console.log({meta_prompt});
            return meta_prompt;
        },
        model,
        new BytesOutputParser(),
    ])

    const response = await chain.stream({
        chat_history: structured_chat_history,
        prev_instructions: sys_prompt,
        suggestions: sanitazed_suggestions

    })

    
    return new StreamingTextResponse(response);
}

