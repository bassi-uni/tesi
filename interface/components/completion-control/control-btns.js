import {Button} from "@nextui-org/react";
import Link from "next/link";
import { SlReload } from "react-icons/sl";
import { FiSend } from "react-icons/fi";


const ControlButtons = ({handleNextQuestionClick,retryVisible, onRetryClick, isLoading, pertinence, handleSendPertinence }) => {
    return (
        <div className={"flex justify-center w-full gap-3"}>
            <Button color={"primary"} onClick={handleNextQuestionClick}
                    isDisabled={isLoading}>Valuate Chat</Button>
            <Button><Link href={"/system_prompt"}>system prompt</Link></Button>
            {retryVisible && <Button endContent={<SlReload className={"w-3/4 h-3/4"}/>} color={"warning"} onClick={onRetryClick}>Retry</Button>}
            {pertinence !== -1 && <Button color={"primary"} onClick={handleSendPertinence} endContent={<FiSend />}>Send Pertinence</Button>}
        </div>
    )
}

export default ControlButtons;