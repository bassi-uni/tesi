export const models = {
    OPENCHAT: {
        name:'openchat:latest', 
        TEMPLATE_FN : (sp)=> `GPT4 Correct System: ${sp}<|end_of_turn|>
GPT4 Correct User: {input}<|end_of_turn|>
GPT4 Correct Assistant:
    
    `,
        TEMPLATE_FN_HISTORY: (sp)=> `GPT4 Correct System: ${sp}<|end_of_turn|>
        ### Relevant pieces of previous conversation:
        {history}
        ###
        GPT4 Correct User: {input}<|end_of_turn|>
        GPT4 Correct Assistant:
`,
        userInteractionTemplate: i => {
            console.log({human: i})
            return {
                "GPT4 Correct User": `${i}<|end_of_turn|>`
            }
        },
        AIInteractionTemplate: i => {
            console.log({ai:i})
            return {
                "GPT4 Correct Assistant": `${i}<|end_of_turn|>`
            }
        }

    },
    LLAMA: 
    {
        name:'llama2:13b-chat-q4_0', 
        TEMPLATE_FN : (sp)=> `<s>[INST] <<SYS>>
${sp}
<</SYS>>
        
{input} [/INST]
    
    `,
        TEMPLATE_FN_HISTORY: (sp)=> `<s>[INST] <<SYS>>
        ${sp}
        <</SYS>>
        
        {history}

        <s>[INST] {input} [/INST]
        `,        
        userInteractionTemplate: i => ({"" : `${i}[/INST]`}),
        AIInteractionTemplate: i => ({"" : `${i}</s>`})

    },
    CODELLAMA: {
        name: 'codellama:13b-code',
        TEMPLATE_FN: (sp)=> `${sp}. {input}`,
        TEMPLATE_FN_HISTORY: (sp)=> `${sp}. 
Here is pertinent information from the previous conversation that you can use:
{history}.
{input}`,
        userInteractionTemplate: i => ({"User" : `${i}`}),
        AIInteractionTemplate: i => ({"CodeLlama" : `${i}`})
    },
    MISTRAL: {
        name: "mistral:latest",  
        TEMPLATE_FN : (sp)=> `<s>[INST] ${sp} [/INST]</s>
[INST] {input} [/INST]
    `,
        TEMPLATE_FN_HISTORY: (sp)=> `<s>[INST] ${sp}
### Relevant pieces of previous conversation:
{history}
### 
</s>
[INST] {input} [/INST]
    `,
        userInteractionTemplate: i => ({"Human" : `${i} [/INST]`}),
        AIInteractionTemplate: i => ({"AI" : `${i}`})
    },
//<s>[INST] ${sp} Relevant pieces of previous conversation: ${i} [/INST] ${ai}</s>
}


export const prompts = {
    META_PROMPT: `
Assistant has just had the below interactions with a User. Assistant followed their "Instructions" closely. Your job is to critique the Assistant's performance and then revise the Instructions so that Assistant would quickly and correctly respond in the future.

####

{chat_history}

####

Please reflect on these interactions.

User suggestions: {suggestions}

You should first critique Assistant's performance. Keeping in mind also the user suggestions if there is some. What could Assistant have done better? What should the Assistant remember about this user? Are there things this user always wants? Indicate this with "Critique: ...".

You should next revise the Instructions so that Assistant would quickly and correctly respond in the future. Assistant's goal is to satisfy the user in as few interactions as possible. Assistant will only see the new Instructions, not the interaction history, so anything important must be summarized in the Instructions. Don't forget any important details in the current Instructions! Indicate the new Instructions by "Instructions: ...".
    
    `,
    TRANSLATION_PROMPT: `Given a sentence by User, translate that sentence into {language}, you have also to recognize the language which is used for writing the sentence. 
Do not provide any code, just translate and recognize the language.
Do not translate code keywords.
For example, do not translate "print" or "function".
{format_instructions}
Do not provide any other extra information, only the formatted JSON response.
Examples of translations into English:
GPT4 Correct User: Dammi la ricetta per la pasta alla carbonara<|end_of_turn|>
GPT4 Correct Assistant: {{
    "recognized_language": "Italian",
    "translation": "Give me the recipe for pasta alla carbonara"
}}
<|end_of_turn|>
GPT4 Correct User: Trova il bug in questo codice: 
def fibonacci:  
    if n <= 1:  
        return n  
    else:  
        return(fibonacci(n-1) + fibonacci(n-2))
<|end_of_turn|>
GPT4 Correct Assistant: {{
    "recognized_language": "Italian",
    "translation": "Find the bug in the following code: 
def fibonacci:  
    if n <= 1:  
        return n  
    else:  
        return(fibonacci(n-1) + fibonacci(n-2))"
    }}
<|end_of_turn|>
--END OF EXAMPLES--
    `,
    RETRANSLATION_PROMPT: [
        ["system", "Given a sentence by User, translate that sentence into {language}, do not add any other extra information or characters, do not translate words that are used in the same way in all languages or Proper Names. For example, do not translate 'Jhon' or 'New York'. Do not translate code from programming languages. For example, do not translate 'print(\"Hello Word!\")' or 'function'."],
        ["user", "Translate this sentence into English:\n'Ciao, come stai?'"],
        ["ai", "Hello, how are you?"],
        ["user", "Translate this sentence into Italian:\n'Je suis un homme'"],
        ["ai", "Sono un uomo"],
        ["user", "Translate this sentence into Italian:\n'def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)'"],
        ["ai", "def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)"],
        ["user", "Translate this sentence into {language}:\n'{input}'"],
    ]


}

export const CHROMA_COLLECTION = "testchat";