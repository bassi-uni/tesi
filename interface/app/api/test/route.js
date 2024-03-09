import {addTestRecord} from "@/utils/dbutils";
import {adjustPrompt} from "@/utils/langchain/meta-prompting";


export async function POST(req){
    const {question, answer, pertinence, promptID, loadingTime, model, withTranslation} = await req.json();

    console.log({question, answer, pertinenceIndicator:pertinence, promptID, loadingTime, model, withTranslation})

    addTestRecord({question, answer, pertinenceIndicator: pertinence, promptID, loadingTime, model,withTranslation});

    /*if(pertinence < 4 && withTranslation == 0){
        await adjustPrompt({question, answer, promptID})
    }*/


    return Response.json({status: "ok"})

}