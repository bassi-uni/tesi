import { Ollama } from "@langchain/community/llms/ollama";

import {PromptTemplate, ChatPromptTemplate, FewShotChatMessagePromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate} from "@langchain/core/prompts";
import * as dotenv from "dotenv"
import {createStuffDocumentsChain} from "langchain/chains/combine_documents"
import {createRetrievalChain} from "langchain/chains/retrieval"

import {CheerioWebBaseLoader} from "langchain/document_loaders/web/cheerio"
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import {MemoryVectorStore} from "langchain/vectorstores/memory"


dotenv.config()


const model = new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: "openchat:latest", // Default value
});

const url = "https://js.langchain.com/docs/expression_language/";

//creare chain che mi serve per rispondere a domande dando oggetti Document come context
const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user question. 
    Context: {context}
    Question: {input}
`)

const chain = await createStuffDocumentsChain({
    llm: model,
    prompt
})


//creare loader per fare scraping

const loadDocument = async () => {
    const loader = new CheerioWebBaseLoader(url)

    return await loader.load();
}

const docs = await loadDocument();


const splitDocuments = async () => {
    const splitter =  new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20,
    })
    
    return await splitter.splitDocuments(docs);
}


//splittare il documento

const splitDocs = await splitDocuments()

//creare embeddings

const embeddings = new OllamaEmbeddings({
    
        baseUrl: "http://localhost:11434", // Default value
        model: "openchat:latest", // Default value
    
})

async function createRetriever({splitDocs, embeddings}) {
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);


    const retriever = vectorStore.asRetriever({
        k: 3
    });
    return retriever;
}

const retriever = await createRetriever({splitDocs, embeddings});


const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever
})


const res = await retrievalChain.invoke({
    context: docs,
    input: "What is LangChain Expression Language?"
})

console.log(res)


