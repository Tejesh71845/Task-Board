import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export const getTaskSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received AI request body:', req.body);
    
    const { title, description, subtasks } = req.body;

    if (!title || !description || !Array.isArray(subtasks)) {
      console.log('Validation failed:', { title, description, subtasks });
      res.status(400).json({ message: "Missing or invalid task data." });
      return;
    }

    // Mock response for testing (remove this when you have OpenAI credits)
    const mockSuggestions = [
      `For "${title}", I recommend breaking this down into smaller, manageable chunks. Start with the most critical components first and test frequently to ensure everything works as expected.`,
      `To efficiently complete "${title}", consider using a systematic approach: plan your design first, then implement step by step. Don't forget to test each part before moving to the next.`,
      `For this task about "${title}", prioritize the core functionality first. Create a basic version that works, then enhance it with additional features. This iterative approach will help you make steady progress.`,
      `I suggest tackling "${title}" by first gathering all necessary resources and requirements. Then create a timeline with milestones to track your progress effectively.`,
      `To approach "${title}" efficiently, start by researching best practices and existing examples. This will save you time and help you avoid common pitfalls.`
    ];

    // Select a random mock suggestion
    const randomSuggestion = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
    
    console.log('Returning mock suggestion:', randomSuggestion);
    res.json({ suggestion: randomSuggestion });

    /* 
    // Uncomment this section when you have OpenAI credits:
    
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system" as const,
        content: "You are a helpful assistant that summarizes tasks and provides helpful productivity suggestions.",
      },
      {
        role: "user" as const,
        content: `
Task: ${title}
Description: ${description}
Subtasks: ${subtasks.map((s: any) => s.title).join(", ")}

Please provide a 1-2 sentence summary of the task and suggest how to best approach completing it efficiently.
        `,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim();
    res.json({ suggestion });
    */
    
  } catch (error:any) {
    console.error("AI suggestion error:", error);
    res.status(500).json({ message: "AI suggestion failed", error: error.message });
  }
};