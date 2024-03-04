'use client'
import {RiBrainLine} from "react-icons/ri";
import {Button, Select, SelectItem, Switch, Textarea} from "@nextui-org/react";
import { useState} from "react";
import {Cursor} from "@/components/completion/cursor";
import {Animation} from "@/components/animation";
import {PertinenceInput, pertinenceLabels, pertinenceTextColors} from "@/components/completion-control/pertinence-input";
import { GoDependabot } from "react-icons/go";
import { IoReloadCircleSharp } from "react-icons/io5";
import useCompletion from "@/hooks/useCompletion";
import NewCompletion from "@/components/completion/new-completion";
import SelectCategory from "@/components/completion-control/select-category";
import SelectModel from "@/components/completion-control/select-model";
import SelectPertinence from "@/components/completion-control/select-pertinence";
import TokenArea from "@/components/completion/token-area";
import ControlButtons from "@/components/completion-control/control-btns";


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
                    <ControlButtons handleNextQuestionClick={handleNextQuestionClick} pertinence={pertinence}  />
                </main>
            </div>
        </>

    );
}
