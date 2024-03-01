import {Button, Input, Textarea} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {NewCategory} from "@/components/new_category";

export const SystemPrompt = ({exitPromptSettings})=>{

    const [prompt, setPrompt] = useState("");
    const [availablePrompts, setAvailablePrompts] = useState([])
    const [categories, setCategories] = useState([]);
    const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
    const [creatingCategory, setCreatingCategory] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        console.log("Ciao")
        fetch("api/sys_prompt", {
            method: "POST",
            body: JSON.stringify({system_prompt: prompt, category: categories[selectedCategoryIdx].name}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error(err))
    }
    useEffect(()=>{
        const fetchPrompts = async ()=>{
            const res = await fetch("api/sys_prompt");
            const json = await res.json();
            setAvailablePrompts(json);
        }
        const fetchCategories = async ()=>{
            const res = await fetch("api/category?withActivePrompt=0");
            const json = await res.json();
            setCategories(json.categories);
        }
        fetchPrompts();
        fetchCategories();
    },[])

    const handlePromptClick = prompt =>
        () => {
            setPrompt(prompt.prompt);
        }

        const filteredPrompts = availablePrompts.filter(p => p.categoryID === categories[selectedCategoryIdx]?.id);
    console.log({filteredPrompts})

    const handleNewCategory = category => {
        setCategories(prev => [...prev, {name: category}])
        setCreatingCategory(false);
        setSelectedCategoryIdx(categories.length);
    }

    return (
        <div className={"h-full w-[100vw] flex flex-col justify-center items-center fixed top-0 left-0 z-50 bg-black/70 backdrop-blur-xl gap-[100px] pt-[200px]"}>
            <h1 className={"text-white text-5xl"}>System Prompt Setting</h1>
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
            <form className={"w-1/2 flex flex-col items-center justify-center gap-3"} onSubmit={handleSubmit}>
                <Textarea label={"Enter Your System Prompt"} placeholder={"System prompt"} size={"lg"} className={"dark text-white"} onValueChange={setPrompt} value={prompt}/>
                <div className={"w-full flex items-center gap-10"}>
                    <Button size={"lg"} color={"danger"} className={"text-black"} onClick={exitPromptSettings}>Exit</Button>
                    <Button size={"lg"} color={"primary"} className={"text-black"} type={"submit"}>Submit Prompt</Button>
                </div>
            </form>
            <ul className={"m-0 w-full h-full overflow-y-scroll flex flex-col items-center gap-5"}>
                {categories.length >0 && filteredPrompts.map((prompt, index)=>(
                    <li key={index} className={"text-white p-2 bg-gray-700 rounded-md w-2/3 hover:bg-primary hover:text-black cursor-pointer duration-150"} onClick={handlePromptClick(prompt)}>{prompt.prompt}</li>
                ))}
            </ul>
        </div>
    )
}