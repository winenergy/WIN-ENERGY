/**
 * Win Energy - AI Chat Assistant & WhatsApp Floating Controller
 * Provides an intelligent conversational agent and direct WhatsApp quick-action
 * Official Phone: +91 9595955585 | Sangli Works, Maharashtra
 */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingWidgets();
});

function initFloatingWidgets() {
  // Inject CSS styles for floating widgets if not already present
  const style = document.createElement('style');
  style.innerHTML = `
    .win-float-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }
    @media (max-width: 640px) {
      .win-float-container {
        bottom: 14px;
        right: 14px;
        gap: 8px;
      }
      .win-wa-btn {
        width: 46px !important;
        height: 46px !important;
      }
      .win-wa-btn svg {
        width: 22px !important;
        height: 22px !important;
      }
      .win-ai-trigger {
        padding: 7px 14px !important;
        font-size: 12px !important;
        gap: 6px !important;
      }
      .win-ai-trigger .bot-dot {
        width: 6px !important;
        height: 6px !important;
      }
    }
    .win-wa-btn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #25D366;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px -5px rgba(37, 211, 102, 0.4), 0 8px 10px -6px rgba(37, 211, 102, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      text-decoration: none;
      position: relative;
    }
    .win-wa-btn:hover {
      transform: scale(1.08);
      background: #20bd5a;
    }
    .win-wa-pulse {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #EA580C;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      animation: pulsePing 2s infinite;
    }
    @keyframes pulsePing {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.7; }
    }
    .win-ai-trigger {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #0F172A;
      color: #FFFFFF;
      border: 1px solid #334155;
      padding: 11px 20px;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 20px 35px -10px rgba(15, 23, 42, 0.35);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .win-ai-trigger:hover {
      background: #0284C7;
      border-color: #0284C7;
      transform: translateY(-2px);
    }
    .win-ai-trigger .bot-dot {
      width: 8px;
      height: 8px;
      background: #22C55E;
      border-radius: 50%;
    }
    /* AI Chat Window */
    .win-chat-modal {
      display: none;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 540px;
      max-height: calc(100vh - 120px);
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      flex-direction: column;
      overflow: hidden;
      animation: chatFadeIn 0.25s ease-out forwards;
      font-family: 'Inter', sans-serif;
    }
    @keyframes chatFadeIn {
      from { opacity: 0; transform: translateY(20px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .win-chat-header {
      background: #0F172A;
      color: #FFFFFF;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1E293B;
    }
    .win-chat-header h4 {
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .win-chat-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #F8FAFC;
    }
    .chat-bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.55;
    }
    .bubble-bot {
      background: #FFFFFF;
      color: #0F172A;
      border: 1px solid #CBD5E1;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .bubble-user {
      background: #0284C7;
      color: #FFFFFF;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .win-chat-quickpills {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 10px 16px;
      background: #FFFFFF;
      border-top: 1px solid #E2E8F0;
    }
    .win-chat-quickpills button {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      color: #1E293B;
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s;
    }
    .win-chat-quickpills button:hover {
      background: #0284C7;
      color: #FFFFFF;
      border-color: #0284C7;
    }
    .win-chat-input-bar {
      display: flex;
      padding: 12px 16px;
      background: #FFFFFF;
      border-top: 1px solid #E2E8F0;
      gap: 8px;
    }
    .win-chat-input-bar input {
      flex: 1;
      border: 1px solid #CBD5E1;
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
    }
    .win-chat-input-bar input:focus {
      border-color: #0284C7;
    }
    .win-chat-send {
      background: #0284C7;
      color: #FFFFFF;
      border: none;
      border-radius: 12px;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }
    .win-chat-send:hover {
      background: #0369A1;
    }
  `;
  document.head.appendChild(style);

  // Create floating container
  const container = document.createElement('div');
  container.className = 'win-float-container';

  // Modal HTML
  container.innerHTML = `
    <!-- AI Chat Window -->
    <div class="win-chat-modal" id="winChatModal">
      <div class="win-chat-header">
        <div>
          <h4>
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#22C55E;"></span>
            Win Energy Assistant
          </h4>
          <span style="font-size: 11px; color: #94A3B8;">Sustainable Physical Engineering Support</span>
        </div>
        <button id="winChatClose" style="background:none; border:none; color:#94A3B8; cursor:pointer; font-size:20px; line-height:1;">&times;</button>
      </div>

      <div class="win-chat-body" id="winChatBody">
        <div class="chat-bubble bubble-bot">
          Hello! Welcome to <strong>Win Energy</strong>. I can assist you with:
          <br>• <strong>HydroPulse</strong> (Marlin 1.0 & Marlin 1.5) water descalers
          <br>• <strong>BuzzZap</strong> solar agricultural insect traps
          <br>• Technical specs, pricing, and plant sizing.
          <br><br>How can I help you today?
        </div>
      </div>

      <div class="win-chat-quickpills">
        <button onclick="sendQuickPrompt('Marlin 1.0 price & specs')">Marlin 1.0 Price</button>
        <button onclick="sendQuickPrompt('Marlin 1.5 price & specs')">Marlin 1.5 Price</button>
        <button onclick="sendQuickPrompt('How does HydroPulse work?')">How It Works</button>
        <button onclick="sendQuickPrompt('BuzzZap for agriculture')">BuzzZap Agri</button>
        <button onclick="sendQuickPrompt('Official contact number')">Contact Info</button>
      </div>

      <form class="win-chat-input-bar" id="winChatForm" onsubmit="event.preventDefault(); handleChatSubmit();">
        <input type="text" id="winChatInput" placeholder="Ask about products, pricing, physics..." autocomplete="off" />
        <button type="submit" class="win-chat-send" aria-label="Send Message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>

    <!-- Actions Row -->
    <div style="display:flex; align-items:center; gap:12px;">
      <!-- AI Trigger Button -->
      <button class="win-ai-trigger" id="winAiTrigger" aria-label="Open Win Energy AI Chat">
        <span class="bot-dot"></span>
        <span>AI Assistant</span>
      </button>

      <!-- WhatsApp Button -->
      <a href="https://wa.me/919595955585?text=Hello%20Win%20Energy,%20I%20would%20like%20to%20inquire%20about%20your%20products." 
         target="_blank" 
         rel="noopener noreferrer" 
         class="win-wa-btn" 
         aria-label="Direct WhatsApp Connect">
        <span class="win-wa-pulse"></span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
      </a>
    </div>
  `;

  document.body.appendChild(container);

  // Event handlers
  const trigger = document.getElementById('winAiTrigger');
  const modal = document.getElementById('winChatModal');
  const closeBtn = document.getElementById('winChatClose');

  trigger.addEventListener('click', () => {
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    if (modal.style.display === 'flex') {
      document.getElementById('winChatInput').focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.sendQuickPrompt = function(promptText) {
  const input = document.getElementById('winChatInput');
  input.value = promptText;
  handleChatSubmit();
};

window.handleChatSubmit = function() {
  const input = document.getElementById('winChatInput');
  const query = input.value.trim();
  if (!query) return;

  const chatBody = document.getElementById('winChatBody');

  // Append user message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble bubble-user';
  userBubble.textContent = query;
  chatBody.appendChild(userBubble);
  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Bot response with slight delay
  setTimeout(() => {
    const botResponse = generateAIResponse(query);
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bubble-bot';
    botBubble.innerHTML = botResponse;
    chatBody.appendChild(botBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 400);
};

function generateAIResponse(query) {
  const q = query.toLowerCase();

  // Price inquiries
  if (q.includes('marlin 1.0') || (q.includes('1.0') && (q.includes('price') || q.includes('cost')))) {
    return `<strong>HydroPulse Marlin 1.0</strong>:
      <br>• <strong>Price:</strong> ₹41,999 (Inclusive of standard supply)
      <br>• <strong>Application:</strong> Apartments, flats, and homes with pipeline diameter up to 1.0 Inch (25mm).
      <br>• <strong>Power:</strong> &lt; 15W continuous low-voltage operation.
      <br>• <strong>Benefit:</strong> 100% chemical-free limescale prevention for geysers, taps, and showers.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20Marlin%201.0%20(₹41,999)" target="_blank" style="color:#0284C7; font-weight:700;">Order on WhatsApp (+91 9595955585) →</a>`;
  }

  if (q.includes('marlin 1.5') || (q.includes('1.5') && (q.includes('price') || q.includes('cost')))) {
    return `<strong>HydroPulse Marlin 1.5</strong>:
      <br>• <strong>Price:</strong> ₹55,999
      <br>• <strong>Application:</strong> Luxury villas, penthouses, commercial lines, and swimming pool loops (pipelines up to 1.5 Inch / 40mm).
      <br>• <strong>Feature:</strong> Reinforced dual-coil frequency resonance loop.
      <br>• <strong>Benefit:</strong> Handles high continuous flow rates and eliminates hard water buildup.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20Marlin%201.5%20(₹55,999)" target="_blank" style="color:#0284C7; font-weight:700;">Order on WhatsApp (+91 9595955585) →</a>`;
  }

  if (q.includes('price') || q.includes('cost') || q.includes('rate')) {
    return `<strong>Win Energy Standard Pricing:</strong>
      <br>• <strong>HydroPulse Marlin 1.0:</strong> ₹41,999 (Up to 1" pipe)
      <br>• <strong>HydroPulse Marlin 1.5:</strong> ₹55,999 (Up to 1.5" pipe)
      <br>• <strong>Industrial HydroPulse (2" - 12"+):</strong> Custom project quote based on pipe size and flow rate.
      <br>• <strong>BuzzZap ECO & Pro:</strong> Direct quote based on acreage.
      <br><br>Call <strong>+91 9595955585</strong> for customized quotes!`;
  }

  // HydroPulse / How it works
  if (q.includes('how') && (q.includes('work') || q.includes('physics') || q.includes('descaler') || q.includes('hydropulse'))) {
    return `<strong>HydroPulse Physical Engineering:</strong>
      <br>Unlike chemical softeners, HydroPulse uses <strong>Capacitive Audio Frequency Modulation</strong>.
      <br>1. External signal cables wrap around the pipe without cutting it.
      <br>2. Modulated frequencies transform hard, needle-like <em>calcite</em> crystals into spherical, non-adherent <em>aragonite</em> crystals.
      <br>3. Aragonite stays suspended in water and flushes away naturally.
      <br>4. Zero salt refills, zero chemicals, and zero pressure drops!`;
  }

  // BuzzZap
  if (q.includes('buzzzap') || q.includes('pest') || q.includes('insect') || q.includes('farm') || q.includes('agri')) {
    return `<strong>BuzzZap Clean Agri Tech:</strong>
      <br>• <strong>BuzzZap ECO:</strong> Automatic solar trap with capture basin for 0.5–1 Acre coverage.
      <br>• <strong>BuzzZap Pro:</strong> Heavy-duty high-voltage electric grid with rain-sensor auto-protection for up to 2.0 Acres.
      <br>• <strong>Advantage:</strong> Up to 50% reduction in chemical pesticides, preventing pest immunity and toxic crop residues.`;
  }

  // Contact / Address / Sangli
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('address') || q.includes('location') || q.includes('office') || q.includes('pravin')) {
    return `<strong>Win Energy Official Contact:</strong>
      <br>• <strong>Phone / WhatsApp:</strong> +91 9595955585
      <br>• <strong>Email:</strong> contact@winenergy.in / info@winenergy.in
      <br>• <strong>Manufacturing & Engineering Works:</strong> Plot no. 2038/B, Malgaon Savali Road, Malgaon, Sangli – 416410, Maharashtra, INDIA.
      <br><br><a href="https://wa.me/919595955585" target="_blank" style="color:#25D366; font-weight:700;">Connect on WhatsApp Now →</a>`;
  }

  // Installation
  if (q.includes('install') || q.includes('fit') || q.includes('maintenance')) {
    return `<strong>Installation & Maintenance:</strong>
      <br>• <strong>Non-Invasive Clamp-On:</strong> Simply wrap the signal coils around your existing intake pipe. No plumbing cuts or downtime required.
      <br>• <strong>Pipe Compatibility:</strong> Works on PVC, CPVC, GI, Copper, Stainless Steel, and HDPE.
      <br>• <strong>Maintenance:</strong> Zero consumables, zero salt bags, IP65 weatherproof electronics with a 5-year warranty.`;
  }

  // Default fallback
  return `Thank you for your inquiry! <strong>Win Energy</strong> provides physical water conditioning (<strong>HydroPulse</strong>) and solar insect control (<strong>BuzzZap</strong>).
    <br><br>Would you like details on <strong>Marlin 1.0 (₹41,999)</strong>, <strong>Marlin 1.5 (₹55,999)</strong>, or to speak directly with an engineer at <strong>+91 9595955585</strong>?`;
}
