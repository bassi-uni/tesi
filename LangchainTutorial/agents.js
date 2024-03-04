import { Ollama } from "@langchain/community/llms/ollama";
import {PromptTemplate, ChatPromptTemplate, FewShotChatMessagePromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import * as dotenv from "dotenv"

import {createOpenAIFunctionsAgent, AgentExecutor, createStructuredChatAgent} from "langchain/agents"
import { pull } from "langchain/hub"

import { DynamicStructuredTool, DynamicTool } from "@langchain/core/tools";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import {RunnableSequence, RunnablePassthrough} from "@langchain/core/runnables";
import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import {z} from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { OllamaFunctions } from "langchain/experimental/chat_models/ollama_functions";


function initRetranslationChain(model) {
    const outputParser = new BytesOutputParser();

    const retranslationPrompt = ChatPromptTemplate.fromMessages([
        ["system", "Given a sentence by User, translate that sentence into {language}, do not add any other extra information or characters"],
        ["user", "Translate this sentence into English:\n'Ciao, come stai?'"],
        ["ai", "Hello, how are you?"],
        ["user", "Translate this sentence into Italian:\n'Je suis un homme'"],
        ["ai", "Sono un uomo"],
        ["user", "Translate this sentence into {language}:\n'{input}'"],
    ])

    return RunnableSequence.from([
        retranslationPrompt,
        model,
        new StringOutputParser(),
    ])
}

function initTranslationChain(model) {
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        recognized_language: "input's language that you have recognized",
        translation: "the translation of the user input into the target language",
    });
    const formatInstructions = parser.getFormatInstructions();

    const translationSystemPrompt = `Given a sentence by User, translate that sentence into {language}, you have also to recognize the language which is used for writing the input\n{format_instructions}\nUser: {input}\nAI: `;
    const translationTemplate = TEMPLATE_FN(translationSystemPrompt);
    const translationPrompt = PromptTemplate.fromTemplate(translationSystemPrompt);


    const translationChain = RunnableSequence.from([
        translationPrompt,
        model,
        parser,
    ])

    return {translationChain,formatInstructions};
}

function initResponseChain(category, model) {
    const system_prompt = getCurrentSystemPrompt({promptID: category});


    const template = TEMPLATE_FN(system_prompt);


    const PROMPT = ChatPromptTemplate.fromTemplate(template);

    return  RunnableSequence.from([
        PROMPT,
        model,
        new StringOutputParser(),

    ])
}


dotenv.config()


const model = new OllamaFunctions({
    baseUrl: "http://localhost:11434", // Default value
    model: "mistral:latest", // Default value
});




const customTool = new DynamicTool({
    name: "get_word_length",
    description: "Returns the length of a word.",
    func: async (input) => input.length.toString(),
  });
  



/** Define your list of tools. */
const tools = [customTool];

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are very powerful assistant, but don't know current events"],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);



const modelWithFunctions = model.bind({
    functions: tools.map((tool) => convertToOpenAIFunction(tool))
});

const runnableAgent = RunnableSequence.from([
    {
      input: (i) => i.input,
      agent_scratchpad: (i) =>{
        console.log({i});
        return formatToOpenAIFunctionMessages(i.steps)
    }
    },
    prompt,
    (res)=>{
        console.log({res});

        return res;   
    },
    modelWithFunctions,
    (res)=>{
        console.log({res});

        return res;   
    },
    OpenAIFunctionsAgentOutputParser

  ]);
  
  const executor = AgentExecutor.fromAgentAndTools({
    agent: runnableAgent,
    tools,
  });

  const res = await executor.invoke({
    input: "Translate 'Ciao come stai' into english"
  })

  console.log({res})