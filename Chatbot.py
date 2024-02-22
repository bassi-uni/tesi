
from prompt_templates import prompt_templates, model_types, memory_types
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.prompts import PromptTemplate
from langchain_community.llms import LlamaCpp, GPT4All
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory, ConversationSummaryMemory, ConversationBufferMemory, \
    ConversationBufferWindowMemory


class ChatBot:
    """
    A class to represent a chatbot using the LlamaCpp library.
    """

    def __init__(self, llmPath, model_type: str, prompt_template_type: str, memory_type:str, system_prompt=None):
        """
        Initialize the ChatBot with the given parameters.
        """

        self.PROMPT = None
        self.llm = None
        self.memory = None

        self.model_setup(model_type, {"llmPath": llmPath, "n_gpu_layers": 1, "n_batch": 1024})

        self.prompt_template_setup(prompt_template_type, system_prompt)

        self.memory_setup(memory_type)

        self.conversation = ConversationChain(
            llm=self.llm,
            verbose=True,
            memory=self.memory,
            prompt=self.PROMPT,
        )

    def predict(self, input):
        """
        Predict the response of the chatbot to the given input.
        """
        if not input:
            print("Input cannot be empty.")
            return

        try:
            return self.conversation.predict(input=input)
        except Exception as e:
            print(f"Error predicting response: {e}")

    def load_memory(self, memory_variables):

        if not memory_variables:
            print("Memory variables cannot be empty.")
            return

        try:
            self.memory.load_memory_variables(memory_variables)
        except Exception as e:
            print(f"Error loading memory variables: {e}")

    def model_setup(self, model_type, options):
        print(f"Setting up model: {model_type}")
        # if model_type is not in keys of model_types, raise ValueError
        if model_type not in model_types.keys():
            raise ValueError(f"Invalid model type: {model_type}")

        callbacks = [StreamingStdOutCallbackHandler()]

        callback_manager = CallbackManager(callbacks)
        llm = None
        if model_type == model_types["LLAMA"]:
            try:
                llm = LlamaCpp(
                    model_path=options["llmPath"],
                    n_gpu_layers=options["n_gpu_layers"],
                    n_batch=options["n_batch"],
                    f16_kv=True,
                    callback_manager=callback_manager,
                    verbose=True,
                    n_ctx=2048,
                )
            except Exception as e:
                print(f"Error initializing LlamaCpp: {e}")
                return
        elif model_type == model_types["GPT4ALL"]:
            try:
                llm = GPT4All(model=options["llmPath"], callbacks=callbacks)
            except Exception as e:
                print(f"Error initializing GPT4All: {e}")
                return
        else:
            raise ValueError(f"Invalid model type: {model_type}")

        self.llm = llm

    def prompt_template_setup(self, prompt_template_type, system_prompt=None):
        print(f"Setting up prompt template: {prompt_template_type}")
        # if prompt_template_type is not in keys of prompt_templates, raise ValueError
        if prompt_template_type not in prompt_templates.keys():
            raise ValueError(f"Invalid prompt template type: {prompt_template_type}")

        if not system_prompt:
            system_prompt = """You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.
            If a question does not make any sense, or it's not coherent with itself, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information. The AI is not allowed to anticipate conversation (like aske and answer thing by itrself)
            """

        if prompt_template_type == prompt_templates["LLAMA"]["key"]:

            self.PROMPT = PromptTemplate(
                input_variables=["history", "input"],
                template=prompt_templates["LLAMA"]["template"](system_prompt)
            )

        elif prompt_template_type == prompt_templates["MISTRAL7B"]["key"]:
            print("Setting up MISTRAL7B prompt template")
            self.PROMPT = PromptTemplate(
                input_variables=["history", "input"],
                template=prompt_templates["MISTRAL7B"]["template"](system_prompt)
            )
        else:

            raise ValueError(f"Invalid prompt template type: {prompt_template_type}")

    def memory_setup(self, memory_type):
        if memory_type not in memory_types.keys():
            raise ValueError(f"Invalid memory type: {memory_type}")

        if memory_type == memory_types["BUFFER"]:
            self.memory = ConversationBufferMemory()
        elif memory_type == memory_types["WINDOW"]:
            self.memory = ConversationBufferWindowMemory(k=2)
        elif memory_type == memory_types["SUMMARY"]:
            self.memory = ConversationSummaryMemory(max_token_limit=200, llm=self.llm)
        elif memory_type == memory_types["BUFFER_SUMMARY"]:
            self.memory = ConversationSummaryBufferMemory(max_token_limit=200, k=2, llm=self.llm)
        else:
            raise ValueError(f"Invalid memory type: {memory_type}")


