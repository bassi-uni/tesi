import SystemPromptSettings from "@/components/system_prompt_settings/system-prompt-settings";
import {getAllSystemPrompts, getAllUCs} from "@/utils/db-operations";


const SystemPrompt = async()=>{


    const availablePrompts = getAllSystemPrompts();
    const UCs = getAllUCs(false)

    console.log({UCs, availablePrompts})

    return (
        <div className={"h-full w-[100vw] flex flex-col justify-center items-center fixed top-0 left-0 z-50 bg-black/70 backdrop-blur-xl gap-[100px] overflow-y-scroll"}>
            <h1 className={"text-white text-5xl"}>System Prompt Setting</h1>

            <SystemPromptSettings categories={UCs} availablePrompts={availablePrompts}/>
        </div>
    )
}

export default SystemPrompt;