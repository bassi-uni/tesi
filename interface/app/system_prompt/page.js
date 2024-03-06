import PromptCreation from "@/components/system_prompt_settings/prompt-creation";
import {Button, Textarea} from "@nextui-org/react";
import Link from "next/link";


const SystemPrompt = async()=>{

    const res = await fetch("http://localhost:3000/api/sys_prompt", {   
            next: {revalidate: 10}
        });
    let availablePrompts = await res.json();

    const res1 = await fetch("http://localhost:3000/api/category?withActivePrompt=0",{   
        next: {revalidate: 10}
    });
    const json1 = await res1.json();
    const categories = json1.categories;





    return (
        <div className={"h-full w-[100vw] flex flex-col justify-center items-center fixed top-0 left-0 z-50 bg-black/70 backdrop-blur-xl gap-[100px] overflow-y-scroll"}>
            <h1 className={"text-white text-5xl"}>System Prompt Setting</h1>

            <PromptCreation categories={categories} availablePrompts={availablePrompts}/>
        </div>
    )
}

export default SystemPrompt;