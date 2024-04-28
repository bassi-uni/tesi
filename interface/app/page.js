import {getAllUCs} from "@/utils/db-operations";
import AnswerPage from "@/components/answer-page";
import {CHROMA_COLLECTION} from "@/utils/constants";


const transformUCS = (ucs) => ucs.reduce((acc, uc) => {
    let ucInAcc = acc.find(u => u.ID === uc.ID);
    if(!ucInAcc){
        acc.push({ID: uc.ID, name: uc.name, promptIDs: [{promptID: uc.promptID, prompt: uc.prompt}]});
    } else {
        ucInAcc.promptIDs.push({promptID: uc.promptID , prompt: uc.prompt});
    }
    return acc;
}, [])

export default async function MainAnswerPage() {
    const categories = getAllUCs(true);
    const ucs = transformUCS(categories);
    const res = await fetch("http://localhost:3000/api/chroma", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: CHROMA_COLLECTION}),
        cache: "no-cache"
    })
    const _ = await res.json();
    return <AnswerPage categories={ucs}/>
}
