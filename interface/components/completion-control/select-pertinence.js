import {PertinenceInput} from "@/components/completion-control/pertinence-input";

const SelectPertinence = ({setPertinence, isEnabled, pertinenceLabel} ) => {
    return (
        <div className={"flex flex-col gap-10 h-full pb-10 "}>

            {isEnabled && <h1 className={"text-2xl font-bold"}>How would you rate the pertinence between question and answer?</h1>}

                <PertinenceInput onPertinenceChange={setPertinence} isEnabled={isEnabled} />

            {isEnabled && pertinenceLabel}
        </div>
    )
}

export default SelectPertinence;