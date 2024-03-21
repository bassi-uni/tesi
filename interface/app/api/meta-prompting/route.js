import { adjustPrompt } from "@/utils/langchain/meta-prompting";


export async function POST(req){

    const {messages, promptID, suggestions} = await req.json();

    return await adjustPrompt({
        messages,
        promptID,
        suggestions
    });
}