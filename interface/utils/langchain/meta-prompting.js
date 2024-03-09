import {getCurrentSystemPrompt} from "@/utils/dbutils";
import {PromptTemplate} from "@langchain/core/prompts";
import {Ollama} from "@langchain/community/llms/ollama";
import {models} from "@/utils/constants";
import {RunnableSequence} from "@langchain/core/runnables";
import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import { StreamingTextResponse } from "ai";

function get_new_instructions(meta_output) {
    const delimiter = "Instructions: ";
    const new_instructions = meta_output.substring(meta_output.indexOf(delimiter) + delimiter.length);
    return new_instructions;
}



const meta_template = `
    Assistant has just had the below interactions with a User. Assistant followed their "Instructions" closely. Your job is to critique the Assistant's performance and then revise the Instructions so that Assistant would quickly and correctly respond in the future.

    ####

    {chat_history}

    ####

    Please reflect on these interactions.

    User suggestions: {suggestions}

    You should first critique Assistant's performance. Keeping in mind also the user suggestions if there is some. What could Assistant have done better? What should the Assistant remember about this user? Are there things this user always wants? Indicate this with "Critique: ...".

    Previous Assistaint Instructions are the following: {prev_instructions}

    You should next revise the Instructions so that Assistant would quickly and correctly respond in the future. Assistant's goal is to satisfy the user in as few interactions as possible. Assistant will only see the new Instructions, not the interaction history, so anything important must be summarized in the Instructions. Don't forget any important details in the current Instructions! Indicate the new Instructions by "Instructions: ...".
    
    `;


const getStructuredChatHistory = ({question, answer}) => `
    User: ${question}
    AI: ${answer}
    `




export const adjustPrompt = async ({question, answer, promptID, suggestions}) => {
    const sys_prompt = getCurrentSystemPrompt({promptID});
    const meta_prompt = PromptTemplate.fromTemplate(meta_template);
    const structured_chat_history = getStructuredChatHistory({question, answer});
    
    const sanitazed_suggestions = suggestions.trim().length === 0 ? "No suggestions" : suggestions;

    // const parser = StructuredOutputParser.fromNamesAndDescriptions({
    //     critique: "The critique for Assistant's performance ",
    //     instructions: "The revisited Instructions ",
    // });

    //const formatInstructions = parser.getFormatInstructions();


    const model = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: models.MISTRAL.name, // Default value
    });

    const chain =RunnableSequence.from([
        meta_prompt,
        (prompt)=> {
            console.log({prompt})
            return prompt
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

