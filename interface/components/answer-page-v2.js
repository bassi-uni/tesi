'use client'

import {useDisclosure} from "@nextui-org/react";
import ImproveSysPrompt from "@/components/system_prompt_settings/improve-sys-prompt/improve-sys-prompt";
import CompletionTest from "@/components/completion/completion";
import useChat from "@/hooks/useChat";

export default function AnswerPageV2({categories}) {



    const {isOpen , onOpen, onOpenChange } = useDisclosure();

    const {
        input,
        setInput,
        messages,
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
        setMessages,
        setEnablePertinence,
        handleSendPertinence

    } = useChat({categories, onOpen});

    return (
        <>
            <div className={`min-w-[100vw] min-h-[100vh] flex flex-col items-center justify-center bg-gray-200 text-black font-DMSans py-10`}>
                {isOpen && <ImproveSysPrompt isOpen={isOpen} onOpenChange={onOpenChange} messages={messages} promptID={selectedPromptID}/>}
                <CompletionTest
                    pertinence={pertinence}
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
                    messages={messages}
                    setMessages={setMessages}
                    setEnablePertinence={setEnablePertinence}
                    handleSendPertinence={handleSendPertinence}
                />
            </div>
        </>

    );
}
