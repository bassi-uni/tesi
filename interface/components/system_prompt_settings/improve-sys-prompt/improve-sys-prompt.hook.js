import MetaSuggestions from "./meta-suggestions";
import {Button, Textarea} from "@nextui-org/react";
import {useCallback, useState} from "react";
import {fetchStreamData} from "@/utils/utils";
const getCritiqueAndInstructions = (thatString) => {
    let critique = '';
    let instruction = '';
  
    const critiqueIndex = thatString.indexOf('Critique:');
    const instructionIndex = thatString.indexOf('Instructions:');
  
    // Check if 'critique:' is found
    if (critiqueIndex !== -1) {
      // Extract everything after 'critique:'
      critique = critiqueIndex + 'Critique:'.length < thatString.length ? thatString.slice(critiqueIndex + 'Critique:'.length, instructionIndex !== -1 ? instructionIndex : thatString.length) : '';
    }
  
    // Check if 'instructions:' is found
    if (instructionIndex !== -1) {
      // Extract everything after 'instructions:'
      instruction = instructionIndex + 'Instructions:'.length < thatString.length ? thatString.slice(instructionIndex + 'Instructions:'.length) : '';
    }
  
    return { critique, instruction };
  }



const useImproveSystemPrompt = ({messages, promptID}) => {
    const [phase, setPhase] = useState(0);
    const [suggestions, setSuggestions] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userSuggestions, setUserSuggestions] = useState("");



    const nextPhaseHandler =useCallback(_ => {
        if(phase === 0){
            setPhase(1);
            return;
        }

        setPhase(2);
        console.log({messages})
        fetchStreamData("api/meta-prompting", {messages:messages.map(({human,ai,timer}) => ({human,ai})), promptID, suggestions: userSuggestions} ,

            (entireResponse) => {
                console.log({entireResponse})
                setSuggestions(entireResponse);
            },

            ()=> {
                setIsLoading(true);
            } ,

            () => {
                setIsLoading(false);
            }).catch(setError);
    }, [phase, messages, promptID, userSuggestions])


    const {critique, instruction} = getCritiqueAndInstructions(suggestions);
    
    const phasesComponents = useCallback ((onClose)=>[
        <>
            <Button color="primary" onPress={nextPhaseHandler}>Yes</Button>
            <Button onPress={onClose}>No</Button>
        </>,
        <>
            <Textarea  value={userSuggestions} onValueChange={setUserSuggestions} placeholder="e.g.: Assistaint should be more..."/>
            <Button color="primary" onPress={nextPhaseHandler}>Next</Button>
        </>,
        <MetaSuggestions key={2} messages={messages} critique={critique} instruction={instruction} />

    ], [nextPhaseHandler, userSuggestions, messages, critique, instruction]);

    
    return {phasesComponents, phase, setPhase, suggestions, isLoading, error, nextPhaseHandler, getCritiqueAndInstructions};
}

export default useImproveSystemPrompt;