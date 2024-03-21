import {GoDependabot} from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import {Cursor} from "@/components/completion/cursor";
import CodeComponent from "./code-component";

import {ScrollShadow} from "@nextui-org/react";

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

const TokenArea = ({isLoading, error,messages}) => {
    return (
        <div className={"h-full max-h-[400px] w-full flex flex-col gap-10 items-center font-AnonymusPro overflow-y-scroll"}>
            <h1 className={"font-bold"}>Answer will be here:</h1>
            <ScrollShadow offset={200}>
            <div className={"flex flex-col w-full h-full gap-6"}>

                    {messages.map(({ai,human},idx)=>(
                        <div key={idx} className={"flex flex-col gap-6"}>
                            <div className={"flex w-full h-full items-center gap-4"}>
                                <FaRegUserCircle className={"text-3xl shrink-0"} />
                                <p className={"pt-1"}>{human}</p>
                            </div>
                            <div className={"flex w-full h-full items-center gap-4"}>
                                <GoDependabot className={"text-3xl shrink-0"} />
                                <p className={"pt-1"}>{processCompletion(ai)}{isLoading && idx===messages.length-1 && !error && <Cursor/>}</p>
                            </div>
                        </div>

                    ))}


            </div>
            </ScrollShadow>

        </div>
    )
}

export default TokenArea;