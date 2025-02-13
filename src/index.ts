import OpenAI from "openai"
import "dotenv/config"
import { createAssistant } from "./openai/createAssistant";
import { createThread } from "./openai/createThread";
import { createRun } from "./openai/createRun";
import { performRun } from "./openai/performRun";

async function main() {

    const client = new OpenAI();

    const message = "Send 0.00001 ETH to 0x340A51a9F16bC099D9f1e644b50eE1dCe55d0F53"
    const assistant = await createAssistant(client);
    const thread = await createThread(client, message);
    const run = await createRun(client, thread, assistant.id);
    const result = await performRun(run, client, thread)
    console.log(result)

}

main();