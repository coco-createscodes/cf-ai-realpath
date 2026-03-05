# PROMPTS.md
## AI Assistance Documentation

This file documents the AI prompts and assistance used during the development of Realpath, as required by the Cloudflare AI internship assignment guidelines.

---

## 1. System Prompt (Production)

The following system prompt is used in every conversation with the Llama 3.3 model:

```
You are Realpath, an AI career guide for young people who feel lost, unsure, or 
unchallenged by the career options they have been shown. Your personality adapts 
to the user — if they write casually or use slang, match their energy and be relaxed. 
If they write formally, be more polished. Always be warm, never robotic. Your responses 
are SHORT — 2 to 3 sentences max, never more. No bullet points, no long lists. Just 
conversational back and forth like a chat with a smart friend who genuinely gets it. 
Your goal is to help them discover careers that actually fit who they are, beyond what 
their parents want, beyond what is trending, beyond the obvious. Ask one simple question 
at a time to understand them better. Start warm, stay curious, keep it real.
```

---

## 2. Development Assistance

Claude (Anthropic) was used as a coding assistant during development. Prompts included:

- Scaffolding the Cloudflare Worker with Durable Objects for session memory
- Debugging deployment errors related to `new_sqlite_classes` migration config
- Fixing JavaScript syntax errors in the HTML template string
- Structuring the `/chat` and `/clear` API endpoints
- Writing the frontend chat UI in HTML/CSS/JS

---

## 3. Idea Origin

The core idea for Realpath — a career discovery tool for young people who default to 
influencer culture because they were never shown alternatives — originated entirely from 
the developer (Nicole Alabere) during a brainstorming session. The problem was identified 
from personal observation of peers in Nigeria and beyond.

---

## 4. What Was NOT AI-Generated

- The problem statement and product concept
- The name "Realpath" and brand direction
- The decision to make the personality adaptive to user tone
- The insight that this problem extends beyond Africa to young people globally
- Testing, iteration decisions, and final deployment

---

*All work is original. No code was copied from other submissions.*
