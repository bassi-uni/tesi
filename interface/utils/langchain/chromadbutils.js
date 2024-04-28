import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { ChromaClient } from "chromadb";

export const getMemory = async ({utilModel, collectionName}) => {

    const {name, userInteractionTemplate, AIInteractionTemplate} = utilModel;

    const embeddings = new OllamaEmbeddings({
        model: name, // default value
        baseUrl: "http://localhost:11434", // default value
    });

    const chroma = new Chroma(embeddings, {
        collectionName
    });


    try{
        await chroma.ensureCollection();

    }catch (error) {
        console.log(error)
    }

   
    const memory = new VectorStoreRetrieverMemory({
        vectorStoreRetriever: chroma.asRetriever(2),
        memoryKey: "history",

    })

    const saveToMemory =async({input, response}) => {
        await memory.saveContext(userInteractionTemplate(input), AIInteractionTemplate(response))
    }


    return {memory, saveToMemory};
    
}

export const chainCallWithMemory = async ({chain, input, memory}) => {


    const {history} = await memory.loadMemoryVariables({prompt: input});

    console.log({history})
   
    return await chain.stream({ input, history });

}


export const deleteCollection = async ({name}) => {
    const client = new ChromaClient();
    await client.deleteCollection({name})
    const collections = await client.listCollections();
    console.log({collections})
}