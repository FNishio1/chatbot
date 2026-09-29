// Extremo Oeste - Experiences Bot (chat widget logic)

const WORKER_URL = "https://experience-ai.limaexpiriences.workers.dev/";

let botConversation = [];
let chatOpen = false;

// Reveal the chat bubble once the user scrolls past the hero
// (so it doesn't sit on top of it), and keep it visible from
// Experiences onward for the rest of the page.
const botToggleBtn = document.getElementById('bot-toggle');
const heroSection = document.getElementById('hero');

if (botToggleBtn && heroSection) {
  const botToggleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      botToggleBtn.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  botToggleObserver.observe(heroSection);
}

function toggleChat() {
  chatOpen = !chatOpen;
  const widget = document.getElementById('bot-widget');
  widget.classList.toggle('open', chatOpen);

  if (!chatOpen) {
    document.getElementById('bot-whatsapp-cta').style.display = 'none';
  }

  if (chatOpen && botConversation.length === 0) {
    setTimeout(() => {
      addBotMessage("Hi! I'm the Experiences Bot 🗺\n\nI can help you discover Lima through the eyes of a local. Which type of experience interests you — history, gastronomy, nature, or something custom?");
    }, 400);
  }
}

function addBotMessage(text) {
  const div = document.createElement('div');
  div.className = 'bot-msg bot';
  div.textContent = text;
  document.getElementById('bot-messages').appendChild(div);
  scrollBot();
}

function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'bot-msg user';
  div.textContent = text;
  document.getElementById('bot-messages').appendChild(div);
  scrollBot();
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'bot-msg typing';
  div.id = 'bot-typing';
  div.textContent = 'Writing...';
  document.getElementById('bot-messages').appendChild(div);
  scrollBot();
}

function scrollBot() {
  const msgs = document.getElementById('bot-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

async function botSend() {
  const input = document.getElementById('bot-input');
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  botConversation.push({ role: "user", content: text });
  input.value = "";

  addTyping();

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: botConversation })
    });

    const data = await response.json();

    document.getElementById('bot-typing')?.remove();

    let reply = data.reply;
    const isHotLead = data.isHotLead;

    // Remove WhatsApp CTA tag from visible message
    const showWhatsApp = reply.includes('[WHATSAPP_CTA]');
    reply = reply.replace('[WHATSAPP_CTA]', '').trim();

    botConversation.push({ role: "assistant", content: reply });
    addBotMessage(reply);

    // Show WhatsApp CTA button if hot lead or bot triggered it
    if (showWhatsApp || isHotLead) {
      document.getElementById('bot-whatsapp-cta').style.display = 'block';
    }

  } catch (error) {
    document.getElementById('bot-typing')?.remove();
    addBotMessage("Sorry, I'm having trouble connecting. Please reach us directly on WhatsApp: https://wa.me/51999156493");
  }
}
