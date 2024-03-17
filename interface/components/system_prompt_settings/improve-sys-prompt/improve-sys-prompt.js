
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ScrollShadow} from "@nextui-org/react";
import useImproveSystemPrompt from "./improve-sys-prompt.hook";




  
  const modalTitles = [
    'Do you want to check for System prompt improvements? (For admin)',
    'Please provide your suggestions',
    "AI Suggestions for improvement"
  ]

const SystemPromptImprovement = ({isOpen, onOpenChange, question, answer, promptID}) => {

    console.log({isOpen, onOpenChange, question, answer, promptID})
   const {isLoading,phase, phasesComponents } = useImproveSystemPrompt({question, answer, promptID});

    return <Modal isOpen={isOpen} className="dark max-h-[500px]" onOpenChange={onOpenChange} backdrop="blur">
       
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className={"flex flex-col gap-1 text-white"}>{modalTitles[phase]} </ModalHeader>
                    <ScrollShadow hideScrollBar>
                    <ModalBody className="text-white">
                  
                    { phasesComponents(onClose)[phase] }
                      
                    </ModalBody>
                    </ScrollShadow>
                    <ModalFooter>
                        {(phase === 0 ||  (phase === 1 && !isLoading)) && <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>}
                    </ModalFooter>
                </>
            )}
        </ModalContent>
      
        
    </Modal>
}

export default  SystemPromptImprovement;