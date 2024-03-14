import {Button} from "@nextui-org/react";
import {MdDelete} from "react-icons/md";

const SystemPromptsList = ({categories, filteredPrompts, handleDeletePrompt, handlePromptClick, isPending}) => {
    return (
        <ul className={"m-0 w-full h-[200px] overflow-y-scroll flex flex-col items-center gap-5"}>
            {categories.length >0 && filteredPrompts.map((prompt, index)=>(
                <li key={index} className={"text-white p-2 bg-gray-700 rounded-md w-2/3 hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-between"} onClick={handlePromptClick(prompt)}>
                    <label>{prompt.prompt} </label>
                    <Button
                        className={"flex items-center justify-center icona-delete"}
                        isIconOnly
                        onClick={handleDeletePrompt(prompt.ID)}
                        isDisabled={isPending}
                        color="default"
                    ><MdDelete
                        style={{margin:0}}
                        className={"w-3/4 h-3/4 mr-0 "} />
                    </Button>
                </li>
            ))}
        </ul>
    )
}

export default SystemPromptsList