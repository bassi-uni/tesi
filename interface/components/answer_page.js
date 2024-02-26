'use client'
import {RiBrainLine} from "react-icons/ri";
import {Button, Card, Input, Select, SelectItem, Slider, Textarea} from "@nextui-org/react";
import {useCompletion} from "ai/react";
import {useEffect, useState} from "react";
import {Cursor} from "@/components/cursor";
import {SystemPrompt} from "@/components/system_prompt";
import Lottie from "lottie-react";
import * as AnimationData from "@/app/assets/animations/AI.json";
import {fetchStreamData} from "@/utils/utils";
import {Animation} from "@/components/Animation";

export default function Answer({categories}) {



    const [pertinence, setPertinence] = useState(0);
    const [settingPromptVisible, setSettingPromptVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("1");



    const [input, setInput] = useState("");
    const [completion, setCompletion] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStreamData("api/completion/ollama", {prompt: input, category: selectedCategory}, (entireResponse) => {
            setCompletion(entireResponse);
        } , ()=>{
            setIsLoading(true)
        } , ()=>{
            setIsLoading(false)
        });
    }



    const handleNextQuestionClick = async () => {
        console.log({input, completion, pertinence});

        const res = await fetch("api/test", {
            method: "POST",
            body: JSON.stringify({question: input, answer: completion, pertinence, promptID: selectedCategory}),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await res.json();
        console.log({json});

        setInput("")
        setCompletion("")
    }

    const sliderEnabled = input.trim() !== "" && completion.trim() !== "" && !isLoading;



    const handleSelectionChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    console.log({selectedCategory})


    return (
        <>
            {settingPromptVisible && <SystemPrompt exitPromptSettings={()=>{setSettingPromptVisible(false)}}/>}
            <div className="min-w-[100vw] min-h-[100vh] flex flex-col items-center justify-center bg-gray-200 text-black font-DMSans        ">
                <main className={"w-2/3 h-full flex flex-col items-center  gap-[30px] "}>
                    <h1 className={"text-6xl flex"}>Pertinence Analysis  <RiBrainLine /> </h1>


                    <div className={"p-10 z-40 rounded-2xl w-1/2 flex justify-center items-center text-xl font-bold text-center "}>
                        Tell Us How Much Answer Match With Your Question!
                    </div>
                    <div className={"flex flex-col-reverse gap-7 items-center justify-around  w-full"}>

                        <form onSubmit={handleSubmit} className={"m-0 h-full w-full font-AnonymusPro"}>
                            <Textarea placeholder={"Question will be here"} classNames={{
                                base: "h-full",
                                inputWrapper: "h-full max-h-full",
                                input: "h-full max-h-full",
                                mainWrapper: "h-full"
                            }} size={"lg"} onValueChange={setInput} value={input} endContent={<Button type={"submit"} color={"primary"}>Submit</Button>} >Question will be here</Textarea>
                        </form>

                        <Select items={categories} label={"select a category"} selectedKeys={[selectedCategory]} onChange={handleSelectionChange}>

                            {(c) => (<SelectItem key={c.promptID} value={c.name} >{c.name}</SelectItem>)}

                        </Select>


                        <div className={"flex flex-col gap-10 w-[300px] h-full px-10 pb-10 "}>
                            <div className={"flex gap-10 w-full justify-center items-center text-6xl"}>
                                <Animation />
                            </div>
                            <Slider maxValue={1} minValue={0} step={0.01} label={"Percentage"} formatOptions={{
                                style: "percent",
                            }} onChange={(val)=>{setPertinence(val[0])}} isDisabled={!sliderEnabled} size={"lg"}/>
                        </div>
                        <div className={"h-full max-h-[400px] w-full flex flex-col items-center font-AnonymusPro overflow-y-scroll"}>
                            <h1 className={"font-bold"}>Answer will be here:</h1>
                            <div className={"flex w-full h-full"}>
                                <label>AI: </label><p>{completion}{isLoading && <Cursor/>}</p>
                            </div>

                        </div>
                    </div>
                    <div className={"flex justify-center w-full gap-3"}>
                        <Button color={"primary"} onClick={handleNextQuestionClick} isDisabled={!sliderEnabled}>NEXT QUESTION</Button>
                        <Button onClick={()=>{setSettingPromptVisible(true)}}>Set system prompt</Button>
                    </div>
                </main>
            </div>
        </>

    );
}