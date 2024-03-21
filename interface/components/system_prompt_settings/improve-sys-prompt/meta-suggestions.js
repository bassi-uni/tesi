import {Button, Textarea, Tooltip} from "@nextui-org/react";
import {copyToClipboard} from "@/utils/utils";
import {FaRegCopy} from "react-icons/fa";
import {GoDependabot} from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";

const MetaSuggestions = ({messages, instruction, critique}) => {
    return(
        <>
            <h1>Messages</h1>
            <div className={"flex flex-col gap-6"}>
                {messages.map((message, index) => {
                    const entries = Object.entries(message);
                    return entries.map(([key, value]) => (
                        <div key={index} className={"flex gap-3"}>
                            {key === "human" && <FaRegUserCircle />}
                            {key === "ai" && <GoDependabot />}
                            <p>{value}</p>
                        </div>
                    ))

                })}
            </div>
            <label className="text-2xl text-primary" >Suggestions</label>
    
            <label className="font-AnonymusPro text-primary font-bold">Critique</label>
            <p>{critique}</p>
            <label className="font-AnonymusPro text-primary font-bold">Instructions</label>
            <Textarea 
                value={instruction} 
                endContent={
                    <Tooltip className="dark text-white" content="Copy to the clip board">
                        <Button isIconOnly onPress={()=>copyToClipboard(instruction)}><FaRegCopy /></Button>
                    </Tooltip>
                } 
                isReadOnly
            />
        
        </>
    )
}

export default MetaSuggestions;