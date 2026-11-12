/**
 * Win Energy - AI Chat Assistant & WhatsApp Floating Controller (v3.0)
 * Comprehensive Clean-Tech Engineering Support, Sizing, and Pricing Assistant
 * Official Phone: +91 9595955585 | Sangli Works, Maharashtra, India
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
      pointer-events: none;
    }
    .win-float-container > * {
      pointer-events: auto;
    }
    @media (max-width: 640px) {
      .win-float-container {
        bottom: 14px;
        right: 14px;
        gap: 8px;
      }
      .win-wa-btn {
        width: 48px !important;
        height: 48px !important;
      }
      .win-wa-btn svg {
        width: 24px !important;
        height: 24px !important;
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
      .win-chat-modal {
        position: fixed !important;
        bottom: 74px !important;
        right: 14px !important;
        left: 14px !important;
        width: calc(100vw - 28px) !important;
        min-width: unset !important;
        max-width: calc(100vw - 28px) !important;
        height: 520px !important;
        max-height: calc(100vh - 90px) !important;
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
      box-shadow: 0 10px 25px -5px rgba(37, 211, 102, 0.45);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .win-wa-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 14px 28px -4px rgba(37, 211, 102, 0.6);
      color: #FFFFFF;
    }
    .win-wa-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(37, 211, 102, 0.4);
      animation: winWaPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      z-index: -1;
    }
    @keyframes winWaPing {
      75%, 100% {
        transform: scale(1.55);
        opacity: 0;
      }
    }
    .win-ai-trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      border-radius: 9999px;
      background: #0B132B;
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 25px -5px rgba(11, 19, 43, 0.4);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .win-ai-trigger:hover {
      background: #1C2541;
      border-color: #0284C7;
      transform: translateY(-2px);
      box-shadow: 0 12px 28px -4px rgba(2, 132, 199, 0.35);
    }
    .win-ai-trigger .bot-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 10px #22C55E;
    }
    .win-chat-modal {
      position: fixed !important;
      bottom: 86px !important;
      right: 24px !important;
      left: auto !important;
      width: 400px !important;
      min-width: 360px !important;
      max-width: min(420px, calc(100vw - 32px)) !important;
      height: 580px !important;
      max-height: calc(100vh - 110px) !important;
      background: #FFFFFF !important;
      border-radius: 24px !important;
      box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(15, 23, 42, 0.08) !important;
      display: none;
      flex-direction: column;
      overflow: hidden !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      animation: winChatSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      z-index: 10000 !important;
      box-sizing: border-box !important;
    }
    .win-chat-modal * {
      box-sizing: border-box;
    }
    .win-chat-modal .chat-bubble {
      max-width: 86% !important;
    }
    @keyframes winChatSlideUp {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .win-chat-header {
      padding: 16px 20px;
      background: #0B132B;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .win-chat-header h4 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .win-chat-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #F8FAFC;
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 13px;
      line-height: 1.55;
    }
    .chat-bubble {
      max-width: 86%;
      padding: 12px 15px;
      border-radius: 16px;
      word-break: break-word;
    }
    .bubble-bot {
      align-self: flex-start;
      background: #FFFFFF;
      color: #1E293B;
      border: 1px solid #E2E8F0;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.04);
    }
    .bubble-user {
      align-self: flex-end;
      background: #0284C7;
      color: #FFFFFF;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 12px -2px rgba(2, 132, 199, 0.35);
    }
    .win-chat-quickpills {
      padding: 10px 14px;
      background: #FFFFFF;
      border-top: 1px solid #E2E8F0;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: thin;
      scrollbar-color: #CBD5E1 transparent;
    }
    .win-chat-quickpills::-webkit-scrollbar {
      height: 4px;
    }
    .win-chat-quickpills::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 4px;
    }
    .win-chat-quickpills button {
      flex-shrink: 0;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      background: #F1F5F9;
      color: #334155;
      border: 1px solid #E2E8F0;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .win-chat-quickpills button:hover {
      background: #0284C7;
      color: #FFFFFF;
      border-color: #0284C7;
      transform: translateY(-1px);
    }
    .win-chat-input-bar {
      padding: 12px 16px;
      background: #FFFFFF;
      border-top: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .win-chat-input-bar input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid #CBD5E1;
      font-size: 13px;
      outline: none;
      transition: border 0.2s;
    }
    .win-chat-input-bar input:focus {
      border-color: #0284C7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
    .win-chat-send {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #0284C7;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
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
          <span style="font-size: 11px; color: #94A3B8;">Sangli Works · Sustainable Engineering</span>
        </div>
        <button id="winChatClose" style="background:none; border:none; color:#94A3B8; cursor:pointer; font-size:22px; line-height:1;">&times;</button>
      </div>

      <div class="win-chat-body" id="winChatBody">
        <div class="chat-bubble bubble-bot">
          Hello! Welcome to <strong>Win Energy</strong> (Sangli Works, Maharashtra).
          <br><br>I am your clean-tech engineering advisor. I can assist you with:
          <br>• <strong>SCALEBRECK™</strong>: High-TDS electronic water conditioners (Eco 1.0, Mine 1.5 & Commercial Pro)
          <br>• <strong>HydroPulse™</strong>: 100% Salt-free hydropolarization descalers (Marlin Eco 1.0, Marlin Mine 1.5 & Industrial Pro)
          <br>• <strong>CropSafe™</strong>: Solar clean agricultural insect killers (ECO Trap, MINE Trap & Pro Heavy-Duty)
          <br>• <strong>Market Comparisons</strong>: Physical descaling vs chemical softeners & CropSafe vs pesticides
          <br>• <strong>ROI / ROP</strong>: How our technology cuts costs & delivers rapid payback
          <br><br>Select an option below or type your question!
        </div>
      </div>

      <!-- Quick Action Pills Row -->
      <div class="win-chat-quickpills">
        <button onclick="sendQuickPrompt('All product pricing & tiers')">💰 Prices & Tiers</button>
        <button onclick="sendQuickPrompt('ScaleBreck water conditioner details')">💧 ScaleBreck™</button>
        <button onclick="sendQuickPrompt('HydroPulse water descaler details')">🌊 HydroPulse™</button>
        <button onclick="sendQuickPrompt('CropSafe solar insect trap details')">☀️ CropSafe™ Agri</button>
        <button onclick="sendQuickPrompt('Compare with market alternatives')">⚡ Compare vs Market</button>
        <button onclick="sendQuickPrompt('ROI, savings & payback period')">📈 ROI & Savings (ROP)</button>
        <button onclick="sendQuickPrompt('How does it work and install?')">🛠️ How It Works & Install</button>
        <button onclick="sendQuickPrompt('About Win Energy company and facility')">🏢 About Win Energy</button>
        <button onclick="sendQuickPrompt('Official contact number and address')">📞 Contact Info</button>
      </div>

      <form class="win-chat-input-bar" id="winChatForm" onsubmit="event.preventDefault(); handleChatSubmit();">
        <input type="text" id="winChatInput" placeholder="Ask about products, pricing, physics, ROI..." autocomplete="off" />
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
  }, 350);
};

function generateAIResponse(query) {
  const q = query.toLowerCase();

  // 1. ALL PRICES & TIERS SUMMARY
  if ((q.includes('all') && (q.includes('price') || q.includes('tier') || q.includes('product') || q.includes('cost'))) || 
      (q.includes('prices & tiers') || q.includes('pricing & tiers') || q.includes('catalog'))) {
    return `<strong>Win Energy Complete Product Lineup & Pricing:</strong>
      <br><br><strong>1. SCALEBRECK™ Division (TDS & Limescale Control)</strong>:
      <br>• <strong>ScaleBreck™ Eco 1.0:</strong> ₹38,999 (0.5"–1.0" pipe, Flats & Apartments)
      <br>• <strong>ScaleBreck™ Mine 1.5:</strong> ₹49,999 (1.0"–1.5" pipe, Luxury Villas & High Flow)
      <br>• <strong>Commercial Series Pro:</strong> Custom Project Quote (2.0"–8.0"+ pipes, Societies & Plants)
      <br><br><strong>2. HydroPulse™ Division (Hydropolarization Descaling)</strong>:
      <br>• <strong>Marlin Eco 1.0:</strong> ₹41,999 (Up to 1.0" / 25mm pipe, Salt-free, &lt;15W)
      <br>• <strong>Marlin Mine 1.5:</strong> ₹55,999 (Up to 1.5" / 40mm pipe, Flagship Dual-Frequency)
      <br>• <strong>Industrial Series Pro:</strong> Custom Project Quote (2.0"–12.0"+ pipe, Boilers & Cooling Towers)
      <br><br><strong>3. CropSafe™ Clean Agri-Tech Division (Solar Pest Traps)</strong>:
      <br>• <strong>CropSafe ECO Trap:</strong> ₹2,000 (Up to 0.5 Acre, Yellow capture basin)
      <br>• <strong>CropSafe MINE Trap:</strong> ₹7,499 (0.5 – 1.0 Acre, Solar CropSafe trap)
      <br>• <strong>CropSafe Pro (Heavy-Duty):</strong> ₹18,499 (Up to 2.0 Acres, Rain-sensor physical grid)
      <br><br><a href="https://wa.me/919595955585?text=Hello%20Win%20Energy,%20I%20would%20like%20a%20detailed%20product%20quote" target="_blank" style="color:#0284C7; font-weight:700;">Order or Inquire on WhatsApp (+91 9595955585) →</a>`;
  }

  // 2. SCALEBRECK QUERIES (Eco, Mine, Pro)
  if (q.includes('scalebreck eco') || (q.includes('scalebreck') && q.includes('eco'))) {
    return `<strong>ScaleBreck™ Eco 1.0 (Flats & Apartments)</strong>:
      <br>• <strong>Price:</strong> ₹38,999 (MRP ₹48,000 · Save ₹9,001)
      <br>• <strong>Pipeline Fit:</strong> 0.5" to 1.0" (25mm) outer pipe diameter.
      <br>• <strong>TDS Range:</strong> Handles up to 1500+ ppm severe hard water.
      <br>• <strong>Benefits:</strong> Protects geysers, washing machines, showers, and bathroom tiles.
      <br>• <strong>Installation:</strong> Clamp-on DIY without cutting pipe or adding salt.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20ScaleBreck%20Eco%201.0%20(₹38,999)" target="_blank" style="color:#EA580C; font-weight:700;">Order ScaleBreck Eco 1.0 on WhatsApp →</a>`;
  }

  if (q.includes('scalebreck mine') || (q.includes('scalebreck') && q.includes('mine'))) {
    return `<strong>ScaleBreck™ Mine 1.5 (Villas & High Flow)</strong>:
      <br>• <strong>Price:</strong> ₹49,999 (MRP ₹62,000 · Save ₹12,001)
      <br>• <strong>Pipeline Fit:</strong> 1.0" to 1.5" (40mm) main lines.
      <br>• <strong>Application:</strong> Luxury villas, penthouses, multi-bathroom circuits, and central geysers.
      <br>• <strong>Feature:</strong> High-resonance modulated frequency loops for continuous high flow rates.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20ScaleBreck%20Mine%201.5%20(₹49,999)" target="_blank" style="color:#EA580C; font-weight:700;">Order ScaleBreck Mine 1.5 on WhatsApp →</a>`;
  }

  if (q.includes('scalebreck pro') || q.includes('commercial series pro') || (q.includes('scalebreck') && q.includes('commercial'))) {
    return `<strong>ScaleBreck™ Commercial Series Pro (Societies & Plants)</strong>:
      <br>• <strong>Pricing Model:</strong> Custom Project Quote based on pipe diameter & water TDS analysis.
      <br>• <strong>Pipeline Fit:</strong> 2.0" to 8.0"+ commercial intake mains.
      <br>• <strong>Application:</strong> Housing societies, hotels, hospitals, RO pre-treatment, and central hot water circuits.
      <br>• <strong>Advantage:</strong> Eliminates scale in primary heat exchangers, ending descaling shutdowns and acid washes.
      <br><br><a href="contact.html?product=scalebreck" style="color:#EA580C; font-weight:700;">Request Commercial Engineering Sizing Quote →</a>`;
  }

  if (q.includes('scalebreck') || q.includes('breaker') || q.includes('tds') || q.includes('leanway')) {
    return `<strong>SCALEBRECK™ Electronic Water Conditioner</strong>:
      <br>Engineered in partnership by <strong>Leanway Energy & Win Energy</strong> for severe hard water & high TDS:
      <br>• <strong>ScaleBreck™ Eco 1.0:</strong> ₹38,999 (Apartments & Small Homes)
      <br>• <strong>ScaleBreck™ Mine 1.5:</strong> ₹49,999 (Villas & High Flow Lines)
      <br>• <strong>Commercial Series Pro:</strong> Project Quote (Societies & Commercial Plants)
      <br>• <strong>Mechanism:</strong> Delivers modulated square-wave frequencies (1 kHz – 20 kHz) at ±12V DC to alter calcium & magnesium crystal habits.
      <br>• <strong>Zero Maintenance:</strong> Solid-state core with 20+ years component life, zero salt bags, zero plumbing cuts.
      <br><br><a href="scalebreck.html" style="color:#EA580C; font-weight:700;">Explore ScaleBreck Product Details →</a>`;
  }

  // 3. HYDROPULSE QUERIES (Marlin Eco, Marlin Mine, Industrial Pro)
  if (q.includes('marlin eco') || (q.includes('marlin') && q.includes('1.0'))) {
    return `<strong>HydroPulse Marlin Eco 1.0 (Flats & Apartments)</strong>:
      <br>• <strong>Price:</strong> ₹41,999 (MRP ₹52,000 · Save ₹10,001)
      <br>• <strong>Pipeline Fit:</strong> Up to 1.0 Inch (25mm) outer diameter.
      <br>• <strong>Power:</strong> &lt; 15W continuous low-voltage operation.
      <br>• <strong>Benefit:</strong> 100% salt-free limescale prevention for geysers, showers, RO membranes, and taps.
      <br>• <strong>Warranty:</strong> 5-Year comprehensive manufacturer warranty.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20Marlin%20Eco%201.0%20(₹41,999)" target="_blank" style="color:#0284C7; font-weight:700;">Order Marlin Eco 1.0 on WhatsApp →</a>`;
  }

  if (q.includes('marlin mine') || (q.includes('marlin') && q.includes('1.5'))) {
    return `<strong>HydroPulse Marlin Mine 1.5 (Villas & High Flow)</strong>:
      <br>• <strong>Price:</strong> ₹55,999 (MRP ₹68,000 · Save ₹12,001)
      <br>• <strong>Pipeline Fit:</strong> Up to 1.5 Inch (40mm) pipe diameter.
      <br>• <strong>Technology:</strong> Dual-frequency high-resonance loop for luxury villas, commercial setups, and pools.
      <br>• <strong>Performance:</strong> Handles high continuous flow rates and dissolves existing scale deposits.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20Marlin%20Mine%201.5%20(₹55,999)" target="_blank" style="color:#0284C7; font-weight:700;">Order Marlin Mine 1.5 on WhatsApp →</a>`;
  }

  if (q.includes('industrial series pro') || (q.includes('hydropulse') && (q.includes('industrial') || q.includes('pro') || q.includes('boiler')))) {
    return `<strong>HydroPulse Industrial Series Pro (Factories & Agriculture)</strong>:
      <br>• <strong>Pricing Model:</strong> Custom Project Sizing Quote.
      <br>• <strong>Pipeline Fit:</strong> 2.0" to 12.0"+ pipelines (hundreds of m³/hour).
      <br>• <strong>Application:</strong> Industrial boilers, cooling towers, heat exchangers, injection molding, and drip irrigation mains.
      <br>• <strong>Advantage:</strong> Eliminates boiler scale blowdown water loss, saves up to 50% thermal energy, and pays back under 6–12 months.
      <br><br><a href="contact.html?product=industrial" style="color:#0284C7; font-weight:700;">Request Industrial Sizing Quote →</a>`;
  }

  if (q.includes('hydropulse') || q.includes('marlin') || q.includes('descaler')) {
    return `<strong>HydroPulse™ Electronic Water Descalers</strong>:
      <br>Engineered for molecular crystal restructuring with zero salts, zero acids, and zero pressure drops:
      <br>• <strong>Marlin Eco 1.0:</strong> ₹41,999 (Apartments & Small Homes)
      <br>• <strong>Marlin Mine 1.5:</strong> ₹55,999 (Villas & High Flow Lines)
      <br>• <strong>Industrial Series Pro:</strong> Project Quote (Factories, Boilers & Agriculture)
      <br>• <strong>Technology:</strong> 0–160 kHz RFID modulation converting calcite into harmless suspended aragonite.
      <br><br><a href="hydropulse.html" style="color:#0284C7; font-weight:700;">View HydroPulse Product Showcase →</a>`;
  }

  // 4. CROPSAFE QUERIES (ECO, MINE, PRO)
  if (((q.includes('cropsafe') || q.includes('buzzzap')) && q.includes('eco')) || ((q.includes('cropsafe') || q.includes('buzzzap')) && q.includes('eco'))) {
    return `<strong>CropSafe ECO Trap (Small & Medium Farms)</strong>:
      <br>• <strong>Price:</strong> ₹2,000 (MRP ₹3,000 · Save ₹1,000)
      <br>• <strong>Effective Coverage:</strong> Up to 0.5 Acre.
      <br>• <strong>Operation:</strong> Automatic 2–3 hours post-sunset activation when nocturnal pests mate.
      <br>• <strong>Design:</strong> High-efficiency PV solar panel, yellow capture basin, single microchip controller.
      <br>• <strong>Ideal For:</strong> Smallholder farmers, polyhouses, horticulture, and vegetable plots.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20CropSafe%20ECO%20Trap%20(₹2,000)" target="_blank" style="color:#059669; font-weight:700;">Order CropSafe ECO on WhatsApp →</a>`;
  }

  if (((q.includes('cropsafe') || q.includes('buzzzap')) && q.includes('mine')) || ((q.includes('cropsafe') || q.includes('buzzzap')) && q.includes('mine'))) {
    return `<strong>CropSafe MINE Trap (Enhanced Solar Insect Trap)</strong>:
      <br>• <strong>Price:</strong> ₹7,499 (MRP ₹9,999 · Save ₹2,500)
      <br>• <strong>Effective Coverage:</strong> Up to 0.5 – 1.0 Acre.
      <br>• <strong>Features:</strong> Solar CropSafe design with reinforced diffuse charging PV panel and large yellow basin.
      <br>• <strong>Operation:</strong> Fully automatic dusk-to-dawn microcontroller, overcharge & deep-discharge protection.
      <br>• <strong>Ideal For:</strong> Vineyards, pomegranate, guava, citrus orchards, and cotton acreage.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20CropSafe%20MINE%20Trap%20(₹7,499)" target="_blank" style="color:#059669; font-weight:700;">Order CropSafe MINE on WhatsApp →</a>`;
  }

  if (((q.includes('cropsafe') || q.includes('buzzzap')) && (q.includes('pro') || q.includes('heavy') || q.includes('duty'))) || ((q.includes('cropsafe') || q.includes('buzzzap')) && (q.includes('pro') || q.includes('heavy') || q.includes('duty')))) {
    return `<strong>CropSafe Pro Heavy-Duty (Commercial & Large Acreage)</strong>:
      <br>• <strong>Price:</strong> ₹18,499 (MRP ₹24,000 · Save ₹5,501)
      <br>• <strong>Effective Coverage:</strong> Up to 2.0 Acres per unit.
      <br>• <strong>Technology:</strong> High-voltage non-stick physical grid with automated collection tray and rain sensor.
      <br>• <strong>Durability:</strong> Stainless steel grid, IP65 weatherproof housing, multi-acre deployment package.
      <br><br><a href="https://wa.me/919595955585?text=Hello,%20I%20want%20to%20order%20CropSafe%20Pro%20(₹18,499)" target="_blank" style="color:#059669; font-weight:700;">Order CropSafe Pro on WhatsApp →</a>`;
  }

  if ((q.includes('cropsafe') || q.includes('buzzzap')) || q.includes('pest') || q.includes('insect') || q.includes('trap') || q.includes('farm') || q.includes('agri')) {
    return `<strong>CropSafe™ Solar Agricultural Insect Killers</strong>:
      <br>100% solar autonomous clean agri-tech engineered in Sangli, Maharashtra:
      <br>• <strong>CropSafe ECO Trap:</strong> ₹2,000 (Up to 0.5 Acre)
      <br>• <strong>CropSafe MINE Trap:</strong> ₹7,499 (0.5 – 1.0 Acre, CropSafe basin)
      <br>• <strong>CropSafe Pro (Heavy-Duty):</strong> ₹18,499 (Up to 2.0 Acres, Rain-sensor physical grid)
      <br>• <strong>Key Benefit:</strong> Cuts chemical pesticide sprays by 50% to 80%, eliminates 1,800+ pest species, and safeguards friendly honeybee pollinators.
      <br><br><a href="cropsafe.html" style="color:#059669; font-weight:700;">View CropSafe Product Lineup →</a>`;
  }

  // 5. MARKET COMPARISON & COMPETITOR ANALYSIS
  if (q.includes('compare') || q.includes('alternative') || q.includes('vs') || q.includes('market') || q.includes('competitor') || q.includes('softener') || q.includes('chemical')) {
    return `<strong>Why Win Energy Outperforms Market Alternatives:</strong>
      <br><br><strong>🌊 Water Conditioning (HydroPulse / ScaleBreck vs Conventional Softeners)</strong>:
      <br>• <strong>Traditional Softeners:</strong> Add unhealthy sodium into drinking water (unsuitable for hypertension), waste 30%–40% water in brine backwash, require recurring 25kg salt bags, and accelerate plumbing pipe corrosion.
      <br>• <strong>Win Energy Physical Descalers:</strong> 100% Salt-Free & Chemical-Free. Retains healthy calcium & magnesium minerals in silky aragonite form. Zero water wastage, zero consumables, zero maintenance, and zero pressure drops!
      <br><br><strong>☀️ Agriculture (CropSafe vs Chemical Sprays)</strong>:
      <br>• <strong>Chemical Pesticides:</strong> Cost ₹15,000–₹40,000/acre annually, breed immune super-pests, kill essential honeybee pollinators, and leave carcinogenic chemical residues on food.
      <br>• <strong>CropSafe Solar Traps:</strong> 100% Solar Autonomous, zero recurring consumable costs, eliminates 1,800+ nocturnal pest species, and operates safely when bees are asleep in hives!`;
  }

  // 6. ROI, ROP (RATIO OF RETURN PROFITS) & MONEY SAVINGS
  if (q.includes('roi') || q.includes('rop') || q.includes('save') || q.includes('profit') || q.includes('payback') || q.includes('return') || q.includes('money')) {
    return `<strong>Return on Investment (ROI) & Money Savings (ROP)</strong>:
      <br><br><strong>💰 Water Descaling Financial Return:</strong>
      <br>• <strong>Thermal Energy Savings:</strong> A thin 3mm limescale layer in geysers, boilers, or chillers creates thermal resistance that increases energy consumption by <strong>20% to 50%</strong>. HydroPulse & ScaleBreck dissolve this layer, cutting water heating bills by up to 50%!
      <br>• <strong>Plumbing & Appliance Life:</strong> Ends premature replacement of geyser heating coils, washing machines, RO membranes, and expensive bathroom fittings.
      <br>• <strong>Payback Period:</strong> Typically <strong>6 to 12 months</strong> for residential and commercial facilities.
      <br><br><strong>🌾 Agricultural Profit Ratio (CropSafe):</strong>
      <br>• <strong>Direct Spray Savings:</strong> Cuts chemical pesticide sprays by <strong>50% to 80%</strong>, saving farmers ₹12,000 to ₹25,000 per acre per season.
      <br>• <strong>Crop Yield Quality:</strong> Higher grade, residue-free produce commands premium export and domestic market prices.
      <br>• <strong>Payback Period:</strong> Recovers initial investment within a <strong>single crop cycle</strong>!`;
  }

  // 7. HOW IT WORKS & WORKING MECHANISM
  if (q.includes('how') && (q.includes('work') || q.includes('physics') || q.includes('science') || q.includes('mechanism'))) {
    return `<strong>How Win Energy Physical Technology Works:</strong>
      <br><br><strong>1. HydroPulse & ScaleBreck Physical Descaling:</strong>
      <br>• Delivers precise <strong>Audio-Frequency RFID Modulation (0 – 160 kHz)</strong> via external clamp-on induction coils.
      <br>• Forces dissolved calcium (Ca²⁺) and bicarbonate (HCO₃⁻) ions to nucleate in suspension rather than onto pipe walls.
      <br>• Transforms sharp, needle-like <em>calcite</em> (which sticks and creates hard scale) into smooth, spherical, non-adhering <em>aragonite</em> crystals that stay suspended in water and flush out harmlessly.
      <br><br><strong>2. CropSafe Phototropic Agri-Pest Window:</strong>
      <br>• Uses specialized multi-spectrum UV-A LEDs calibrated to the biological attraction frequencies of 1,800+ nocturnal agricultural pests.
      <br>• Automated dusk-to-dawn microcontroller operates only during peak 2–3 hour night mating windows.
      <br>• Fully dormant during daylight hours, ensuring <strong>100% protection for honeybees and natural pollinators</strong>.`;
  }

  // 8. INSTALLATION & DIY SIMPLICITY
  if (q.includes('install') || q.includes('diy') || q.includes('fit') || q.includes('pipe') || q.includes('cut')) {
    return `<strong>Simple Clamp-On DIY Installation:</strong>
      <br>• <strong>Zero Pipe Cutting:</strong> Non-invasive external installation. Signal coils wrap around your intake water line without cutting pipes or causing water downtime.
      <br>• <strong>All Pipe Materials Supported:</strong> Compatible with PVC, CPVC, GI (Galvanized Iron), Copper, Stainless Steel, and HDPE pipelines.
      <br>• <strong>Zero Plumbing Tools:</strong> Can be installed in under 15 minutes by anyone using the provided heavy-duty mounting ties and 12V DC power plug.
      <br>• <strong>CropSafe Field Setup:</strong> Simply stake the unit into field soil with a standard 1-inch pole facing south for optimal solar charge.`;
  }

  // 9. ABOUT WIN ENERGY & SANGLI WORKS
  if (q.includes('about') || q.includes('win energy') || q.includes('sangli') || q.includes('facility') || q.includes('factory') || q.includes('company')) {
    return `<strong>About Win Energy:</strong>
      <br>• <strong>Company Profile:</strong> Win Energy is an engineering-driven clean technology company developing sustainable physical water conditioning and precision agricultural solutions.
      <br>• <strong>Manufacturing Works:</strong> State-of-the-art facility located at <em>Plot no. 2038/B, Malgaon Savali Road, Malgaon, Sangli – 416410, Maharashtra, INDIA</em>.
      <br>• <strong>Engineering Partnership:</strong> ScaleBreck is co-engineered in partnership with <strong>Leanway Energy Pvt. Ltd.</strong>
      <br>• <strong>Certifications & Quality:</strong> Produced under ISO 9001:2015, ISO 14001 environmental standards, and CE compliance.
      <br>• <strong>Mission:</strong> Eliminating chemical consumables, conserving natural resources, and empowering homes and farmers with durable Made-in-India technology.`;
  }

  // 10. OFFICIAL CONTACT & SIZING SUPPORT
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email') || q.includes('address') || q.includes('call') || q.includes('whatsapp') || q.includes('location')) {
    return `<strong>Win Energy Official Contacts & Support:</strong>
      <br>• <strong>Direct Phone / WhatsApp:</strong> +91 9595955585
      <br>• <strong>Official Email:</strong> contact@winenergy.in / info@winenergy.in
      <br>• <strong>Manufacturing Works:</strong> Plot no. 2038/B, Malgaon Savali Road, Malgaon, Sangli – 416410, Maharashtra, INDIA.
      <br>• <strong>Hours:</strong> Monday – Saturday: 9:00 AM – 7:00 PM IST
      <br><br><a href="https://wa.me/919595955585?text=Hello%20Win%20Energy,%20I%20would%20like%20to%20speak%20with%20an%20engineer" target="_blank" style="color:#25D366; font-weight:700;">Click Here to Chat on WhatsApp (+91 9595955585) →</a>`;
  }

  // General Fallback with Guided Options
  return `Thank you for reaching out to <strong>Win Energy</strong>!
    <br><br>I can help you with:
    <br>• <strong>ScaleBreck™:</strong> Eco 1.0 (₹38,999) | Mine 1.5 (₹49,999) | Commercial Pro
    <br>• <strong>HydroPulse™:</strong> Marlin Eco 1.0 (₹41,999) | Marlin Mine 1.5 (₹55,999) | Industrial Pro
    <br>• <strong>CropSafe™:</strong> ECO Trap (₹2,000) | MINE Trap (₹7,499) | Pro HD (₹18,499)
    <br>• <strong>ROI / ROP & Market Comparisons:</strong> Why physical descaling saves up to 50% on energy bills.
    <br><br>Please select one of the quick buttons above or ask for specific sizing recommendations!`;
}
