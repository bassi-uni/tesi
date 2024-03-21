import {deleteCollection} from "@/utils/langchain/chromadbutils";

export async function POST(req){
    const {name} = await req.json();
    console.log(`deleting collection ${name}`);
    await deleteCollection({name});
    return Response.json({status: "ok"});
}