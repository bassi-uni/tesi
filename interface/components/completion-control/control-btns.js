import {Button} from "@nextui-org/react";
import Link from "next/link";
import { SlReload } from "react-icons/sl";


const ControlButtons = ({handleNextQuestionClick, pertinence,retryVisible, onRetryClick }) => {
    return (
        <div className={"flex justify-center w-full gap-3"}>
            <Button color={"primary"} onClick={handleNextQuestionClick}
                    isDisabled={pertinence === -1}>SUBMIT</Button>
            <Button><Link href={"/system_prompt"}>system prompt</Link></Button>
            {retryVisible && <Button endContent={<SlReload className={"w-3/4 h-3/4"}/>} color={"warning"} onClick={onRetryClick}>Retry</Button>}
        </div>
    )
}

export default ControlButtons;