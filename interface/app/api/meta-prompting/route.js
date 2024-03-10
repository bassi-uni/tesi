import { adjustPrompt } from "@/utils/langchain/meta-prompting";


export async function POST(req){

    const {question, answer, promptID, suggestions} = await req.json();

    return await adjustPrompt({
        answer,
        question,
        promptID,
        suggestions
    });
}