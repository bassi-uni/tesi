import {Button, Switch} from "@nextui-org/react";
import {MdDelete} from "react-icons/md";
import { VscDebugBreakpointLogUnverified } from "react-icons/vsc";
import { IoIosClose } from "react-icons/io";
import {setPromptSelectedServerAction} from "@/app/actions";
import {useTransition} from "react";
const SystemPromptsList = ({categories, filteredPrompts, handleDeletePrompt, handlePromptClick, isPending, setAvailablePrompts}) => {

    const [isPending2, startTransition] = useTransition();
    const handleSetSelected = promptID => isSelected => {
        startTransition(() => {
            setPromptSelectedServerAction(promptID, isSelected, "/system_prompt").then(()=> {
                setAvailablePrompts(prev => {
                    return prev.map(prompt => {
                        if(prompt.ID === promptID){
                            return {...prompt, isSelected: isSelected ? 1 : 0}
                        }
                        return prompt;

                })
            })})
        })
    };

    return (
        <ul className={"m-0 w-full h-[200px] overflow-y-scroll flex flex-col items-center gap-5"}>
            {categories.length >0 && filteredPrompts.map((prompt, index)=> {
                console.log({prompt})
                console.log("PROMPT IS SELECTED: " , prompt.isSelected )
                console.log("prompt.isSelcted === 1: ", prompt.isSelected === 1)
                return(
                    <li key={index}
                        className={"text-white p-2 bg-gray-700 rounded-md w-2/3 hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-between gap-20"}
                        onClick={handlePromptClick(prompt)}>
                        <label>{prompt.prompt} </label>
                        <Button
                            className={"flex items-center justify-center icona-delete"}
                            isIconOnly
                            onClick={handleDeletePrompt(prompt.ID)}
                            isDisabled={isPending}
                            color="default"
                        ><MdDelete
                            style={{margin: 0}}
                            className={"w-3/4 h-3/4 mr-0 "}/>
                        </Button>
                        <Switch
                            isSelected={prompt.isSelected === 1}
                            size="lg"
                            color="warning"
                            onValueChange={handleSetSelected(prompt.ID)}
                            startContent={<VscDebugBreakpointLogUnverified/>}
                            endContent={<IoIosClose/>}
                            isDisabled={isPending2}
                        >
                        </Switch>
                    </li>
                )
            })}
        </ul>
    )
}

export default SystemPromptsList