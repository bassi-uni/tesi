import Answer from "@/components/answer-page";
import {getAllCategories} from "@/utils/dbutils";


export default async function AnswerPage(props) {
    const categories = getAllCategories(true);
    console.log({categories});
    return <Answer categories={categories}/>
}
