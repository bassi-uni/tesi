import {addTestRecord} from "@/utils/dbutils";

export async function POST(req){
    const {question, answer, pertinence, promptID, loadingTime, model, withTranslation} = await req.json();

    console.log({question, answer, pertinenceIndicator:pertinence, promptID, loadingTime, model, withTranslation})

    addTestRecord({question, answer, pertinenceIndicator: pertinence, promptID, loadingTime, model,withTranslation});

    return Response.json({status: "ok"})

}