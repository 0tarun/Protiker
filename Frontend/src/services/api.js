import { getResponseForQuery } from './mockApi';

const SIMULATED_DELAY = 1500;

export async function sendMessage(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = getResponseForQuery(query);
      resolve({
        id: res.messageId + '-' + Date.now(),
        sender: 'proti',
        content: res.content,
        structuredJson: res.structuredJson,
        timestamp: new Date(),
        isStreaming: false,
        inputMode: 'text',
      });
    }, SIMULATED_DELAY);
  });
}
