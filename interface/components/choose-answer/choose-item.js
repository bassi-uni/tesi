import {useEffect, useState, useTransition} from "react";
import {fetchStreamData} from "@/utils/utils";
import Interaction from "@/components/token-area/interaction";
import {Button, ScrollShadow, Tooltip} from "@nextui-org/react";

import {IoCloseCircle} from "react-icons/io5";
import {setPromptSelectedServerAction} from "@/app/actions";
import { FaCircleInfo } from "react-icons/fa6";



const ChooseItem = ({question, prompt, withTranslation, selectedModel, onChoseClick, loading, setIsLoading, completion, setCompletion, isSelected}) => {
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();
    let firstTime = true;

    useEffect(() => {
        if(firstTime){
            fetchStreamData("api/completion/chat", {
                prompt: question,
                promptID: prompt.promptID,
                translation: (withTranslation ? 1 : 0),
                modelName:selectedModel
            }, (entireResponse) => {
                setCompletion(entireResponse)
            } , ()=>{
                setIsLoading(true)
            } , ()=>{
                setIsLoading(false);
            }).catch(setError);
            firstTime = false;
        }

    }, [ question, prompt.promptID, withTranslation, selectedModel]);

    const handleCrossClick = () => {
        if(loading){
            return;
        }
        startTransition(async ()=>{
            await setPromptSelectedServerAction(prompt.promptID, false, "/");
        })

    }
    const handleChoseClick = () => {
        onChoseClick(prompt.promptID, completion);
    }

    return  ( <div className={`relative flex flex-col h-full border-2 rounded-md w-[700px] hover:border-green-400 cursor-pointer py-4 px-2 ${isSelected ? "border-primary shadow-lg shadow-primary" : "border-gray-400"}   `} onClick={handleChoseClick}>
        {!loading && <Tooltip className={"max-w-[500px] dark text-white"} content={"Disable this system prompt"}>
            <Button isIconOnly className={"rounded-full absolute top-5 right-5 z-20"}> <IoCloseCircle className={"h-full w-full text-red-500 "} onClick={handleCrossClick}/></Button>
        </Tooltip>}
        <Tooltip content={<div>
            <h1 className={"text-2xl text-primary-500"}>System prompt</h1>
            <p className={"text-medium"}><i>{prompt.prompt}</i></p>
        </div>} className={" max-w-[500px] dark text-white"} classNames={{
            content: "backdrop-blur bg-black/50 border-black border-1"
        }}
        placement={"bottom"}
        >
            <Button isIconOnly className={"rounded-full absolute top-5 right-20 z-20"}> <FaCircleInfo className={"h-4/5 w-4/5 text-blue-400 z-20"} onClick={handleCrossClick}/></Button>
        </Tooltip>
            <ScrollShadow>
                <Interaction human={question} ai={completion} error={error} isLoading={loading} showCursorWhenLoading={true}/>
            </ScrollShadow>
    </div>)
}

export default ChooseItem