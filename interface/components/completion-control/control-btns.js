import {Button} from "@nextui-org/react";
import Link from "next/link";

const ControlButtons = ({handleNextQuestionClick, pertinence,setSettingPromptVisible }) => {
    return (
        <div className={"flex justify-center w-full gap-3"}>
            <Button color={"primary"} onClick={handleNextQuestionClick}
                    isDisabled={pertinence === -1}>SUBMIT</Button>
            <Button><Link href={"/system_prompt"}>system prompt</Link></Button>
        </div>
    )
}

export default ControlButtons;