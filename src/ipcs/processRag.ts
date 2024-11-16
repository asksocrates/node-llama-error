import { join } from 'path';

import log from 'electron-log/main';
// import { searchEmbeddings } from '../utils/main/oramaDb';

import type { LlamaModel } from 'node-llama-cpp';

let llamaModel: LlamaModel | null = null;
let modelName: string | null = null;


export async function processRag(
  queryInput: {
    text: string;
    model: string;
    
  }
): Promise<string> {
  const { getLlama } = await import('node-llama-cpp');

  const llama = await getLlama();
  try {
    if (!llamaModel || modelName !== queryInput.model) {
      console.log('RAG Loading', queryInput.model);
      log.info(
        'RAG Loading',
        queryInput.model,
      );
      
      const TEST_PATH =
        process.platform === 'darwin'
          ? '/Users/goodspeed/Library/Application Support/Socrates'
          : 'C:\\Users\\goodspeed\\AppData\\Roaming\\Socrates';
      llamaModel = await llama.loadModel({
        // modelPath: join(app.getPath('sessionData'), `models`, queryInput.model),
        modelPath: join(TEST_PATH, `models`, queryInput.model),
      });
      modelName = queryInput.model;
    }
    log.info('RAG Model loaded:', queryInput.model);
    console.log('RAG Model loaded');

    // const chatHistory = getChatHistory(
    //   queryInput.messageArray,
    //   queryInput.model as LocalLlmModel
    // );

    // START TEST CODE
    log.info('creating context');
    const modelContext = await llamaModel.createContext();
    log.info('created context');
    const { LlamaChatSession, Llama3ChatWrapper } = await import(
      'node-llama-cpp'
    );

    const session = new LlamaChatSession({
      contextSequence: modelContext.getSequence(),
      chatWrapper: new Llama3ChatWrapper(),
    });
    log.info('prompting');
    const a1 = await session.prompt(queryInput.text);
    log.info('finished prompting');
    modelContext.dispose(); // need this for vulkan
    log.info('disposing context');

    console.log(a1);
    return a1;
    // const chainRes = await basicRag(queryInput, userId, chatHistory);

    // return chainRes;
  } catch (e) {
    log.error('Error processing RAG', (e as Error).message);
    return (e as Error).message;

  }
}
