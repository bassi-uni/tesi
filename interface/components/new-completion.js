import {Button, Textarea} from "@nextui-org/react";

const NewCompletion = ({handleSubmit, setInput, input,error})=>{
    return (
        <form onSubmit={handleSubmit} className={"m-0 h-full w-full font-AnonymusPro"}>
            <Textarea placeholder={"Question will be here"} classNames={{
                base: "h-full",
                inputWrapper: "h-full max-h-full",
                input: "h-full max-h-full",
                mainWrapper: "h-full"
            }} size={"lg"} onValueChange={setInput} value={input} endContent={
                !error ? <Button type={"submit"} color={"primary"}>Submit</Button> : <Button color={"danger"} type={"submit"}>Retry</Button>
            } color={error ? "danger" : "default"}>Question will be here</Textarea>
        </form>
    )
}
export default NewCompletion;