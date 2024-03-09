import {Animation} from "@/components/animation";
import {PertinenceInput} from "@/components/completion-control/pertinence-input";
import {Button} from "@nextui-org/react";

const SelectPertinence = ({isLoading, completion,setPertinence, sliderEnabled, pertinenceLabel, onOpen} ) => {
    return (
        <div className={"flex flex-col gap-10 h-full px-10 pb-10 "}>
            {/*<div className={"flex gap-10 w-[300px] justify-center items-center text-6xl self-center"}>
                <Animation/>
            </div>*/}
            {!isLoading && completion.trim() !== "" && <h1 className={"text-2xl font-bold"}>How would you rate the pertinence between question and answer?</h1>}

                <PertinenceInput onPertinenceChange={setPertinence} isEnabled={sliderEnabled} />

            {!isLoading && completion.trim() !== "" && pertinenceLabel}
        </div>
    )
}

export default SelectPertinence;