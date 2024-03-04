import {Input} from "@nextui-org/react";
import {useState} from "react";

export const NewCategory = ({onNewCategory}) => {
    const [category, setCategory] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        console.log("Ciao")
        fetch("api/category", {
            method: "POST",
            body: JSON.stringify({category}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error(err))
        onNewCategory(category)
    }

    return (
        <form className={"m-0 p-0 max-w-sm dark"} onSubmit={handleSubmit}>
            <Input placeholder={"Category Name"} value={category} onValueChange={setCategory} />
        </form>
    )
}