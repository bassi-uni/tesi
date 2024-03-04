import {Slider} from "@nextui-org/react";
import {PertinenceButton} from "@/components/completion-control/pertinence-button";
//from 1 to 5
const pertinenceLevels = Array.from({length: 5}, (_, i) => i + 1);
//color for worst to best in 5 step (red to green)
const pertinenceColors = ["bg-red-500", "bg-red-400", "bg-orange-300", "bg-green-400", "bg-green-500"]
export const pertinenceTextColors = ["text-red-500", "text-red-400", "text-orange-300", "text-green-400", "text-green-500"]
export const pertinenceLabels = ["Worst", "Bad", "Neutral", "Good", "Best"]


export const PertinenceInput = ({onPertinenceChange, isEnabled}) => {
    return (
        <div className={"flex gap-3"}>
            {pertinenceLevels.map((level,idx) => (
                <PertinenceButton onValueSelected={onPertinenceChange} value={level} key={idx} color={pertinenceColors[idx]} isEnabled={isEnabled}/>
            ))}
        </div>

    )

}