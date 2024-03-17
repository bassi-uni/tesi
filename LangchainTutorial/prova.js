import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { LLMChain, } from "langchain/chains";
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChromaClient } from "chromadb";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const getMemory = async ({modelName, collectionName}) => {
    const embeddings = new OllamaEmbeddings({
        model: modelName, // default value
        baseUrl: "http://localhost:11434", // default value
    });
    
    const chroma = new Chroma(embeddings, {
        collectionName
    });
    
    await chroma.ensureCollection();

   
    const memory = new VectorStoreRetrieverMemory({
        vectorStoreRetriever: chroma.asRetriever(1),
        memoryKey: "history"
    })

    return memory;
    
}

const chainCallWithMemory = async ({chain, input, memory}) => {
    const {history} = await memory.loadMemoryVariables({prompt: input});
    console.log({history})
   
    const res = await chain.invoke({ input, history });

    await memory.saveContext({
        input
    },{
        output: res
    })
    return res;

}


const deleteCollection = async ({name}) => {
    const client = new ChromaClient();
    await client.deleteCollection({name});
}

await deleteCollection({name: "pippochat"});

const memory = await getMemory({
    modelName: "openchat:latest",
    collectionName: "pippochat"
})

const model = new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: "openchat:latest"});


const prompt = PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Relevant pieces of previous conversation:
{history}

(You do not need to use these pieces of information if not relevant)

Current conversation:
Human: {input}
AI:`);

const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser()
])



//const res1 = await chain.call({ input: "Hi, my name is Perry, what's up?" , memory: memory.loadMemoryVariables({prompt: "Hi, my name is Perry, what's up?"})   });
const res1 = await chainCallWithMemory({chain, input: "Hi, my name is Perry, what's up?", memory});
console.log({ res1 });
/*
{
  res1: {
    text: " Hi Perry, I'm doing great! I'm currently exploring different topics related to artificial intelligence like natural language processing and machine learning. What about you? What have you been up to lately?"
  }
}
*/

// const res2 = await chain.call({ input: "what's my favorite sport?" });
const res2 = await chainCallWithMemory({chain, input: "what's my favorite sport?", memory});
console.log({ res2 });
/*
{ res2: { text: ' You said your favorite sport is soccer.' } }
*/

// const res3 = await chain.call({ input: "what's my name?" });
const res3 = await chainCallWithMemory({chain, input: "what's my name?", memory});
console.log({ res3 });




