import { Ollama } from "@langchain/community/llms/ollama";
import {models} from "@/utils/constants";
import {completionWithTranslation, completionWithoutTranslation} from "@/utils/langchain/completion"



export async function POST(req) {
    // Extract the `prompt` from the body of the request
    let { prompt, promptID, translation, modelName,previousMessage } = await req.json();

    if(!previousMessage){
        previousMessage = null;
    }

    console.log({promptID, modelName, translation})
    //taking the template for the desired model
    const promptTemplate = models[modelName].TEMPLATE_FN_HISTORY;

    console.log({prompt: promptTemplate("SYSPRPT")})

    const utilModel = models[modelName];

    const model = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: utilModel.name, // Default value
    });

    if(translation === 1 || translation === "1"){
        return await completionWithTranslation({model, promptID, prompt,promptTemplate, utilModel});
    }

    return await completionWithoutTranslation({promptID, model, prompt,promptTemplate, utilModel: models[modelName], previousMessage});

}