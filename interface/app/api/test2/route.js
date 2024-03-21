import {addTestRecord} from "@/utils/dbutils2";


export async function POST(req){
    const {interactions, pertinence, promptID, loadingTime, model, withTranslation} = await req.json();

    console.log({interactions, pertinence, promptID, loadingTime, model, withTranslation})

    addTestRecord({interactions, pertinence, promptID, loadingTime, model, withTranslation});

    return Response.json({status: "ok"})

}