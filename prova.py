# Load model directly
import os

os.environ['KMP_DUPLICATE_LIB_OK']='True'
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForCausalLM, pipeline
from langchain_community.llms import HuggingFacePipeline


model_id = "facebook/nllb-200-distilled-1.3B"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

pipe = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=tokenizer,
    max_length=100
)
local_llm = HuggingFacePipeline(pipeline=pipe)

local_llm("Translate 'Ciao, come stai?' to English")