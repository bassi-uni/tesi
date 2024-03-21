import {fetchStreamData} from "@/utils/utils";
import {useEffect, useState} from "react";
import {models as availableModels} from "@/utils/constants";
import {pertinenceLabels, pertinenceTextColors} from "@/components/completion-control/pertinence-input";
const TIMER_STEP = 10;
export const dummyMessages = [
    {
        human: "What is the capital of France?",
        ai: "The capital of France is Paris"
    },
    {
        human: "What is the capital of Spain?",
        ai: "The capital of Spain is Madrid"
    }
]
const useChat = ({categories, onOpen}) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPromptID, setSelectedPromptID] = useState(""+categories[0].promptID);
    const [models, setModels] = useState(Object.keys(availableModels).map((m) => ({key:m,model:m})));
    const [selectedModel, setSelectedModel] = useState(models[0].model);
    const [withTranslation, setWithTranslation] = useState(false);
    const [pertinence, setPertinence] = useState(-1);
    const [enablePertinence, setEnablePertinence] = useState(false);


    console.log({messages})

    useEffect(() => {
        let interval = null;

        if(isLoading){
             interval = setInterval(() => {

                 setMessages(prev => {
                     const lastMex = prev[prev.length-1];
                     const prevTimer = lastMex.timer;
                     prev[prev.length-1] = {
                         ...lastMex,
                         timer: prevTimer + TIMER_STEP
                     };
                     return [...prev];
                 });
            }, TIMER_STEP);
        }else{
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isLoading]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if(input.trim() === "") return;
        setError(null);
        console.log({input})
        const lastMex = messages.length === 0 ? undefined : messages[messages.length-1];


        console.log({lastMex})

        setMessages(prev => [...prev, {human: input, ai: "", timer: 0}]);



        fetchStreamData("api/completion/chat", {previousMessage:lastMex, prompt: input, promptID: selectedPromptID, translation: (withTranslation ? 1 : 0), modelName:selectedModel}, (entireResponse) => {
            setMessages(prev => {
                const lastMex = prev[prev.length-1];
                prev[prev.length-1] = {
                    ...lastMex,
                    ai: entireResponse
                };
                return [...prev];
            });
        } , ()=>{
            setIsLoading(true)
        } , ()=>{

            setIsLoading(false);

        }).catch(setError);
    }

    const handleNextQuestionClick = async () => {
        setEnablePertinence(true);

    }

    const handleSendPertinence = async () => {
        try {
            const avgTime = messages.length === 0 ? 0 : messages.reduce((acc, curr) => acc + curr.timer, 0) / messages.length;
            const res = await fetch("api/test2", {
                method: "POST",
                body: JSON.stringify({ interactions: messages.map(({human, ai, ..._}) => ({human, ai})), pertinence, promptID: selectedPromptID, loadingTime: avgTime, model: selectedModel, withTranslation: withTranslation ? 1 : 0}),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            await res.json();
            onOpen();
            // setInput("");
            // setMessages("");
        } catch (error) {
            console.error(error);
        }
    }


    const handleSelectionChange = (e) => {
        setSelectedPromptID(e.target.value);
    };


    const pertinenceLabel = pertinence !== -1 ? <label className={`font-bold ${pertinenceTextColors[pertinence-1]}`}>{pertinenceLabels[pertinence-1]}</label> : <label>Please select a pertinence level</label>;

    const changeOptionsDisabled = false


    return {
        input,
        setInput,
        messages,
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
        sliderEnabled: enablePertinence,
        handleCategoryChange: handleSelectionChange,
        pertinenceLabel,
        changeOptionsDisabled,
        pertinence,
        setPertinence,
        handleNextQuestionClick,
        setMessages,
        setEnablePertinence,
        handleSendPertinence
    };
}

export default useChat;