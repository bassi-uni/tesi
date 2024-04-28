import {Button} from "@nextui-org/react";
import Link from "next/link";
import { SlReload } from "react-icons/sl";
import { FiSend } from "react-icons/fi";


const ControlButtons = ({handleNextQuestionClick,retryVisible, onRetryClick , onMetaPromptClick}) => {
    return (
        <div className={"flex justify-center w-full gap-3"}>
            <Button color={"primary"} onClick={handleNextQuestionClick}>Valuate Chat</Button>
            <Link href={"/system_prompt"}><Button>system prompt</Button></Link>
            {retryVisible && <Button endContent={<SlReload className={"w-3/4 h-3/4"}/>} color={"warning"} onClick={onRetryClick}>Retry</Button>}
            <Button onPress={onMetaPromptClick}>Meta Prompting</Button>
        </div>
    )
}

export default ControlButtons;