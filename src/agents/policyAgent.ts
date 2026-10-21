import { ragsySystemPrompt } from "../middleware/ragMiddleware.js";
import { createAgent } from "langchain";
import { llm } from "../config.js";

// No tools: retrieval happens in middleware, so even a small model can answer reliably.
const policyAgent = createAgent({
    model: llm,
    tools: [],
    middleware: [ragsySystemPrompt],
})

export default policyAgent;