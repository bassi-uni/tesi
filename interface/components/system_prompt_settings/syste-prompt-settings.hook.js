import {useState, useTransition} from "react";
import {deletePromptServerAction, newPromptServerAction} from "@/app/actions";

const usePromptCreation = ({ fetchedCategories, fetchedAvailablePrompts}) => {

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

    return {
        prompt,
        setPrompt,
        selectedCategoryIdx,
        setSelectedCategoryIdx,
        creatingCategory,
        setCreatingCategory,
        categories,
        setCategories,
        availablePrompts,
        setAvailablePrompts,
        formAction,
        handleNewCategory,
        handlePromptClick,
        handleDeletePrompt,
        filteredPrompts,
        isPending
    }
}

export default usePromptCreation;