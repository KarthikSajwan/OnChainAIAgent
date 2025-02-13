import { Address, parseEther } from "viem";
import { createViemWalletClient } from "../viem/createViemWalletClient";
import { ToolConfig } from "./allTools";

interface SendTransactionsArgs {
    to: Address;
    value?: string;
}

export const sendTransactionTool: ToolConfig<SendTransactionsArgs> = {
    definition: {
        type: "function",
        function: {
            name: "send_transaction",
            description: "Send ETH to an address",
            parameters: {
                type: "object",
                properties: {
                    to: {
                        type: "string",
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: "The recipient address",
                    },
                    value: {
                        type: "string",
                        description: "The amount of ETH to send (in ETH, not Wei)",
                        optional: true,
                    },
                },
                required: ["to"],
            },
        },
    },
    handler: async ({ to, value }: SendTransactionsArgs) => {
        try {
            const walletClient = createViemWalletClient();

            const hash = await walletClient.sendTransaction({
                to,
                value: value ? parseEther(value) : undefined,
            });

            return hash;
        } catch (error) {
            console.error("Transaction failed:", error);
            return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    },
};
