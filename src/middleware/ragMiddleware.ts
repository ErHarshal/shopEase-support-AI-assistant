import { dynamicSystemPromptMiddleware } from "langchain";
import vectorStore from "../rag/retrivals.js";

export const ragsySystemPrompt = dynamicSystemPromptMiddleware(async (state) => {
    const message = state.messages[0].content;
    const messageString = typeof message === 'string' ? message : message.toString();
    const results = await vectorStore.similaritySearch(messageString, 2);
    const docContext = results.map((result) => result.pageContent).join('\n');
    return `You are ShopEase's customer support assistant.
Answer ONLY from the policy context below. If the answer is not there, say you don't have that
information and offer to connect the customer with a human agent. Keep answers short (1-4 sentences).

Policy context:
${docContext}`
});