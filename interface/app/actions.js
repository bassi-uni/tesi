
"use server"
import { redirect } from 'next/navigation'
import {deletePromptByID, setIsSelected} from "@/utils/db-operations";
import {revalidatePath} from "next/cache";
export const newPromptServerAction = async (selectedCategory, formData) => {

    console.log({formData, selectedCategory})
    const prompt = formData.get("prompt");
    console.log({prompt})
    const keyFeatures = formData.get("keyFeatures")
    console.log({keyFeatures})

     await fetch("http://localhost:3000/api/sys_prompt", {
        method: "POST",
        body: JSON.stringify({system_prompt: prompt, category: selectedCategory.name, keyFeatures}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    revalidatePath("/system_prompt");
}


export const deletePromptServerAction = async (promptID) => {

    deletePromptByID(promptID);

}

export const setPromptSelectedServerAction = async (promptID, isSelected,from) => {
    console.log({promptID, isSelected})
    setIsSelected({promptID, isSelected})
    revalidatePath(from)
}