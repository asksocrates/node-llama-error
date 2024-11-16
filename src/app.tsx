import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';


const container = document.getElementById('root');
// Create a root
if (!container) throw new Error('No root element found');
const root = createRoot(container);

function Test() {
  const [res, setRes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const res = await window.electronAPI.processRag(
      {
        text: 'Write a short story about a young boy who discovers a magical world hidden in his backyard.',
        model: 'Llama-3.2-3B-Instruct-Q4_K_M.gguf',
      }
    );
    console.log(res);
    setRes(res)

    setIsLoading(false);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Generate Story'}
      </button>
      {res && <div>{res}</div>}
    </div>
  );
}

// Initial render
root.render(
  <StrictMode>
    <Test />
  </StrictMode>
);
