import {Button, Textarea, Tooltip} from "@nextui-org/react";
import {copyToClipboard} from "@/utils/utils";
import {FaRegCopy} from "react-icons/fa";

const MetaSuggestions = ({question, answer, instruction, critique}) => {
    return(
        <>
            <p>Question: {question}</p>
            <p>Answer: {answer}</p>
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