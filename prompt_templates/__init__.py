
"""
    @:param sp: The system prompt to be used in the template
"""
def llama_template(sp):
    return f"""<<SYS>>\n{sp} \n<</SYS>>\n\n [INST] Using the following context, please answer the question: {{input}}. \n\n {{history}}[/INST]"""

def mistral_7b_template(sp):
    return f"""<s>[INST] {sp} [/INST] </s>[INST]  Using the following context, please answer the question:  {{input}}. \n\n {{history}}[/INST]"""


prompt_templates = {
    "LLAMA": {
        "template": llama_template,
        "key": "LLAMA"
    },
    "MISTRAL7B": {
        "template": mistral_7b_template,
        "key": "MISTRAL7B"
    }
}

model_types = {
    "LLAMA": "LLAMA",
    "GPT4ALL": "GPT4ALL"
}

memory_types = {
    "BUFFER": "BUFFER",
    "WINDOW": "WINDOW",
    "SUMMARY": "SUMMARY",
    "BUFFER_SUMMARY": "BUFFER_SUMMARY",
}

llms_paths = {
    "CODE": {
        "LLAMA": "/Users/francescobassignana/models/7B/codellama-7b.Q4_0.gguf"
    },
    "CHAT": {
        "LLAMA":  "/Users/francescobassignana/models/meta-models/llama-2-13b-chat/13b-llama-ggml-model-q4_0.gguf",
        "MISTRAL7B": "/Users/francescobassignana/Library/Application Support/nomic.ai/GPT4All/mistral-7b-openorca.Q4_0.gguf"
    }
}