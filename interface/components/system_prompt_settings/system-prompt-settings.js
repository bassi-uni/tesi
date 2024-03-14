"use client"
import usePromptCreation from "@/components/system_prompt_settings/syste-prompt-settings.hook";
import CategoriesList from "@/components/system_prompt_settings/category/categories-list";
import NewSystemPrompt from "@/components/system_prompt_settings/system-prompt/new-system-prompt";
import SystemPromptsList from "@/components/system_prompt_settings/system-prompt/system-prompts-list";

const SystemPromptSettings = ({categories:fetchedCategories, availablePrompts: fetchedAvailablePrompts}) => {

    const {
        filteredPrompts,
        categories,
        creatingCategory,
        setPrompt,
        prompt,
        handleDeletePrompt,
        handlePromptClick,
        setCreatingCategory,
        handleNewCategory,
        formAction,
        selectedCategoryIdx,
        setSelectedCategoryIdx,
        isPending
    } = usePromptCreation({
        fetchedCategories,
        fetchedAvailablePrompts
    });
    console.log({filteredPrompts})

    return (
        <>
           <CategoriesList
               creatingCategory={creatingCategory}
               setCreatingCategory={setCreatingCategory}
               categories={categories}
               setSelectedCategoryIdx={setSelectedCategoryIdx}
               selectedCategoryIdx={selectedCategoryIdx}
               handleNewCategory={handleNewCategory}
           />
            <NewSystemPrompt
                setPrompt={setPrompt}
                prompt={prompt}
                formAction={formAction}
            />
            <SystemPromptsList
                filteredPrompts={filteredPrompts}
                categories={categories}
                handlePromptClick={handlePromptClick}
                handleDeletePrompt={handleDeletePrompt}
                isPending={isPending}
            />
    </>
    )

}

export default SystemPromptSettings;