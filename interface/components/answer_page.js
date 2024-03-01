'use client'
import {RiBrainLine} from "react-icons/ri";
import {Button, Select, SelectItem, Textarea} from "@nextui-org/react";
import { useState} from "react";
import {Cursor} from "@/components/cursor";
import {SystemPrompt} from "@/components/system_prompt";
import {fetchStreamData} from "@/utils/utils";
import {Animation} from "@/components/Animation";
import {PertinenceInput, pertinenceLabels, pertinenceTextColors} from "@/components/PertinenceInput";
import { GoDependabot } from "react-icons/go";
import { IoReloadCircleSharp } from "react-icons/io5";


export default function Answer({categories}) {



    const [pertinence, setPertinence] = useState(-1);
    const [settingPromptVisible, setSettingPromptVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("1");



    const [input, setInput] = useState("");
    const [completion, setCompletion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCompletion("");
        fetchStreamData("api/completion/ollama", {prompt: input, category: selectedCategory}, (entireResponse) => {
            console.log("CHUNK ARRIVED")
            setCompletion(entireResponse);
        } , ()=>{
            setIsLoading(true)
        } , ()=>{
            setIsLoading(false)
        }).catch(setError);
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
    console.log({pertinence, })

    const pertinenceLabel = pertinence !== -1 ? <label className={`font-bold ${pertinenceTextColors[pertinence-1]}`}>{pertinenceLabels[pertinence-1]}</label> : <label>Please select a pertinence level</label>;

    return (
        <>
            {settingPromptVisible && <SystemPrompt exitPromptSettings={()=>{setSettingPromptVisible(false)}}/>}
            <div className="min-w-[100vw] min-h-[100vh] flex flex-col items-center justify-center bg-gray-200 text-black font-DMSans py-10">
                <main className={"w-2/3 h-full flex flex-col items-center  gap-[30px] "}>
                    <h1 className={"text-6xl flex"}>Pertinence Analysis  <RiBrainLine /> </h1>
                    <div className={"flex flex-col-reverse gap-7 items-center justify-around  w-full"}>

                        <form onSubmit={handleSubmit} className={"m-0 h-full w-full font-AnonymusPro"}>
                            <Textarea placeholder={"Question will be here"} classNames={{
                                base: "h-full",
                                inputWrapper: "h-full max-h-full",
                                input: "h-full max-h-full",
                                mainWrapper: "h-full"
                            }} size={"lg"} onValueChange={setInput} value={input} endContent={<Button type={"submit"} color={"primary"}>Submit</Button>} >Question will be here</Textarea>
                        </form>

                        <Select items={categories} label={"select a category"} selectedKeys={[selectedCategory]} onChange={handleSelectionChange} renderValue={([item]) => {
                            return item.data.name
                        }} >
                            {(c) => (<SelectItem  key={c.promptID} value={c.name} clsssNames={{
                                base: "text-black",
                                selected: "text-black",
                                wrapper: "text-black"
                            }} ><p className={"text-black"}>{c.name}</p></SelectItem>)}

                        </Select>


                        <div className={"flex flex-col gap-10 h-full px-10 pb-10 "}>
                            <div className={"flex gap-10 w-[300px] justify-center items-center text-6xl self-center"}>
                                <Animation />
                            </div>
                            {!isLoading && completion.trim() !== "" && <h1 className={"text-2xl font-bold"}>How would you rate the pertinence between question and answer?</h1>}
                            <PertinenceInput onPertinenceChange={setPertinence} isEnabled={sliderEnabled} />
                            {!isLoading && completion.trim() !== "" && pertinenceLabel}
                        </div>
                        <div className={"h-full max-h-[400px] w-full flex flex-col gap-10 items-center font-AnonymusPro overflow-y-scroll"}>
                            <h1 className={"font-bold"}>Answer will be here:</h1>
                            <div className={"flex w-full h-full items-center gap-4"}>
                                <GoDependabot className={"text-3xl shrink-0"} /> <p className={"pt-1"}>{completion}{isLoading && <Cursor/>}</p>
                            </div>

                        </div>
                    </div>
                    <div className={"flex justify-center w-full gap-3"}>
                        {!error&& <Button color={"primary"} onClick={handleNextQuestionClick}
                                 isDisabled={pertinence === -1}>SUBMIT</Button>}
                        {error&& <Button color={"danger"} onClick={handleNextQuestionClick}
                            isDisabled={pertinence === -1} isIconOnly endContent={<IoReloadCircleSharp /> }></Button>}
                        <Button onClick={()=>{setSettingPromptVisible(true)}}>Set system prompt</Button>
                    </div>
                </main>
            </div>
        </>

    );
}
