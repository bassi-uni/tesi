'use client'
import {RiBrainLine} from "react-icons/ri";
import {Button, Select, SelectItem, Switch, Textarea} from "@nextui-org/react";
import { useState} from "react";
import {Cursor} from "@/components/cursor";
import {SystemPrompt} from "@/components/system_prompt";
import {Animation} from "@/components/Animation";
import {PertinenceInput, pertinenceLabels, pertinenceTextColors} from "@/components/PertinenceInput";
import { GoDependabot } from "react-icons/go";
import { IoReloadCircleSharp } from "react-icons/io5";
import useCompletion from "@/hooks/useCompletion";
import NewCompletion from "@/components/new-completion";
import SelectCategory from "@/components/select-category";
import SelectModel from "@/components/select-model";
import SelectPertinence from "@/components/select-pertinence";
import TokenArea from "@/components/token-area";
import ControlButtons from "@/components/control-btns";


export default function Answer({categories}) {



    const [pertinence, setPertinence] = useState(-1);
    const [settingPromptVisible, setSettingPromptVisible] = useState(false);




    const {
        input,
        setInput,
        completion,
        setCompletion,
        isLoading,
        error,
        handleSubmit,
        setSelectedCategory,
        selectedCategory,
        selectedModel, setModels,
        models,
        setSelectedModel,
        withTranslation,
        setWithTranslation,
        timer
    } = useCompletion();


    const handleNextQuestionClick = async () => {

        const res = await fetch("api/test", {
            method: "POST",
            body: JSON.stringify({question: input, answer: completion, pertinence, promptID: selectedCategory, loadingTime: timer, model: selectedModel}),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await res.json();

        setInput("")
        setCompletion("")
    }

    const sliderEnabled = input.trim() !== "" && completion.trim() !== "" && !isLoading;



    const handleSelectionChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const pertinenceLabel = pertinence !== -1 ? <label className={`font-bold ${pertinenceTextColors[pertinence-1]}`}>{pertinenceLabels[pertinence-1]}</label> : <label>Please select a pertinence level</label>;

    return (
        <>
            {settingPromptVisible && <SystemPrompt exitPromptSettings={()=>{setSettingPromptVisible(false)}}/>}
            <div className={`min-w-[100vw] min-h-[100vh] flex flex-col items-center justify-center bg-gray-200 text-black font-DMSans py-10 ${settingPromptVisible ? "hidden" : ""}`}>
                <main className={"w-2/3 h-full flex flex-col items-center  gap-[30px] "}>
                    <h1 className={"text-6xl flex"}>Pertinence Analysis  <RiBrainLine /> </h1>
                    <div className={"flex flex-col-reverse gap-7 items-center justify-around  w-full"}>

                        <NewCompletion error={error} handleSubmit={handleSubmit} input={input} setInput={setInput} />

                        {error && <p className={"text-danger"}>Woops, something went wrong, please try again</p>}

                        <SelectCategory handleSelectionChange={handleSelectionChange} selectedCategory={selectedCategory} categories={categories} />

                        <SelectModel setSelectedModel={setSelectedModel} selectedModel={selectedModel} models={models} />
                        <Switch defaultSelected={false} isSelected={withTranslation} onValueChange={setWithTranslation}>
                            WithTranslation
                        </Switch>

                        <SelectPertinence completion={completion} setPertinence={setPertinence} pertinenceLabel={pertinenceLabel} isLoading={isLoading} sliderEnabled={sliderEnabled} />
                        <TokenArea isLoading={isLoading} completion={completion} error={error} />
                    </div>
                    <ControlButtons handleNextQuestionClick={handleNextQuestionClick} pertinence={pertinence} setSettingPromptVisible={setSettingPromptVisible} />
                </main>
            </div>
        </>

    );
}
