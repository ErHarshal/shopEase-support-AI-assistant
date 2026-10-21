//a basic tool-calling agent with two local (mock) tools.
import { createAgent } from "langchain";
import { llm } from "../config.js";
import { searchProductsTool, getOrderStatus } from "../tools/localTools.js";


const agent = createAgent({
    model: llm,
    tools: [getOrderStatus, searchProductsTool]
})

const questions = ["Where is order ORD-1043?", "Do you sell headphones, and are they in stock?"]
for (const q of questions) {
const result = await agent.invoke({
    messages: [
        {
            role: 'user',
            content: q
        }
    ]
})
console.log(`\nQ: ${q}\nA: ${String(result.messages[result.messages.length - 1]?.content)}`);
}

