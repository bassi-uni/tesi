import {PertinenceInput} from "@/components/completion-control/pertinence-input";

const SelectPertinence = ({setPertinence, sliderEnabled, pertinenceLabel} ) => {
    return (
        <div className={"flex flex-col gap-10 h-full px-10 pb-10 "}>

            {sliderEnabled && <h1 className={"text-2xl font-bold"}>How would you rate the pertinence between question and answer?</h1>}

                <PertinenceInput onPertinenceChange={setPertinence} isEnabled={sliderEnabled} />

            {sliderEnabled && pertinenceLabel}
        </div>
    )
}

export default SelectPertinence;