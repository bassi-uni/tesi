import {useState} from "react";
import {pertinenceLabels, pertinenceTextColors} from "@/components/completion-control/pertinence-input";

const useChooseAnswer = ({onChooseInteraction, onClose, promptIDs, question}) => {
    const [chosenPromptID, setChosenPromptID] = useState(null);
    const [chosenCompletion, setChosenCompletion] = useState(null);
    const [pertinence, setPertinence] = useState(-1);
    const [overAllLoading, setOverAllLoading] = useState(promptIDs.map(() => false));
    const [completions, setCompletions] = useState(promptIDs.map(() => ""));
    const [isLoading, setIsLoading] = useState(false);


    const enablePertinence = chosenPromptID && overAllLoading.every(v => v===false) && completions.every(v => v.trim().length > 0);
    const handleChoseClick = (promptID, completion) => {
        setChosenPromptID(promptID);
        setChosenCompletion(completion);
    }

    const handleChooseInteraction = async () => {
        setIsLoading(true);
        await onChooseInteraction({chosenPromptID, chosenCompletion, pertinence, question, excludedPromptIDs: promptIDs.map(p=>p.promptID).filter(id => id !== chosenPromptID)});
        setIsLoading(false);
        onClose(true);
    }
    const pertinenceLabel = pertinence !== -1 ? <label className={`font-bold text-2xl ${pertinenceTextColors[pertinence-1]}`}>{pertinenceLabels[pertinence-1]}</label> : <label>Please select a pertinence level</label>;

    const getIsLoading = (idx)  => {
        return (isLoading) => {
            setOverAllLoading(prev => {
                const copy = [...prev];
                copy[idx] = isLoading;
                return copy;
            })
        };
    }

    const getSetCompletion = (idx) => {
        return (c) => {
            setCompletions(prev => {
                const copy = [...prev];
                copy[idx] = c;
                return copy;
            })
        };
    }

    return {
        chosenPromptID,
        pertinence,
        setPertinence,
        enablePertinence,
        handleChoseClick,
        handleChooseInteraction,
        pertinenceLabel,
        getIsLoading,
        getSetCompletion,
        overAllLoading,
        completions,
        isLoading
    }
}

export default useChooseAnswer;