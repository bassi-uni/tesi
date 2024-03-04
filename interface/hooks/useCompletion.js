import {fetchStreamData} from "@/utils/utils";
import {useEffect, useState} from "react";
import {models as availableModels} from "@/utils/constants";
const TIMER_STEP = 10;
const useCompletion = () => {
    const [input, setInput] = useState("");
    const [completion, setCompletion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("1");

    const [models, setModels] = useState(Object.keys(availableModels).map((m,idx) => ({key:m,model:m})));

    const [selectedModel, setSelectedModel] = useState(models[0].model);
    const [withTranslation, setWithTranslation] = useState(false);
    const [timer, setTimer] = useState(0);

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

        fetchStreamData("api/completion/ollama", {prompt: input, category: selectedCategory, translation: (withTranslation ? 1 : 0), modelName:selectedModel}, (entireResponse) => {
            setCompletion(entireResponse);
        } , ()=>{
            setIsLoading(true)
        } , ()=>{
            setIsLoading(false);
            console.log({millisec: timer})
        }).catch(setError);
    }

    return {input, setInput, completion, setCompletion, isLoading, error, handleSubmit, setSelectedCategory, selectedCategory, setModels, models, selectedModel, setSelectedModel, withTranslation, setWithTranslation, timer};
}

export default useCompletion;