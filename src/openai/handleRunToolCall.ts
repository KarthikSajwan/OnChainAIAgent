import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { tools } from "../tools/allTools.js";

export async function handleRunToolCalls(run: Run, client: OpenAI, thread: Thread): Promise<Run> {
     // Extracts tool calls from the run's required action, if they exist
     const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;
     if (!toolCalls) return run;
 
     const toolOutputs = await Promise.all(
         toolCalls.map(async (tool) => {
 
             const toolConfig = tools[tool.function.name]  //look upto tools in allTools.ts
             //if we dont have the tool then:-
             if (!toolConfig) {
                 console.error(`Tool ${tool.function.name} not found`)
                 return null
             }
 
             //to view what tool is being run
             console.log(`Running tool: ${tool.function.name}`);
 
             //if tool is present
             try {
                 const args = JSON.parse(tool.function.arguments);
                 const output = await toolConfig.handler(args);
 
                 
                 return {
                     tool_call_id: tool.id,
                     output: String(output)
                 }
             } catch (error) {
                 const errorMessage = error instanceof Error ? error.message : String(error);
                 return {
                     tool_call_id: tool.id,
                     output: `Error: ${errorMessage}`
                 };
             }
         })
     )
 
     //Grabbing any valid outputs here
     const validOutputs = toolOutputs.filter(Boolean) as
         OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[];
     if (validOutputs.length === 0) return run;
 
     // Submits tool outputs for the given thread and run, then waits for the response
     return client.beta.threads.runs.submitToolOutputsAndPoll(
         thread.id, // ID of the conversation thread
         run.id,    // ID of the current run
         { tool_outputs: validOutputs } // Data to be submitted
     );
 
 
}