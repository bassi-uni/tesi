import {fetchStreamData} from "@/utils/utils";
import {useEffect, useState, useTransition} from "react";
import {CHROMA_COLLECTION, models as availableModels} from "@/utils/constants";
import {pertinenceLabels, pertinenceTextColors} from "@/components/completion-control/pertinence-input";
import { set } from "zod";
const TIMER_STEP = 10;

const useChat = ({categories, onOpen, onChooseAnswerOpen}) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [models, setModels] = useState(Object.keys(availableModels).map((m) => ({key:m,model:m})));
    const [selectedModel, setSelectedModel] = useState(models[0].model);
    const [withTranslation, setWithTranslation] = useState(false);
    const [pertinence, setPertinence] = useState(-1);
    const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.ID);

    const selectedPrompts = categories.find(c => c.ID === selectedCategoryId)?.promptIDs || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessages(prev => [...prev, {
            human: input,
            ai: "",
            timer: 0
        }]);

        onChooseAnswerOpen();
    }



    const handleSendPertinence = async () => {
        try {
            const avgTime = messages.length === 0 ? 0 : messages.reduce((acc, curr) => acc + curr.timer, 0) / messages.length;
            console.log({messages})
            const res = await fetch("api/test", {
                method: "POST",
                body: JSON.stringify({ interactions: messages, loadingTime: avgTime, model: selectedModel, withTranslation: withTranslation ? 1 : 0}),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            await res.json();
            await reset();
        } catch (error) {
            console.error(error);
        }
    }


    const handleSelectionChange = (e) => {
        setSelectedCategoryId(+e.target.value);
    };
    const deleteChromaDBContent = async () => {
        const res = await fetch("api/chroma", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: CHROMA_COLLECTION})
        });
        console.log(res.status);
    }

    const reset = async () => {
        setInput("");
        setMessages([]);
        setPertinence(-1)
        await deleteChromaDBContent();
    }


    const onChooseInteraction = async ({chosenPromptID, chosenCompletion, pertinence, question, excludedPromptIDs}) => {
        console.log({chosenPromptID, chosenCompletion, pertinence, question, excludedPromptIDs})
        const res = await fetch("api/chroma" , {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                model: selectedModel,
                human: question,
                ai: chosenCompletion,
                promptID: chosenPromptID,
            })});
        const json = await res.json();
        console.log({json})
        setMessages(prev => {
            const lastMex = prev[prev.length-1];
            prev[prev.length-1] = {
                ...lastMex,
                ai: chosenCompletion,
                pertinence,
                chosenPromptID,
                excludedPromptIDs
            };
            return [...prev];
        })
    }



    const changeOptionsDisabled = false

    const handleChooseAnswerClose = (isAllFinished) => {



    }
    return {
        input,
        setInput,
        messages,
        handleSubmit,
        setModels,
        models,
        selectedModel,
        setSelectedModel,
        withTranslation,
        setWithTranslation,
        handleCategoryChange: handleSelectionChange,
        changeOptionsDisabled,
        handleNextQuestionClick: handleSendPertinence,
        onCloseMetaPrompt:reset,
        reset,
        selectedCategoryId,
        selectedPrompts,
        onChooseInteraction,
        setMessages

    };
}

export default useChat;