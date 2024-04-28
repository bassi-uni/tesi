import {GoDependabot} from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import {Cursor} from "@/components/token-area/cursor";
import CodeComponent from "./code-component";

import {ScrollShadow} from "@nextui-org/react";
import {useEffect, useRef} from "react";
import Interaction from "@/components/token-area/interaction";



const TokenArea = ({error,messages}) => {

    const scrollableRef = useRef(null);
    const lastMessage = messages[messages.length-1];

    useEffect(() => {
        if(scrollableRef.current){
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
    }, [lastMessage?.ai]);

    return (
        <div className={"h-full max-h-[400px] w-full flex flex-col gap-10 items-center font-AnonymusPro"}>
            <h1 className={"font-bold"}>Answer will be here:</h1>
            <ScrollShadow offset={200} ref={scrollableRef} orientation="horizontal" >
            <div className={"flex flex-col w-full h-full gap-6"}>

                    {messages.map(({ai,human},idx)=>(
                        <Interaction key={idx} ai={ai} human={human} isLoading={false} idx={idx} lengthOfMessages={messages.length} error={error}/>
                    ))}


            </div>
            </ScrollShadow>

        </div>
    )
}

export default TokenArea;