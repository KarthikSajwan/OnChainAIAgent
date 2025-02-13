import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";

export async function createRun(client: OpenAI, thread: Thread, assistantId: string): Promise<Run> {


    //we used let in run so the we can change it. or the while loop will run forever
    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId
    });

    // now we are shifting from 3rd state to 4th state

    while (run.status === "in_progress" || run.status === "queued") {
        await new Promise(resolve => setTimeout(resolve, 1000)); //wait one second
        run = await client.beta.threads.runs.retrieve(thread.id, run.id)
        
    }
    return run

}