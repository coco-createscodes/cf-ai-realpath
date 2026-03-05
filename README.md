# Realpath 🧭
### Find the career that's actually you.

Realpath is an AI-powered career guidance chatbot built on Cloudflare Workers. It helps young people discover career paths they never knew existed — ones that actually fit who they are, beyond what's trending, beyond what their parents expect, beyond the obvious.

**Live Demo:** https://cf-ai-realpath.alaberenicole.workers.dev

---

## The Problem
Too many young people default to chasing influencer fame or fall into careers they were told to pursue — not because those paths fit them, but because nobody showed them the alternatives. Realpath fixes that.

---

## Features
- 🤖 **AI-powered conversations** using Llama 3.3 via Cloudflare Workers AI
- 🧠 **Memory within sessions** using Durable Objects — Realpath remembers what you said earlier in the conversation
- 🎭 **Adaptive personality** — matches the user's tone and energy automatically
- 💬 **Chat interface** — clean, minimal, mobile-friendly UI built in HTML/CSS/JS
- 🔄 **Start over** button to reset the conversation and session

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| LLM | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` via Cloudflare Workers AI |
| Memory / State | Cloudflare Durable Objects |
| Backend | Cloudflare Workers |
| Frontend | HTML, CSS, JavaScript (served from the Worker) |

---

## Cloudflare Assignment Requirements

| Requirement | Implementation |
|-------------|----------------|
| LLM | Llama 3.3 via Workers AI |
| Workflow / coordination | Worker handles routing, session management, and AI calls |
| User input via chat | Chat interface served directly from the Worker |
| Memory or state | Durable Objects store conversation history per session |

---

## Running Locally

### Prerequisites
- Node.js v18+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account

### Setup
```bash
# Clone the repo
git clone https://github.com/coco-createscodes/cf-ai-realpath.git
cd cf-ai-realpath

# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Run locally (AI calls hit remote Cloudflare services)
wrangler dev
```

Visit `http://localhost:8787` in your browser.

### Deploy
```bash
wrangler deploy
```

---

## How It Works

1. User opens the app and types a message
2. The frontend sends the message to `/chat` endpoint with a unique session ID
3. The Worker retrieves conversation history from the Durable Object
4. The full history + system prompt is sent to Llama 3.3 via Workers AI
5. The AI response is saved back to the Durable Object and returned to the user
6. The user sees the reply instantly in the chat UI

---

## Future Improvements
- Persistent sessions across browser visits using user-provided identifiers
- Career roadmap generation with specific steps and resources
- Support for multiple languages including Nigerian Pidgin
- Integration with job boards and scholarship databases

---

## AI Assistance
This project was built with AI assistance. See [PROMPTS.md](./PROMPTS.md) for full details of prompts used.

---

*Built by Nicole Alabere — coco-createscodes*
