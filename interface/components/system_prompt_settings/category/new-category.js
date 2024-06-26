import {Button, ButtonGroup, Input} from "@nextui-org/react";
import {useState} from "react";
import classes from "./new-category.module.css";
export const NewCategory = ({onNewCategory}) => {
    const [category, setCategory] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        fetch("api/category", {
            method: "POST",
            body: JSON.stringify({category}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            onNewCategory(category)
        })
        .catch(err => console.error(err))
        
    }

    return (
            <form className={"m-0 p-0 max-w-sm dark"} onSubmit={handleSubmit}>
                <Input placeholder={"Category Name"} value={category} onValueChange={setCategory} />
            </form>
    )
}