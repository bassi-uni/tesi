import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow} from "@nextui-org/react";
import SelectPertinence from "@/components/completion-control/select-pertinence";
import useChooseAnswer from "@/components/choose-answer/choose-answer.hook";
import ChoicesList from "@/components/choose-answer/choices-list";

const ChooseAnswer = ({isOpen, onOpenChange, onClose, question, promptIDs,withTranslation, selectedModel,onChooseInteraction}) => {
   const {
       chosenPromptID,
       enablePertinence,
       getIsLoading,
       getSetCompletion,
       handleChooseInteraction,
       handleChoseClick,
        pertinence,
       pertinenceLabel,
       setPertinence,
       overAllLoading,
       completions,
       isLoading
   } = useChooseAnswer({onChooseInteraction, onClose, promptIDs, question});

    return <Modal isOpen={isOpen} className="dark" onOpenChange={onOpenChange} backdrop="blur" size={"full"} onClose={()=>onClose(false)}>

        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className={"flex flex-col gap-1 text-white text-2xl"}>Choose you the best answer 🏆</ModalHeader>
                    <ScrollShadow hideScrollBar>
                        <ModalBody className="text-white flex flex-col items-center">

                                <ChoicesList
                                    promptIDs={promptIDs}
                                    chosenPromptID={chosenPromptID}
                                    getIsLoading={getIsLoading}
                                    overAllLoading={overAllLoading}
                                    question={question}
                                    selectedModel={selectedModel}
                                    completions={completions}
                                    getSetCompletion={getSetCompletion}
                                    withTranslation={withTranslation}
                                    handleChoseClick={handleChoseClick}
                                />

                            {enablePertinence &&
                                <div>
                                    <SelectPertinence setPertinence={setPertinence} pertinenceLabel={"Select the pertinence"} isEnabled={true} />
                                    {pertinenceLabel}
                                </div>
                            }
                        </ModalBody>
                    </ScrollShadow>
                    <ModalFooter>
                        {enablePertinence && pertinence !== -1 && <Button color="success" variant="shadow" onPress={handleChooseInteraction} isLoading={isLoading} isDisabled={isLoading}>Proceed</Button>}
                        <Button color="danger" variant="light" onPress={()=>onClose(false)} size={"xl"} isLoading={isLoading} isDisabled={isLoading} >
                            Close
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}

export default ChooseAnswer;