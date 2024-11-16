import { IElectronAPI } from '@socrates/common';

declare global {
  interface Window {
    electronAPI: {
      processRag: (input: {
        text: string;
        model: string;
      }) => Promise<string>;

    };
  }
}
