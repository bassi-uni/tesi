"""import llama_cpp
import os
llm = llama_cpp.Llama(model_path=os.environ['MODEL'])
output = llm("Q: Name the planets in the solar system? A: ", max_tokens=512, stop=["Q:", "\n"], echo=True)
print(output['choices'][0]['text'])
"""


def fibonacci(n):
    """Memoized Fibonacci function. Args: n: The number of the Fibonacci number to calculate.
    Returns: The Fibonacci number at the given index. """
    # Memoized Fibonacci numbers.
    fibonacci_memo = {0: 0, 1: 1}
    # Calculate Fibonacci number recursively.
    if n not in fibonacci_memo:
        fibonacci_memo[n] = fibonacci(n-1) + fibonacci(n-2)
    return fibonacci_memo[n]


print(fibonacci(2))
