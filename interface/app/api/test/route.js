import {addTestRecord} from "@/dbutils";

export async function POST(req){
    const {question, answer, pertinence, promptID} = await req.json();

    console.log({question, answer, pertinence, promptID})

    addTestRecord(question, answer, pertinence, promptID);

    return Response.json({status: "ok"})

}