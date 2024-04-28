import {deleteCollection, getMemory} from "@/utils/langchain/chromadbutils";
import {CHROMA_COLLECTION, models} from "@/utils/constants";

export async function DELETE(req){
    const {name} = await req.json();
    console.log(`deleting collection ${name}`);
    await deleteCollection({name});
    return Response.json({status: "ok"});
}

export async function POST(req){
    const {human, ai,model, promptID} = await req.json();
    const {saveToMemory,memory} = await getMemory({
        collectionName: CHROMA_COLLECTION,
        utilModel: models[model]
    })

    await saveToMemory({input: human, response: ai});

    return Response.json({status: "ok"});
}