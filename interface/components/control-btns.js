import {Button} from "@nextui-org/react";

const ControlButtons = ({handleNextQuestionClick, pertinence,setSettingPromptVisible }) => {
    return (
        <div className={"flex justify-center w-full gap-3"}>
            <Button color={"primary"} onClick={handleNextQuestionClick}
                    isDisabled={pertinence === -1}>SUBMIT</Button>
            <Button onClick={()=>{setSettingPromptVisible(true)}}>Set system prompt</Button>
        </div>
    )
}

export default ControlButtons;