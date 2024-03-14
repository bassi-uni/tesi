'use client'

import useCompletion from "@/hooks/useCompletion";
import {useDisclosure} from "@nextui-org/react";
import ImproveSysPrompt from "@/components/system_prompt_settings/improve-sys-prompt/improve-sys-prompt";
import CompletionTest from "@/components/completion/completion";


export default function Answer({categories}) {



    const {isOpen , onOpen, onOpenChange } = useDisclosure();

    const {
        input,
        setInput,
        completion,
        isLoading,
        error,
        handleSubmit,
        selectedPromptID,
        selectedModel,
        models,
        setSelectedModel,
        withTranslation,
        setWithTranslation,
        sliderEnabled,
        handleCategoryChange,
        changeOptionsDisabled,
        pertinenceLabel,
        pertinence,
        setPertinence,
        handleNextQuestionClick,
    } = useCompletion({categories, onOpen});

    return (
        <>
            <div className={`min-w-[100vw] min-h-[100vh] flex flex-col items-center justify-center bg-gray-200 text-black font-DMSans py-10`}>
                {isOpen && <ImproveSysPrompt isOpen={isOpen} onOpenChange={onOpenChange} question={input} answer={completion} promptID={selectedPromptID}/>}
                <CompletionTest
                    pertinence={pertinence}
                    completion={completion}
                    setPertinence={setPertinence}
                    handleSelectionChange={handleCategoryChange}
                    selectedPromptID={selectedPromptID}
                    categories={categories}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    isLoading={isLoading}
                    error={error}
                    handleSubmit={handleSubmit}
                    input={input}
                    setInput={setInput}
                    changeOptionsDisabled={changeOptionsDisabled}
                    withTranslation={withTranslation}
                    setWithTranslation={setWithTranslation}
                    pertinenceLabel={pertinenceLabel}
                    sliderEnabled={sliderEnabled}
                    onOpen={onOpen}
                    handleNextQuestionClick={handleNextQuestionClick}
                    models={models}
                />
            </div>
        </>

    );
}
