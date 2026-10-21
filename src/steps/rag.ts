import policyAgent from "../agents/policyAgent.js";

const questions = [
  "What is your return window?",
  "Is shipping free on a Rs 1,200 order?",
  "How long does a UPI refund take?",
  "Do you ship to the USA?"]

for (const q of questions) {
const result = await policyAgent.invoke({
    messages: [
        {
            role: 'user',
            content: q
        }
    ]
})

console.log(`\nQ: ${q}\nA: ${String(result.messages[result.messages.length - 1]?.content)}`);
}

