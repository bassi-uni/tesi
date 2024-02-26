import {createCategory, getAllCategories} from "@/dbutils";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const withActivePrompt = searchParams.get('withActivePrompt')
    const categories = getAllCategories(withActivePrompt == "1");
    return Response.json({status: "ok", categories});
}

export async function POST(req) {
    const {category} = await req.json();
    createCategory(category);
    return Response.json({status: "ok", categories: getAllCategories()});
}

