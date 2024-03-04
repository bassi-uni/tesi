import {addTestRecord} from "@/utils/dbutils";

export async function POST(req){
    const {question, answer, pertinence, promptID, loadingTime, model} = await req.json();

    console.log({question, answer, pertinenceIndicator:pertinence, promptID, loadingTime, model})

    addTestRecord({question, answer, pertinence, promptID, loadingTime, model});

    return Response.json({status: "ok"})

}