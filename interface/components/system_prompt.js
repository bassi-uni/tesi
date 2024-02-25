import {Button, Input, Textarea} from "@nextui-org/react";
import {useEffect, useState} from "react";

export const SystemPrompt = ({exitPromptSettings})=>{

    const [prompt, setPrompt] = useState("");
    const [availablePrompts, setAvailablePrompts] = useState([])

    const handleSubmit = e => {
        e.preventDefault();
        console.log("Ciao")
        fetch("api/sys_prompt", {
            method: "POST",
            body: JSON.stringify({system_prompt: prompt}),
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
        fetchPrompts();
    },[])

    const handlePromptClic = prompt =>
        () => {
            setPrompt(prompt.system_prompt);
        }

    return (
        <div className={"h-[100vh] w-[100vw] flex flex-col justify-center items-center absolute z-50 bg-black/80 backdrop-blur gap-[100px] pt-[200px]"}>
            <h1 className={"text-white text-5xl"}>System Prompt Setting</h1>
            <form className={"w-1/2 flex flex-col items-center justify-center gap-3"} onSubmit={handleSubmit}>
                <Textarea label={"Enter Your System Prompt"} placeholder={"System prompt"} size={"lg"} className={"dark text-white"} onValueChange={setPrompt} value={prompt}/>
                <div className={"w-full flex items-center gap-10"}>
                    <Button size={"lg"} color={"danger"} onClick={exitPromptSettings}>Exit</Button>
                    <Button size={"lg"} color={"primary"}  type={"submit"}>Submit Prompt</Button>
                </div>
            </form>
            <ul className={"m-0 w-full h-full overflow-y-scroll flex flex-col items-center gap-5"}>
                {availablePrompts.map((prompt, index)=>(
                    <li key={index} className={"text-white p-2 bg-black rounded-md w-2/3 hover:bg-primary hover:text-black cursor-pointer duration-150"} onClick={handlePromptClic(prompt)}>{prompt.system_prompt}</li>
                ))}
            </ul>
        </div>
    )
}