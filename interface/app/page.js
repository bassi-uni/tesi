import Answer from "@/components/answer_page";
import {getAllCategories} from "@/dbutils";


export default async function AnswerPage(props) {
    const categories = getAllCategories(true);
    console.log({categories});
    return <Answer categories={categories}/>
}
