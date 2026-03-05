import { DurableObject } from "cloudflare:workers";

export class RealpathSession extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
  }

  async getHistory() {
    return (await this.ctx.storage.get("history")) || [];
  }

  async addMessage(role, content) {
    const history = await this.getHistory();
    history.push({ role, content });
    await this.ctx.storage.put("history", history);
    return history;
  }

  async clearHistory() {
    await this.ctx.storage.delete("history");
    return [];
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(getHTML(), {
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    if (url.pathname === "/chat" && request.method === "POST") {
      const { message, sessionId } = await request.json();

      const id = env.REALPATH_SESSION.idFromName(sessionId || "default");
      const session = env.REALPATH_SESSION.get(id);

      await session.addMessage("user", message);
      const history = await session.getHistory();

      const messages = [
        {
          role: "system",
          content: "You are Realpath, an AI career guide for young people who feel lost, unsure, or unchallenged by the career options they have been shown. Your personality adapts to the user — if they write casually or use slang, match their energy and be relaxed. If they write formally, be more polished. Always be warm, never robotic. Your responses are SHORT — 2 to 3 sentences max, never more. No bullet points, no long lists. Just conversational back and forth like a chat with a smart friend who genuinely gets it. Your goal is to help them discover careers that actually fit who they are, beyond what their parents want, beyond what is trending, beyond the obvious. Ask one simple question at a time to understand them better. Start warm, stay curious, keep it real.",
        },
        ...history,
      ];

      const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages });

      await session.addMessage("assistant", response.response);

      return new Response(JSON.stringify({ reply: response.response }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (url.pathname === "/clear" && request.method === "POST") {
      const { sessionId } = await request.json();
      const id = env.REALPATH_SESSION.idFromName(sessionId || "default");
      const session = env.REALPATH_SESSION.get(id);
      await session.clearHistory();
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Realpath - Find Your Way</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --bg: #0a0a0f;
      --surface: #13131a;
      --border: #1e1e2e;
      --accent: #7c6aff;
      --accent2: #a78bfa;
      --text: #e2e2f0;
      --muted: #6b6b8a;
    }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; height: 100vh; display: flex; flex-direction: column; }
    header { padding: 1.2rem 2rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.2rem; font-weight: 600; color: var(--accent2); letter-spacing: 0.05em; }
    .tagline { font-size: 0.75rem; color: var(--muted); }
    .clear-btn { background: none; border: 1px solid var(--border); color: var(--muted); padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
    .clear-btn:hover { border-color: var(--accent); color: var(--accent2); }
    .chat-window { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.2rem; }
    .message { max-width: 75%; padding: 0.9rem 1.2rem; border-radius: 16px; font-size: 0.92rem; line-height: 1.6; }
    .message.user { align-self: flex-end; background: var(--accent); color: white; border-bottom-right-radius: 4px; }
    .message.assistant { align-self: flex-start; background: var(--surface); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
    .message.typing { color: var(--muted); font-style: italic; }
    .input-area { padding: 1.2rem 2rem; border-top: 1px solid var(--border); display: flex; gap: 0.8rem; }
    .input-area input { flex: 1; background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 0.8rem 1.2rem; border-radius: 12px; font-size: 0.92rem; outline: none; transition: border 0.2s; font-family: inherit; }
    .input-area input:focus { border-color: var(--accent); }
    .input-area input::placeholder { color: var(--muted); }
    .send-btn { background: var(--accent); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-size: 0.92rem; font-weight: 500; transition: opacity 0.2s; }
    .send-btn:hover { opacity: 0.85; }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .intro { align-self: center; text-align: center; padding: 2rem; max-width: 420px; }
    .intro h2 { font-size: 1.4rem; font-weight: 600; color: var(--accent2); margin-bottom: 0.5rem; }
    .intro p { color: var(--muted); font-size: 0.88rem; line-height: 1.6; }
  </style>
</head>
<body>
  <header>
    <div>
      <div class="logo">Realpath</div>
      <div class="tagline">Find the career that is actually you</div>
    </div>
    <button class="clear-btn" id="clearBtn">Start over</button>
  </header>
  <div class="chat-window" id="chat">
    <div class="intro">
      <h2>Hey, I am Realpath.</h2>
      <p>I help young Africans discover careers they never knew existed, ones that actually fit who they are. No pressure, no judgment. Just real talk. Say hi to get started.</p>
    </div>
  </div>
  <div class="input-area">
    <input type="text" id="userInput" placeholder="Type a message..." />
    <button class="send-btn" id="sendBtn">Send</button>
  </div>
  <script>
    var sessionId = Math.random().toString(36).slice(2);
    var chat = document.getElementById("chat");
    var userInput = document.getElementById("userInput");
    var sendBtn = document.getElementById("sendBtn");
    var clearBtn = document.getElementById("clearBtn");

    function addMessage(role, text) {
      var intro = chat.querySelector(".intro");
      if (intro) intro.remove();
      var div = document.createElement("div");
      div.className = "message " + role;
      div.textContent = text;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
      return div;
    }

    function sendMessage() {
      var text = userInput.value.trim();
      if (!text) return;
      userInput.value = "";
      sendBtn.disabled = true;
      addMessage("user", text);
      var typing = addMessage("assistant typing", "Thinking...");
      fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionId })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        typing.className = "message assistant";
        typing.textContent = data.reply;
        sendBtn.disabled = false;
        userInput.focus();
        chat.scrollTop = chat.scrollHeight;
      })
      .catch(function() {
        typing.textContent = "Something went wrong. Try again!";
        sendBtn.disabled = false;
      });
    }

    sendBtn.addEventListener("click", sendMessage);

    userInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") sendMessage();
    });

    clearBtn.addEventListener("click", function() {
      fetch("/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId })
      }).then(function() {
        chat.innerHTML = '<div class="intro"><h2>Hey, I am Realpath.</h2><p>I help young Africans discover careers they never knew existed, ones that actually fit who they are. No pressure, no judgment. Just real talk. Say hi to get started.</p></div>';
        sessionId = Math.random().toString(36).slice(2);
      });
    });
  </script>
</body>
</html>`;
}