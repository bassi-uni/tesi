import {RiBrainLine} from "react-icons/ri";
import NewCompletion from "@/components/completion/new-completion";
import SelectCategory from "@/components/completion-control/select-category";
import SelectModel from "@/components/completion-control/select-model";
import {Switch} from "@nextui-org/react";
import SelectPertinence from "@/components/completion-control/select-pertinence";
import TokenArea from "@/components/completion/token-area";
import ControlButtons from "@/components/completion-control/control-btns";

const CompletionTest = ({
                            changeOptionsDisabled,
                            withTranslation ,
                            setWithTranslation,
                            error,
                            handleSubmit,
                            input,
                            setInput,
                            handleSelectionChange,
                            selectedPromptID,
                            categories,
                            selectedModel,
                            setSelectedModel,
                            isLoading,
                            completion,
                            setPertinence,
                            pertinenceLabel,
                            sliderEnabled,
                            onOpen,
                            handleNextQuestionClick,
                            pertinence,
                            models,
                            setCompletion
}) => {


    return (
        <main className={"w-2/3 h-full flex flex-col items-center  gap-[30px] "}>
            <h1 className={"text-6xl flex"}>Pertinence Analysis  <RiBrainLine /> </h1>
            <div className={"flex flex-col-reverse gap-7 items-center justify-around  w-full"}>

                <NewCompletion error={error} handleSubmit={handleSubmit} input={input} setInput={setInput} isDisabled={changeOptionsDisabled}/>

                {error && <p className={"text-danger"}>Woops, something went wrong, please try again</p>}

                <SelectCategory handleSelectionChange={handleSelectionChange} selectedPromptID={selectedPromptID} categories={categories} isDisabled={changeOptionsDisabled}/>

                <SelectModel setSelectedModel={setSelectedModel} selectedModel={selectedModel} models={models} isDisabled={changeOptionsDisabled}/>
                <Switch defaultSelected={false} isSelected={withTranslation} onValueChange={setWithTranslation} isDisabled={changeOptionsDisabled}>
                    With Translation
                </Switch>

                <SelectPertinence
                    completion={completion}
                    setPertinence={setPertinence}
                    pertinenceLabel={pertinenceLabel}
                    isLoading={isLoading}
                    sliderEnabled={sliderEnabled}
                    onOpen={onOpen}/>
                <TokenArea isLoading={isLoading} completion={completion} error={error} />
            </div>
            <ControlButtons handleNextQuestionClick={handleNextQuestionClick} pertinence={pertinence} retryVisible={completion.trim().length>0 && !isLoading} onRetryClick={()=>{
                setCompletion("");
                setPertinence(-1)
            }} />
        </main>
    )
}

export default CompletionTest