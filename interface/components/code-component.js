import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { copyToClipboard } from '@/utils/utils'; // Assuming you have a utility function for copying text

const CodeComponent = ({ code, language = 'javascript' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="bg-gray-800 text-gray-300 p-4 rounded-lg shadow-lg overflow-auto relative" style={{ position: 'relative' }}>
      <SyntaxHighlighter language={language} style={docco}>
        {code}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          cursor: 'pointer',
          padding: '5px 10px',
          borderRadius: '5px',
          border: 'none',
          background: 'lightgray',
        }}
      >
        {isCopied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

export default CodeComponent;
