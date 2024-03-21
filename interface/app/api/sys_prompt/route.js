import {getAllSystemPrompts, getCurrentSystemPrompt, newSystemPrompt} from "@/utils/dbutils2";

export async function POST(req) {
    const {system_prompt,category} = await req.json();
    const newPromptID = newSystemPrompt(system_prompt,category);
    return Response.json({status: "ok", current: getCurrentSystemPrompt({promptID: newPromptID})})
}

export async function GET() {
    const prompts = getAllSystemPrompts();
    return Response.json(prompts);
}