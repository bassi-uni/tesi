import {addTestRecord} from "@/dbutils";

export async function POST(req){
    const {question, answer, pertinence} = await req.json();

    addTestRecord(question, answer, pertinence);

    return Response.json({status: "ok"})

}