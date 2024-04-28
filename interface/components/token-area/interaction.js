import {FaRegUserCircle} from "react-icons/fa";
import {GoDependabot} from "react-icons/go";
import {Cursor} from "@/components/token-area/cursor";
import CodeComponent from "@/components/token-area/code-component";
const processCompletion = (completion) => {
    if(!completion) return "";
    // Split the completion into parts by detecting code blocks and line breaks
    const parts = completion.split(/(```[\s\S]*?```)|(\n)/g).filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
            // Remove the backticks from the start and end, and trim any whitespace
            const codeContent = part.slice(3, -3).trim();
            // Use your custom CodeComponent to render this part
            // eslint-disable-next-line react/jsx-key
            return <CodeComponent code={codeContent}  />
        } else if (part === "\n") {
            // Replace line breaks with <br> elements
            return <br key={index} />;
        } else {
            // Return the text part as is
            return part;
        }
    });
};
const Interaction = ({human,ai, isLoading, idx, lengthOfMessages, error, showCursorWhenLoading}) => {
    return <div className={"flex flex-col gap-3"}>
        <div className={"flex w-full h-full items-center p-5 bg-green-300/50 rounded-2xl"}>
            {/*<FaRegUserCircle className={"text-3xl shrink-0"}/>*/}
            <p className={"pt-1"}>{human}</p>
        </div>
        <div className={"flex w-full h-full items-center p-5 bg-primary-600/50 rounded-2xl"}>
            {/*<GoDependabot className={"text-3xl shrink-0"}/>*/}
            <p className={"pt-1"}>{processCompletion(ai)}{((isLoading && idx===lengthOfMessages && !error) || (isLoading && showCursorWhenLoading)) && <Cursor/>}</p>
        </div>
    </div>
}
export default Interaction;