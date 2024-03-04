export async function fetchStreamData(url, requestData, onChunkReceived, onStart, onEnd) {
    // Make a POST request to the server
    onStart();
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });

    // Ensure the request is successful
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedChunks = '';
    return new ReadableStream({
        async start(controller) {

            while (true) {
                const { done, value } = await reader.read();

                // When no more data, break the loop
                if (done) {
                    break;
                }

                // Decode the stream chunks to text
                const chunk = decoder.decode(value, { stream: true });
                accumulatedChunks += chunk;
                onChunkReceived(accumulatedChunks);
                // Enqueue the chunk into the stream
                controller.enqueue(chunk);
            }

            // Close the stream
            controller.close();
            reader.releaseLock();
            onEnd();
        }
    });
}


export const copyToClipboard = (text) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject('The Clipboard API is not available.');
  };