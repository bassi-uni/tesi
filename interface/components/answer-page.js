'use client'

import {useDisclosure} from "@nextui-org/react";
import ImproveSysPrompt from "@/components/system_prompt_settings/improve-sys-prompt/improve-sys-prompt";
import CompletionTest from "@/components/completion/completion";
import useChat from "@/components/answer-page.hook";
import ChooseAnswer from "@/components/choose-answer/choose-answer";

export default function AnswerPage({categories}) {



    const {isOpen , onOpen, onOpenChange,  } = useDisclosure();
    const {isOpen: isChooseAnswerOpen, onOpen: onChooseAnswerOpen, onOpenChange: onChooseAnswerOpenChange,onClose} = useDisclosure();

    const {
        input,
        setInput,
        messages,
        error,
        handleSubmit,
        selectedModel,
        models,
        setSelectedModel,
        withTranslation,
        setWithTranslation,
        handleCategoryChange,
        changeOptionsDisabled,
        handleNextQuestionClick,
        onCloseMetaPrompt,
        reset,
        selectedCategoryId,
        selectedPrompts,
        onChooseInteraction,
        setMessages
    } = useChat({categories, onOpen, onChooseAnswerOpen});



    return (

            <div className={`min-w-[100vw] min-h-[100vh] flex flex-col items-center justify-center bg-gray-200 text-black font-DMSans py-10`}>
                {isOpen && <ImproveSysPrompt
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    messages={messages}
                    onClose={onCloseMetaPrompt}
                />}
                {isChooseAnswerOpen && <ChooseAnswer
                    isOpen={isChooseAnswerOpen}
                    onOpenChange={onChooseAnswerOpenChange}
                    onClose={(isFinished)=> {

                        onClose();
                        if(!isFinished){
                            //delete last message
                            setMessages(prev => {
                                prev.pop();
                                return [...prev];
                            })
                        }
                    }}
                    question={messages[messages.length-1]?.human}
                    promptIDs={selectedPrompts}
                    withTranslation={withTranslation}
                    selectedModel={selectedModel}
                    onChooseInteraction={onChooseInteraction}
                />}
                <CompletionTest
                    handleSelectionChange={handleCategoryChange}
                    categories={categories}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    error={error}
                    handleSubmit={handleSubmit}
                    input={input}
                    setInput={setInput}
                    changeOptionsDisabled={changeOptionsDisabled}
                    withTranslation={withTranslation}
                    setWithTranslation={setWithTranslation}
                    handleNextQuestionClick={handleNextQuestionClick}
                    models={models}
                    messages={messages}
                    reset={reset}
                    selectedCategoryId={selectedCategoryId}
                    onMetaPromptClick={onOpen}
                />
            </div>


    );
}
