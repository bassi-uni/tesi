import { OllamaFunctions } from "langchain/experimental/chat_models/ollama_functions";

import {PromptTemplate, ChatPromptTemplate, FewShotChatMessagePromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate} from "@langchain/core/prompts";
import * as dotenv from "dotenv"
import {createStuffDocumentsChain} from "langchain/chains/combine_documents"
import {createRetrievalChain} from "langchain/chains/retrieval"

import {CheerioWebBaseLoader} from "langchain/document_loaders/web/cheerio"
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import {MemoryVectorStore} from "langchain/vectorstores/memory"

const model = new OllamaFunctions({
    baseUrl: "http://localhost:11434", // Default value
    model: "mistral:latest"
});

