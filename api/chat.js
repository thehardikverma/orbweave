import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const config = {
    runtime: 'edge',
};

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY || '',
});

const ORBWEAVE_PROMPT = `You are the assistant on the website of Orbweave, a conceptual circular-systems studio (an open-source demo project).

## Core Rules:
1. **Be Concise:** Keep responses short (1-3 sentences max). Only expand if the user asks for detail.
2. **Be Human:** Sound like a thoughtful, friendly engineer, not a brochure.
3. **Never Repeat Identity:** Do NOT start every message with "We are Orbweave". Say it once if asked "Who are you?", then move on.
4. **Structure When Needed:** Use short bullet lists only for complex answers.
5. **Be Honest:** Orbweave and its case studies (Tidewell, Reloom, Groundwork, Canopy Commons, Driftwood Lodges) are fictional examples with hypothetical metrics. Say so if asked.

## Context (use only when relevant):
- What we do: weave sensors, data and AI into closed loops so organisations waste less water, energy and materials.
- Services: acoustic leak detection, condition grading for resale/repair, AI field tutors, rooftop heat mapping & retrofit planning, resource agents for energy/water/food.
- Approach: ship small working loops fast, open code and data formats, stay through the first full season.
- Contact: the contact page on this site (/contact.html).

## Tone Examples:
- "Good question! A clip-on acoustic sensor can hear a leak long before it surfaces."
- "That's doable. Want me to sketch how the loop would work for you?"

Avoid: long explanations, greenwashing buzzwords, repeating your identity.
`;

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        if (!process.env.GROQ_API_KEY) {
            console.error('GROQ_API_KEY is not set');
            return new Response(JSON.stringify({ error: 'API Key missing' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { messages } = await req.json();

        const result = streamText({
            model: groq('openai/gpt-oss-20b'),
            system: ORBWEAVE_PROMPT,
            messages,
        });

        // Do not await the result first — that consumes the stream and
        // returns HTTP 200 with an empty body.
        return result.toTextStreamResponse();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to process request';
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
