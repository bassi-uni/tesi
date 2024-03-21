import {createUC, getAllUCs} from "@/utils/dbutils2";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const withActivePrompt = searchParams.get('withActivePrompt')
    const categories = getAllUCs(withActivePrompt === "1");
    return Response.json({status: "ok", categories});
}

export async function POST(req) {
    const {category} = await req.json();
    createUC(category);
    return Response.json({status: "ok", categories: getAllUCs()});
}

