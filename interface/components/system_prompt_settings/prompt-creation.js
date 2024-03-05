"use client"
import {Button, Textarea} from "@nextui-org/react";
import Link from "next/link";
import {useState, useTransition} from "react";
import {NewCategory} from "@/components/system_prompt_settings/new-category";
import {newPromptServerAction, deletePromptServerAction} from "@/app/actions";
import { MdDelete } from "react-icons/md";

const PromptCreation = ({categories:fetchedCategories, availablePrompts: fetchedAvailablePrompts}) => {

    const [prompt, setPrompt] = useState("");
    const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [categories, setCategories] = useState([...fetchedCategories]);
    const [availablePrompts, setAvailablePrompts] = useState([...fetchedAvailablePrompts]);
    const [isPending, startTransition] = useTransition();

    const formAction = newPromptServerAction.bind(null,categories[selectedCategoryIdx]);

    const handleNewCategory = category => {
        setCategories(prev => [...prev, {name: category}])
        setCreatingCategory(false);
        setSelectedCategoryIdx(categories.length);
    }
    const handlePromptClick = prompt => () => {
        setPrompt(prompt.prompt);
    }
    const handleDeletePrompt = ID => () => {
        console.log({ID})
        startTransition(()=>{
            deletePromptServerAction(ID)
            setAvailablePrompts( prev => prev.filter(prompt => prompt.ID !== ID))
        })
        
    }

    const filteredPrompts = availablePrompts.filter(p => p.categoryID === categories[selectedCategoryIdx]?.ID);

    console.log({filteredPrompts})

    return (
        <>
            <ul className={"flex flex-wrap w-1/2 gap-5"}>
                {categories && [...categories.map((category, index)=>(
                    <li key={index}
                        onClick={()=>setSelectedCategoryIdx(index)}
                        className={`p-2 ${index === selectedCategoryIdx ? "bg-primary text-black" :"bg-gray-700 text-white"} rounded-md hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-center`}>{category.name}</li>
                )),(creatingCategory && <NewCategory onNewCategory={handleNewCategory}/>),<li
                    key={categories.length}
                    onClick={()=>setCreatingCategory(true)}
                    className={`text-white p-2 rounded-md hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-center`}>+</li> ]}
            </ul>

            <form className={"w-1/2 flex flex-col items-center justify-center gap-3"} action={formAction}>
                <Textarea label={"Enter Your System Prompt"} placeholder={"System prompt"} size={"lg"}
                          className={"dark text-white"} key={"prompt"} id={"prompt"} name={"prompt"} value={prompt} onValueChange={setPrompt}/>

                <div className={"w-full flex items-center gap-10"}>
                <Link href={"/"}>
                    <Button size={"lg"} color={"danger"} className={"text-black"}>Exit</Button>
                </Link>
                    <Button size={"lg"} color={"primary"} className={"text-black"} type={"submit"}>Submit
                        Prompt</Button>
                </div>
            </form>

        <ul className={"m-0 w-full h-[200px] overflow-y-scroll flex flex-col items-center gap-5"}>
            {categories.length >0 && filteredPrompts.map((prompt, index)=>(
                <li key={index} className={"text-white p-2 bg-gray-700 rounded-md w-2/3 hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-between"} onClick={handlePromptClick(prompt)}>
                    <label>{prompt.prompt} </label>
                    <Button  className={"flex items-center justify-center icona-delete"} isIconOnly onClick={handleDeletePrompt(prompt.ID)} isDisabled={isPending} color="default"><MdDelete style={{margin:0}} className={"w-3/4 h-3/4 mr-0 "} /></Button>
                </li>
            ))}
        </ul>
    </>
    )

}

export default PromptCreation;