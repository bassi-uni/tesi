import {fetchStreamData} from "@/utils/utils";
import {useEffect, useState} from "react";
import {models as availableModels} from "@/utils/constants";
import {pertinenceLabels, pertinenceTextColors} from "@/components/completion-control/pertinence-input";
const TIMER_STEP = 10;
const useCompletion = ({categories, onOpen}) => {
    const [input, setInput] = useState("");
    const [completion, setCompletion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPromptID, setSelectedPromptID] = useState(""+categories[0].promptID);

    const [models, setModels] = useState(Object.keys(availableModels).map((m) => ({key:m,model:m})));
    const [selectedModel, setSelectedModel] = useState(models[0].model);
    const [withTranslation, setWithTranslation] = useState(false);
    const [timer, setTimer] = useState(0);
    const [pertinence, setPertinence] = useState(-1);

    useEffect(() => {
        let interval = null;

        if(isLoading){
            setTimer(0);
             interval = setInterval(() => {
                setTimer(prev => prev + TIMER_STEP);
            }, TIMER_STEP);
        }else{
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isLoading]);

    console.log({timer})
    const handleSubmit = (e) => {
        e.preventDefault();
        if(input.trim() === "") return;
        setError(null);
        setCompletion("");

        fetchStreamData("api/completion/ollama", {prompt: input, promptID: selectedPromptID, translation: (withTranslation ? 1 : 0), modelName:selectedModel}, (entireResponse) => {
            setCompletion(entireResponse);
        } , ()=>{
            setIsLoading(true)
        } , ()=>{
            setIsLoading(false);
            console.log({millisec: timer})
        }).catch(setError);
    }

    const handleNextQuestionClick = async () => {
        try {
            const res = await fetch("api/test", {
                method: "POST",
                body: JSON.stringify({question: input, answer: completion, pertinence, promptID: selectedPromptID, loadingTime: timer, model: selectedModel, withTranslation: withTranslation ? 1 : 0}),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            await res.json();
            onOpen();
            setInput("");
            setCompletion("");
        } catch (error) {
            console.error(error);
        }
    }

    const sliderEnabled = input.trim() !== "" && completion.trim() !== "" && !isLoading;

    const handleSelectionChange = (e) => {
        setSelectedPromptID(e.target.value);
    };

    const pertinenceLabel = pertinence !== -1 ? <label className={`font-bold ${pertinenceTextColors[pertinence-1]}`}>{pertinenceLabels[pertinence-1]}</label> : <label>Please select a pertinence level</label>;

    const changeOptionsDisabled = completion.trim().length > 0 || isLoading;


    return {
        input,
        setInput,
        completion,
        isLoading,
        error,
        handleSubmit,
        selectedPromptID,
        setModels,
        models,
        selectedModel,
        setSelectedModel,
        withTranslation,
        setWithTranslation,
        timer,
        sliderEnabled,
        handleCategoryChange: handleSelectionChange,
        pertinenceLabel,
        changeOptionsDisabled,
        pertinence,
        setPertinence,
        handleNextQuestionClick
    };
}

export default useCompletion;