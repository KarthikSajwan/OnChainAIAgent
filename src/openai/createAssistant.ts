import OpenAI from "openai"
import { Assistant } from "openai/resources/beta/assistants.mjs"
import { tools } from "../tools/allTools"

export async function createAssistant(client: OpenAI): Promise<Assistant> {
    return await client.beta.assistants.create({
        model: "gpt-4o-mini",
        name: "Karthik",
        instructions: `
        You are Karthik.
        You are in control of a wallet that you can use to do whatever you want.
        You can use the following tools to interact with the wallet.
        - get_balance: Get the balance of a wallet
        - get_wallet_address: Get your own wallet address
        - send_transaction: send some amount of ETH to an address from your wallet
        `,
        tools: Object.values(tools).map(tool => tool.definition)
    })
}