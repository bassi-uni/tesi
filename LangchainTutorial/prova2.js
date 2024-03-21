import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { LLMChain, } from "langchain/chains";
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChromaClient } from "chromadb";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";


const client = new ChromaClient();
const name = "testchat"
console.log({client})
console.log({nameOFCollection: name});

console.log("COLLECTIONS BEFORE")
let list = await client.listCollections();
console.log({list})

await client.deleteCollection({name});

console.log("COLLECTIONS AFTER")
list = await client.listCollections();
console.log({list})