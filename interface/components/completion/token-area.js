import {GoDependabot} from "react-icons/go";
import {Cursor} from "@/components/completion/cursor";
import CodeComponent from "./code-component";

const processCompletion = (completion) => {
    // Split the completion into parts by detecting code blocks and line breaks
    const parts = completion.split(/(```[\s\S]*?```)|(\n)/g).filter(Boolean);
  
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Remove the backticks from the start and end, and trim any whitespace
        const codeContent = part.slice(3, -3).trim();
        // Use your custom CodeComponent to render this part
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

const TokenArea = ({completion, isLoading, error}) => {
    return (
        <div className={"h-full max-h-[400px] w-full flex flex-col gap-10 items-center font-AnonymusPro overflow-y-scroll"}>
            <h1 className={"font-bold"}>Answer will be here:</h1>
            <div className={"flex w-full h-full items-center gap-4"}>
                <GoDependabot className={"text-3xl shrink-0"} /> <p className={"pt-1"}>{processCompletion(completion)}{isLoading && !error && <Cursor/>}</p>
            </div>

        </div>
    )
}

export default TokenArea;