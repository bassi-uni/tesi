export const models = {
    OPENCHAT: {
        name:'openchat:latest', 
        TEMPLATE_FN : (sp)=> `GPT4 Correct System: ${sp}<|end_of_turn|>
        GPT4 Correct User: {input}<|end_of_turn|>
        GPT4 Correct Assistant:
    
    `
    },
    LLAMA: 
    {
        name:'llama2:13b-chat-q4_0', 
        TEMPLATE_FN : (sp)=> `<s>[INST] <<SYS>>
        ${sp}
        <</SYS>>
        
        {input} [/INST]
    
    `
    },
    CODELLAMA: {
        name: 'codellama:13b-code',
        TEMPLATE_FN: (sp) => `${sp}.\n {input}`
    },
    MISTRAL: {
        name: "mistral:latest",  
    TEMPLATE_FN : (sp)=> `<s>[INST] ${sp} [/INST]</s>
    [INST] {input} [/INST]
    `
    },
}
