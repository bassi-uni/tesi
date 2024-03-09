import { copyToClipboard, fetchStreamData } from "@/utils/utils";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Tooltip, ScrollShadow} from "@nextui-org/react";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";



function getCritiqueAndInstructions(thatString) {
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
  

const SystemPromptImprovement = ({isOpen, onOpenChange, question, answer, promptID}) => {

    const [phase, setPhase] = useState(0);
    const [suggestions, setSuggestions] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const nextPhaseHandler = e => {
        setPhase(1);
        fetchStreamData("api/meta-prompting", {question, answer, promptID} , 
        //when a chunck arrives
        (entireResponse) => {
            console.log({entireResponse})
            setSuggestions(entireResponse);
        }, 
        //right before the request is sent
        ()=> {
            setIsLoading(true);
        } , 
        //right after the request is completed
        () => {
            setIsLoading(false);
        }).catch(setError);
    }

    const {critique, instruction} = getCritiqueAndInstructions(suggestions);
    console.log({critique, instruction})

    return <Modal isOpen={isOpen} className="dark max-h-[500px]" onOpenChange={onOpenChange} backdrop="blur">
       
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className={"flex flex-col gap-1 text-white"}>Wuold you like to feedback the quality? </ModalHeader>
                    <ScrollShadow hideScrollBar>
                    <ModalBody >
                  
                    {
                      phase === 0 && <>
                        <Button color="primary" onPress={nextPhaseHandler}>Yes</Button>
                        <Button onPress={onClose}>No</Button>
                        </>
                    }
                    {
                        phase === 1 && <>
                            <p>Question: {question}</p>
                            <p>Answer: {answer}</p>
                            <label className="text-2xl text-primary" >Suggestions</label>
                       
                            <label className="font-AnonymusPro text-primary font-bold">Critique</label>
                            <p>{critique}</p>
                            <label className="font-AnonymusPro text-primary font-bold">Instructions</label>
                            <Textarea value={instruction} endContent={
                            <Tooltip className="dark" content="Copy to the clip board">
                                <Button isIconOnly onPress={()=>copyToClipboard(instruction)}><FaRegCopy /></Button>
                            </Tooltip>} isReadOnly/>
                            
                        </>

                    }
                      
                    </ModalBody>
                    </ScrollShadow>
                    <ModalFooter>
                        {(phase === 0 ||  (phase === 1 && !isLoading)) && <Button color="danger" variant="light" onPress={()=>{
                            setPhase(0);
                            setSuggestions("");
                            setError(null);
                            onClose();
                        }}>
                            Close
                        </Button>}
                    </ModalFooter>
                </>
            )}
        </ModalContent>
      
        
    </Modal>
}

export default  SystemPromptImprovement;