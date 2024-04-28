import { adjustPrompt } from "@/utils/langchain/meta-prompting";


export async function POST(req){

    const {messages, suggestions} = await req.json();

    return await adjustPrompt({
        messages:messages.map(({human,ai, ...rest}) => {
            return {human, ai}
        }),
        suggestions
    });
}