import {addTestRecord} from "@/utils/db-operations";


export async function POST(req){
    const {interactions, loadingTime, model, withTranslation} = await req.json();
    console.log({interactions,  loadingTime, model, withTranslation})

    addTestRecord({interactions, loadingTime, model, withTranslation});

    return Response.json({status: "ok"})

}