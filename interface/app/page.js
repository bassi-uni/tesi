import {getAllUCs} from "@/utils/dbutils2";
import AnswerPageV2 from "@/components/answer-page-v2";
import {CHROMA_COLLECTION} from "@/utils/constants";


export default async function AnswerPage() {
    const categories = getAllUCs(true);
    console.log({categories});
    const res = await fetch("http://localhost:3000/api/chroma", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: CHROMA_COLLECTION}),
        cache: "no-cache"
    })
    console.log(res.status)
    const _ = await res.json();
    return <AnswerPageV2 categories={categories}/>
}
