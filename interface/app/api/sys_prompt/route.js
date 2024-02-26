import {getAllSystemPrompts, getCurrentSystemPrompt, newSystemPrompt} from "@/dbutils";

export async function POST(req) {
    const {system_prompt,category} = await req.json();
    const newPromptID = newSystemPrompt(system_prompt,category);
    return Response.json({status: "ok", current: getCurrentSystemPrompt(newPromptID)})
}

export async function GET(req) {
    const prompts = getAllSystemPrompts();
    return Response.json(prompts);
}