import {getAllSystemPrompts, getPromptByID, newSystemPrompt} from "@/utils/db-operations";

export async function POST(req) {
    const {system_prompt,category,keyFeatures} = await req.json();
    const newPromptID = newSystemPrompt(system_prompt,category, keyFeatures);
    return Response.json({status: "ok", current: getPromptByID({promptID: newPromptID})})
}

export async function GET() {
    const prompts = getAllSystemPrompts();
    return Response.json(prompts);
}