
"use server"
import { redirect } from 'next/navigation'
import {deletePromptByID} from "@/utils/dbutils2";
export const newPromptServerAction = async (selectedCategory, formData) => {

    console.log({formData, selectedCategory})
    const prompt = formData.get("prompt");
    console.log({prompt})

     await fetch("http://localhost:3000/api/sys_prompt", {
        method: "POST",
        body: JSON.stringify({system_prompt: prompt, category: selectedCategory.name}),
        headers: {
            "Content-Type": "application/json"
        }
    })

    redirect("/")
}


export const deletePromptServerAction = async (promptID) => {

    deletePromptByID(promptID);

}