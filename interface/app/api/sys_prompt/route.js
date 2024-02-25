import {getAllSystemPrompts, getCurrentSystemPrompt, newSystemPrompt} from "@/dbutils";

export async function POST(req) {
    const {system_prompt} = await req.json();
    newSystemPrompt(system_prompt);
    return Response.json({status: "ok", current: getCurrentSystemPrompt()})
}

export async function GET(req) {
    const prompts = getAllSystemPrompts();
    return Response.json(prompts);
}