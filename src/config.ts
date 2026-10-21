import "dotenv/config";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";

const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

export const llm = new ChatOllama({
  model: process.env.OLLAMA_MODEL ?? "llama3.2:3b",
  baseUrl,
  temperature: 0,
  numCtx: Number(process.env.OLLAMA_NUM_CTX ?? 4096),
});

export const embeddings = new OllamaEmbeddings({
  model: process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text",
  baseUrl,
});
