import llama_cpp
import os
llm = llama_cpp.Llama(model_path=os.environ['MODEL'])
output = llm("Q: Name the planets in the solar system? A: ", max_tokens=512, stop=["Q:", "\n"], echo=True)
print(output['choices'][0]['text'])