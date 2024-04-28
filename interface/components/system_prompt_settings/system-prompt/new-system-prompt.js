import {Button, Input, Textarea} from "@nextui-org/react";
import Link from "next/link";

const NewSystemPrompt = ({prompt, setPrompt, formAction}) => {
    return (
        <form className={"w-1/2 flex flex-col items-center justify-center gap-3 dark"} action={formAction}>
            <Textarea label={"Enter Your System Prompt"} placeholder={"System prompt"} size={"lg"}
                      className={"dark text-white"} key={"prompt"} id={"prompt"} name={"prompt"} value={prompt} onValueChange={setPrompt}/>
            <Input label={"Enter Key features of the prompt"} name={"keyFeatures"} />

            <div className={"w-full flex items-center gap-10"}>
                <Link href={"/"}>
                    <Button size={"lg"} color={"danger"} className={"text-black"}>Exit</Button>
                </Link>
                <Button size={"lg"} color={"primary"} className={"text-black"} type={"submit"}>Submit
                    Prompt</Button>
            </div>
        </form>

    )
}

export default NewSystemPrompt