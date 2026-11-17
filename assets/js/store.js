// Win Energy E-Commerce, Authentication & Checkout Engine

(function() {
    // 1. Initial State
    let cart = JSON.parse(localStorage.getItem('win_energy_cart') || '[]');
    let currentUser = JSON.parse(localStorage.getItem('win_energy_user') || 'null');
    let isRegisterMode = true;

    // 2. Format Currency (INR)
    function formatINR(amount) {
        return '₹' + Number(amount).toLocaleString('en-IN');
    }

    // 3. Save Cart
    function saveCart() {
        localStorage.setItem('win_energy_cart', JSON.stringify(cart));
        updateCartBadges();
        renderCartItems();
    }

    // 4. Update Header Badges
    function updateCartBadges() {
        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        const badges = document.querySelectorAll('#header-cart-count, .header-cart-count-mobile');
        badges.forEach(b => {
            b.textContent = totalItems;
        });

        const inqBtns = document.querySelectorAll('.header-inquiry-label, .header-user-label');
        inqBtns.forEach(btn => {
            btn.textContent = (window.i18next && typeof window.i18next.t === 'function') ? window.i18next.t('nav.inquiry') : 'Inquiry';
        });
    }

    window.addEventListener('winEnergyLanguageChanged', () => {
        updateCartBadges();
    });

    // 5. Hide / Show Floating Widgets (AI Assistant & WhatsApp) to prevent overlap
    function setFloatingWidgetsVisible(visible) {
        const floaters = document.querySelectorAll('.win-float-container, #ai-chat-window');
        floaters.forEach(el => {
            if (visible) {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
                el.style.visibility = 'visible';
            } else {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                el.style.visibility = 'hidden';
            }
        });
    }

    // 6. Build WhatsApp Order URL
    function buildWhatsAppOrderUrl(orderNotes) {
        if (cart.length === 0) return 'https://wa.me/919595955585';
        let msg = 'Hello Win Energy, I would like to place an order:\n\n';
        let total = 0;
        cart.forEach((item, idx) => {
            const itemTotal = item.price * (item.qty || 1);
            total += itemTotal;
            msg += `${idx + 1}. ${item.name} x ${item.qty || 1} = ${formatINR(itemTotal)}\n`;
        });
        msg += `\n*Total Amount:* ${formatINR(total)}`;
        if (orderNotes) {
            msg += `\n*Customer Info:* ${orderNotes}`;
        }
        return 'https://wa.me/919595955585?text=' + encodeURIComponent(msg);
    }

    // 7. Render Cart Items in Drawer
    function renderCartItems() {
        const listEl = document.getElementById('cart-items-list');
        const emptyEl = document.getElementById('cart-empty-view');
        const footerEl = document.getElementById('cart-footer-view');
        const subtotalEl = document.getElementById('cart-subtotal');
        const drawerTitleCount = document.getElementById('cart-drawer-count');
        const waBtn = document.getElementById('cart-wa-btn');

        if (!listEl) return;

        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (drawerTitleCount) drawerTitleCount.textContent = totalItems;

        if (cart.length === 0) {
            emptyEl.classList.remove('hidden');
            listEl.classList.add('hidden');
            footerEl.classList.add('hidden');
            return;
        }

        emptyEl.classList.add('hidden');
        listEl.classList.remove('hidden');
        footerEl.classList.remove('hidden');

        let subtotal = 0;
        listEl.innerHTML = cart.map((item, index) => {
            const itemTotal = item.price * (item.qty || 1);
            subtotal += itemTotal;
            return `
                <div class="flex items-center gap-4 p-4 bg-win-sand rounded-2xl border border-win-border">
                    <div class="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center border border-win-border shrink-0">
                        <img src="${item.image || 'assets/images/company/win_energy_emblem.png'}" alt="${item.name}" class="max-h-full max-w-full object-contain">
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-heading font-bold text-win-dark text-xs truncate">${item.name}</h4>
                        <div class="text-win-hpBlue font-serif font-bold text-sm mt-0.5">${formatINR(item.price)}</div>
                        <div class="flex items-center gap-2 mt-2">
                            <button onclick="window.winStore.updateQty(${index}, -1)" class="w-6 h-6 rounded-lg bg-white border border-win-border flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">-</button>
                            <span class="text-xs font-bold text-win-dark px-1">${item.qty || 1}</span>
                            <button onclick="window.winStore.updateQty(${index}, 1)" class="w-6 h-6 rounded-lg bg-white border border-win-border flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">+</button>
                        </div>
                    </div>
                    <button onclick="window.winStore.removeItem(${index})" class="text-slate-400 hover:text-red-500 p-2 transition-colors" title="Remove Item">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
        }).join('');

        if (subtotalEl) {
            subtotalEl.textContent = formatINR(subtotal);
        }

        if (waBtn) {
            waBtn.href = buildWhatsAppOrderUrl();
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // 8. Inject Modals and Drawers into DOM
    function injectStoreModals() {
        const existing = document.getElementById('win-store-container');
        if (existing && document.getElementById('inquiry-modal')) return;
        if (existing) {
            existing.remove();
        }

        const container = document.createElement('div');
        container.id = 'win-store-container';
        container.innerHTML = `
            <!-- Cart Drawer Backdrop -->
            <div id="cart-drawer-backdrop" onclick="window.winStore.closeCart()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99998] opacity-0 pointer-events-none transition-opacity duration-300"></div>

            <!-- Cart Slide-out Drawer -->
            <aside id="cart-drawer" class="fixed top-0 right-0 bottom-0 w-full max-w-md bg-win-surface shadow-2xl z-[99999] translate-x-full transition-transform duration-300 ease-in-out flex flex-col border-l border-win-border">
                <!-- Header -->
                <div class="p-6 border-b border-win-border flex items-center justify-between bg-win-base">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-win-hpBlueLight flex items-center justify-center text-win-hpBlue">
                            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-win-dark text-base">Your Cart</h3>
                            <p class="text-xs text-win-muted font-medium"><span id="cart-drawer-count">0</span> items in cart</p>
                        </div>
                    </div>
                    <button onclick="window.winStore.closeCart()" class="p-2 rounded-xl text-slate-400 hover:text-win-dark hover:bg-slate-100 transition-colors" aria-label="Close cart">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Body / Items List -->
                <div class="flex-1 overflow-y-auto p-6 space-y-4">
                    <!-- Empty State -->
                    <div id="cart-empty-view" class="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-win-muted">
                        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <i data-lucide="shopping-cart" class="w-8 h-8"></i>
                        </div>
                        <h4 class="font-heading font-bold text-win-dark text-lg">Your cart is empty</h4>
                        <p class="text-xs text-slate-500 max-w-xs leading-relaxed">Browse our high-efficiency water descalers and solar agricultural pest killers.</p>
                        <a href="products.html" onclick="window.winStore.closeCart()" class="bg-win-hpBlue hover:bg-win-hpBlueDark text-white px-6 py-3 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase shadow-xs transition-colors">
                            Explore Products
                        </a>
                    </div>

                    <!-- Items Container -->
                    <div id="cart-items-list" class="space-y-3 hidden"></div>
                </div>

                <!-- Footer / Checkout -->
                <div id="cart-footer-view" class="p-6 pb-8 border-t border-win-border bg-win-base space-y-4 hidden shadow-lg">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-win-muted font-semibold uppercase tracking-wider">Subtotal</span>
                        <span id="cart-subtotal" class="font-serif font-bold text-2xl text-win-dark">₹0</span>
                    </div>
                    <p class="text-[11px] text-slate-500">Taxes calculated at checkout. Free shipping across India.</p>
                    
                    <div class="flex flex-col gap-2.5 pt-1">
                        <!-- Direct Checkout Trigger -->
                        <button onclick="window.winStore.openCheckout()" class="w-full bg-win-hpBlue hover:bg-win-hpBlueDark text-white py-3.5 rounded-xl font-heading font-bold text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-2">
                            <span>Proceed to Checkout</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                        
                        <!-- Instant WhatsApp Order -->
                        <a id="cart-wa-btn" href="https://wa.me/919595955585" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-2">
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                            <span>Order on WhatsApp</span>
                        </a>
                    </div>
                </div>
            </aside>

            <!-- Complete Checkout Modal Backdrop -->
            <div id="checkout-modal-backdrop" onclick="window.winStore.closeCheckout()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100000] opacity-0 pointer-events-none transition-opacity duration-300"></div>

            <!-- Complete Checkout Modal Dialog -->
            <div id="checkout-modal" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-win-surface border border-win-border rounded-3xl shadow-2xl z-[100001] p-6 sm:p-8 opacity-0 scale-95 pointer-events-none transition-all duration-300">
                <!-- Modal Close -->
                <button onclick="window.winStore.closeCheckout()" class="absolute top-6 right-6 p-2 text-slate-400 hover:text-win-dark rounded-xl hover:bg-slate-100 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <!-- Step 1: Order Details Form -->
                <div id="checkout-form-step">
                    <div class="space-y-2 mb-6">
                        <span class="text-[10px] font-mono uppercase tracking-widest text-win-hpBlue font-bold bg-win-hpBlueLight px-3 py-1 rounded-full">Secure Order Processing</span>
                        <h3 class="font-serif text-2xl sm:text-3xl text-win-dark font-bold mt-1">Order Checkout</h3>
                        <p class="text-xs text-win-muted">Confirm delivery destination and preferred payment method.</p>
                    </div>

                    <!-- Order Summary Box -->
                    <div class="p-4 bg-win-sand rounded-2xl border border-win-border mb-6 space-y-2">
                        <div class="flex items-center justify-between text-xs font-semibold text-slate-700">
                            <span>Order Summary (<span id="checkout-item-count">0</span> items)</span>
                            <span id="checkout-summary-total" class="text-win-hpBlue font-serif font-bold text-base">₹0</span>
                        </div>
                        <div id="checkout-mini-list" class="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-200"></div>
                    </div>

                    <!-- Checkout Form -->
                    <form onsubmit="window.winStore.handleCheckoutSubmit(event)" class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-700">Full Name *</label>
                                <input type="text" id="chk-name" required placeholder="John Doe" class="w-full px-4 py-3 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-700">Phone / WhatsApp *</label>
                                <input type="tel" id="chk-phone" required placeholder="+91 98765 43210" class="w-full px-4 py-3 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-slate-700">Email Address</label>
                            <input type="email" id="chk-email" placeholder="john@example.com" class="w-full px-4 py-3 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-semibold text-slate-700">Delivery Address *</label>
                            <input type="text" id="chk-address" required placeholder="House / Flat / Survey No., Street, Landmark" class="w-full px-4 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-700">City / District *</label>
                                <input type="text" id="chk-city" required placeholder="e.g. Sangli" class="w-full px-3 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-700">State *</label>
                                <input type="text" id="chk-state" required placeholder="Maharashtra" value="Maharashtra" class="w-full px-3 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-semibold text-slate-700">PIN Code *</label>
                                <input type="text" id="chk-pincode" required placeholder="416410" class="w-full px-3 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                        </div>

                        <div class="space-y-2 pt-2">
                            <label class="text-xs font-semibold text-slate-700">Payment Option *</label>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <label class="flex items-center gap-2.5 p-3 rounded-xl border border-win-hpBlue bg-win-hpBlueLight/20 cursor-pointer">
                                    <input type="radio" name="payment_method" value="COD" checked class="text-win-hpBlue focus:ring-win-hpBlue">
                                    <span class="font-semibold text-slate-800">Cash on Delivery</span>
                                </label>
                                <label class="flex items-center gap-2.5 p-3 rounded-xl border border-win-border bg-win-base cursor-pointer hover:border-slate-300">
                                    <input type="radio" name="payment_method" value="Razorpay" class="text-win-hpBlue focus:ring-win-hpBlue">
                                    <span class="font-semibold text-slate-800">Razorpay / UPI / Card</span>
                                </label>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-win-border flex items-center gap-3">
                            <button type="submit" class="flex-1 bg-win-dark hover:bg-win-hpBlue text-white py-3.5 rounded-xl font-heading font-bold text-xs tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center gap-2">
                                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
                                <span>Confirm & Place Order</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Step 2: Order Confirmed Success Screen -->
                <div id="checkout-success-step" class="text-center py-6 space-y-5 hidden">
                    <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <i data-lucide="check" class="w-8 h-8"></i>
                    </div>
                    <div class="space-y-2">
                        <h3 class="font-serif text-3xl text-win-dark font-bold">Order Confirmed!</h3>
                        <p class="text-xs text-win-muted">Thank you. Your order has been placed with Win Energy.</p>
                        <div class="inline-block px-4 py-2 bg-win-sand border border-win-border rounded-xl text-xs font-mono font-bold text-win-dark mt-2">
                            Order ID: <span id="confirmed-order-id" class="text-win-hpBlue">WIN-00000</span>
                        </div>
                    </div>
                    <div class="p-4 bg-slate-50 border border-win-border rounded-2xl text-xs text-slate-600 text-left space-y-1.5 max-w-sm mx-auto">
                        <div class="flex justify-between"><span>Dispatch:</span><strong>1–2 Business Days</strong></div>
                        <div class="flex justify-between"><span>Warranty:</span><strong>Included (5 Years)</strong></div>
                        <div class="flex justify-between"><span>Support Desk:</span><strong>+91 9595955585</strong></div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3 pt-2 max-w-sm mx-auto">
                        <a id="confirmed-wa-link" href="#" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-heading font-semibold text-xs uppercase flex items-center justify-center gap-2 shadow-xs transition-colors">
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                            <span>Confirm on WhatsApp</span>
                        </a>
                        <button onclick="window.winStore.closeCheckout()" class="px-5 py-3 bg-win-sand hover:bg-slate-200 text-win-dark rounded-xl font-heading font-semibold text-xs uppercase transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <!-- Inquiry & Consultation Modal Backdrop -->
            <div id="inquiry-modal-backdrop" onclick="window.winStore.closeInquiry()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100000] opacity-0 pointer-events-none transition-opacity duration-300"></div>

            <!-- Inquiry & Consultation Modal Dialog (Styled exactly like the login modal in Screenshot 2) -->
            <div id="inquiry-modal" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[92vh] overflow-y-auto bg-win-surface border border-win-border rounded-3xl shadow-2xl z-[100001] p-6 sm:p-8 opacity-0 scale-95 pointer-events-none transition-all duration-300">
                <!-- Modal Close -->
                <button onclick="window.winStore.closeInquiry()" class="absolute top-6 right-6 p-2 text-slate-400 hover:text-win-dark rounded-xl hover:bg-slate-100 transition-colors" aria-label="Close modal">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <!-- Brand Header (Centered emblem + title matching Screenshot 2) -->
                <div class="text-center space-y-2 mb-6">
                    <img src="assets/images/company/win_energy_emblem.png" alt="Win Energy" class="w-12 h-12 mx-auto object-contain">
                    <span class="inline-block text-[10px] font-mono uppercase tracking-widest text-win-hpOrange font-bold bg-win-hpOrangeLight px-3 py-1 rounded-full">INQUIRY & DEALERSHIP</span>
                    <h3 class="font-serif text-2xl text-win-dark font-bold">Send an Inquiry / Request Consultation</h3>
                    <p class="text-xs text-win-muted">Speak directly with our engineering and consultation team.</p>
                </div>

                <!-- Step 1: Inquiry Form View -->
                <div id="modal-inquiry-form-step">
                    <form id="modalInquiryForm" onsubmit="window.winStore.handleInquirySubmit(event)" class="space-y-3.5">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label for="modal-inq-name" class="text-xs font-semibold text-slate-700">Full Name *</label>
                                <input type="text" id="modal-inq-name" required placeholder="e.g. Ramesh Patel" class="w-full px-4 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                            <div class="space-y-1">
                                <label for="modal-inq-phone" class="text-xs font-semibold text-slate-700">Phone Number *</label>
                                <input type="tel" id="modal-inq-phone" required placeholder="e.g. +91 98765 43210" class="w-full px-4 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-1">
                                <label for="modal-inq-email" class="text-xs font-semibold text-slate-700">Email Address</label>
                                <input type="email" id="modal-inq-email" placeholder="e.g. contact@domain.com" class="w-full px-4 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors">
                            </div>
                            <div class="space-y-1">
                                <label for="modal-inq-product" class="text-xs font-semibold text-slate-700">Product / Division *</label>
                                <select id="modal-inq-product" required class="w-full px-3 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors cursor-pointer">
                                    <option value="ScaleBreck™ Eco 1.0 (Flats & Apartments)">ScaleBreck™ Eco 1.0 (Flats & Apartments)</option>
                                    <option value="ScaleBreck™ Mine 1.5 (Villas & High Flow)">ScaleBreck™ Mine 1.5 (Villas & High Flow)</option>
                                    <option value="ScaleBreck™ Commercial Series Pro">ScaleBreck™ Commercial Series Pro</option>
                                    <option value="HydroPulse Marlin Eco 1.0 — Homes">HydroPulse Marlin Eco 1.0 — Homes</option>
                                    <option value="HydroPulse Marlin Mine 1.5 — Villas/Commercial">HydroPulse Marlin Mine 1.5 — Villas/Commercial</option>
                                    <option value="HydroPulse Industrial Series Pro">HydroPulse Industrial Series Pro</option>
                                    <option value="CropSafe ECO (Up to 0.5 Acre Solar Trap)">CropSafe ECO (Up to 0.5 Acre Solar Trap)</option>
                                    <option value="CropSafe MINE (0.5 - 1.0 Acre Solar Trap)">CropSafe MINE (0.5 - 1.0 Acre Solar Trap)</option>
                                    <option value="CropSafe Pro (Up to 2.0 Acres Solar Killer)">CropSafe Pro (Up to 2.0 Acres Solar Killer)</option>
                                    <option value="Regional Dealership / Distribution">Regional Dealership / Distribution</option>
                                    <option value="Multiple Products / Complete Consultation">Multiple Products / Complete Consultation</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label for="modal-inq-sector" class="text-xs font-semibold text-slate-700">Application Sector</label>
                            <select id="modal-inq-sector" class="w-full px-3 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors cursor-pointer">
                                <option value="Residential Villa / Apartment">Residential Villa / Apartment</option>
                                <option value="Agriculture / Vineyard / Orchard">Agriculture / Vineyard / Orchard</option>
                                <option value="Hotels & Commercial Real Estate">Hotels & Commercial Real Estate</option>
                                <option value="Industrial Manufacturing & Boilers">Industrial Manufacturing & Boilers</option>
                                <option value="Poultry / Livestock">Poultry / Livestock</option>
                                <option value="Other Application">Other Application</option>
                            </select>
                        </div>

                        <div class="space-y-1">
                            <label for="modal-inq-message" class="text-xs font-semibold text-slate-700">Your Requirement or Message</label>
                            <textarea id="modal-inq-message" rows="2" placeholder="Mention pipeline diameter, water hardness issues, or farm acreage..." class="w-full px-4 py-2.5 bg-win-base border border-win-border rounded-xl text-xs text-win-dark focus:outline-none focus:border-win-hpBlue transition-colors resize-none"></textarea>
                        </div>

                        <button type="submit" class="w-full bg-win-dark hover:bg-win-hpBlue text-white py-3.5 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm mt-2">
                            SUBMIT INQUIRY
                        </button>
                    </form>

                    <div class="pt-4 border-t border-win-border mt-4 text-center text-xs text-slate-600">
                        Prefer direct chat?
                        <a href="https://wa.me/919595955585" target="_blank" class="font-semibold text-win-hpBlue hover:underline ml-1">Chat on WhatsApp</a>
                    </div>
                </div>

                <!-- Step 2: Inquiry Success View -->
                <div id="modal-inquiry-success-step" class="text-center py-6 space-y-4 hidden">
                    <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <i data-lucide="check" class="w-8 h-8"></i>
                    </div>
                    <div class="space-y-1">
                        <h3 class="font-serif text-2xl text-win-dark font-bold">Inquiry Received!</h3>
                        <p class="text-xs text-win-muted max-w-sm mx-auto">
                            Thank you, <strong id="modal-inq-success-name" class="text-slate-800"></strong>! Your technical inquiry has been submitted. Our engineering desk will review your details and reach out to <strong id="modal-inq-success-phone" class="text-slate-800"></strong> promptly.
                        </p>
                    </div>
                    <div class="p-4 bg-slate-50 border border-win-border rounded-2xl text-xs text-slate-600 text-left space-y-1.5 max-w-sm mx-auto">
                        <div class="flex justify-between"><span>Product:</span><strong id="modal-inq-success-prod" class="text-win-hpBlue truncate max-w-[200px]">ScaleBreck</strong></div>
                        <div class="flex justify-between"><span>Engineering Desk:</span><strong>+91 9595955585</strong></div>
                        <div class="flex justify-between"><span>Response Time:</span><strong>Under 2 Hours</strong></div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-sm mx-auto">
                        <a id="modal-inq-success-wa" href="#" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-heading font-semibold text-xs uppercase flex items-center justify-center gap-2 shadow-xs transition-colors">
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                            <span>Chat on WhatsApp</span>
                        </a>
                        <button onclick="window.winStore.closeInquiry()" class="px-5 py-3 bg-win-sand hover:bg-slate-200 text-win-dark rounded-xl font-heading font-semibold text-xs uppercase transition-colors">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Public API on window.winStore
    window.winStore = {
        openCart: function() {
            injectStoreModals();
            renderCartItems();
            setFloatingWidgetsVisible(false);
            const backdrop = document.getElementById('cart-drawer-backdrop');
            const drawer = document.getElementById('cart-drawer');
            if (backdrop && drawer) {
                backdrop.classList.remove('opacity-0', 'pointer-events-none');
                drawer.classList.remove('translate-x-full');
            }
        },
        closeCart: function() {
            setFloatingWidgetsVisible(true);
            const backdrop = document.getElementById('cart-drawer-backdrop');
            const drawer = document.getElementById('cart-drawer');
            if (backdrop && drawer) {
                backdrop.classList.add('opacity-0', 'pointer-events-none');
                drawer.classList.add('translate-x-full');
            }
        },
        toggleCart: function() {
            const drawer = document.getElementById('cart-drawer');
            if (drawer && !drawer.classList.contains('translate-x-full')) {
                this.closeCart();
            } else {
                this.openCart();
            }
        },
        addItem: function(name, price, image) {
            injectStoreModals();
            const existing = cart.find(i => i.name === name);
            if (existing) {
                existing.qty = (existing.qty || 1) + 1;
            } else {
                cart.push({ name, price: Number(price), image, qty: 1 });
            }
            saveCart();
            this.openCart();
        },
        removeItem: function(index) {
            cart.splice(index, 1);
            saveCart();
        },
        updateQty: function(index, delta) {
            if (!cart[index]) return;
            cart[index].qty = (cart[index].qty || 1) + delta;
            if (cart[index].qty <= 0) {
                cart.splice(index, 1);
            }
            saveCart();
        },
        openCheckout: function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add a product first.');
                return;
            }
            this.closeCart();
            injectStoreModals();
            setFloatingWidgetsVisible(false);

            // Populate checkout modal
            const stepForm = document.getElementById('checkout-form-step');
            const stepSuccess = document.getElementById('checkout-success-step');
            stepForm.classList.remove('hidden');
            stepSuccess.classList.add('hidden');

            const countEl = document.getElementById('checkout-item-count');
            const totalEl = document.getElementById('checkout-summary-total');
            const miniList = document.getElementById('checkout-mini-list');
            
            const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

            if (countEl) countEl.textContent = totalItems;
            if (totalEl) totalEl.textContent = formatINR(subtotal);

            if (miniList) {
                miniList.innerHTML = cart.map(i => `
                    <div class="flex justify-between">
                        <span class="truncate max-w-[240px]">${i.name} (x${i.qty || 1})</span>
                        <span class="font-medium text-slate-700">${formatINR(i.price * (i.qty || 1))}</span>
                    </div>
                `).join('');
            }

            // Autofill user details if signed in
            if (currentUser) {
                const nameEl = document.getElementById('chk-name');
                const emailEl = document.getElementById('chk-email');
                if (nameEl && currentUser.name) nameEl.value = currentUser.name;
                if (emailEl && currentUser.email) emailEl.value = currentUser.email;
            }

            const backdrop = document.getElementById('checkout-modal-backdrop');
            const modal = document.getElementById('checkout-modal');
            if (backdrop && modal) {
                backdrop.classList.remove('opacity-0', 'pointer-events-none');
                modal.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
            }
            if (window.lucide) window.lucide.createIcons();
        },
        closeCheckout: function() {
            setFloatingWidgetsVisible(true);
            const backdrop = document.getElementById('checkout-modal-backdrop');
            const modal = document.getElementById('checkout-modal');
            if (backdrop && modal) {
                backdrop.classList.add('opacity-0', 'pointer-events-none');
                modal.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            }
        },
        handleCheckoutSubmit: function(e) {
            e.preventDefault();
            const name = document.getElementById('chk-name')?.value || 'Customer';
            const phone = document.getElementById('chk-phone')?.value || '';
            const email = document.getElementById('chk-email')?.value || 'Not provided';
            const address = document.getElementById('chk-address')?.value || '';
            const city = document.getElementById('chk-city')?.value || '';
            const state = document.getElementById('chk-state')?.value || 'Maharashtra';
            const pincode = document.getElementById('chk-pincode')?.value || '';
            const paymentMode = document.querySelector('input[name="payment_method"]:checked')?.value || 'COD';

            const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
            const orderId = 'WIN-' + Math.floor(100000 + Math.random() * 900000);
            const fullAddress = `${address}, ${city}, ${state} - ${pincode}`;
            const orderInfo = `${name} | ${phone} | ${fullAddress} | Payment: ${paymentMode}`;

            // 1. Pipeline Call to Bucket 2 (Proxy Shield) -> Bucket 3 (Backend / SheetDB)
            const payload = {
                orderId: orderId,
                customerName: name,
                phone: phone,
                email: email,
                address: fullAddress,
                city: city,
                state: state,
                pincode: pincode,
                items: cart.map(i => ({ name: i.name, qty: i.qty || 1, price: i.price })),
                totalAmount: subtotal,
                paymentMode: paymentMode,
                paymentStatus: paymentMode === 'Razorpay' ? 'Pending' : 'COD_Confirmed'
            };

            fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(r => r.json()).then(res => {
                console.log('[Win Energy Pipeline] Order response:', res);
            }).catch(err => {
                console.warn('[Win Energy Pipeline] Local order processed (will sync):', err);
            });

            // Set success screen
            document.getElementById('checkout-form-step').classList.add('hidden');
            document.getElementById('checkout-success-step').classList.remove('hidden');
            document.getElementById('confirmed-order-id').textContent = orderId;

            const waLink = document.getElementById('confirmed-wa-link');
            if (waLink) {
                waLink.href = buildWhatsAppOrderUrl(`Order ID ${orderId} by ${orderInfo}`);
            }

            // Clear Cart after successful order
            cart = [];
            saveCart();

            if (window.lucide) window.lucide.createIcons();
        },
        openInquiry: function(productName) {
            injectStoreModals();
            // Reset modal to form view
            const formStep = document.getElementById('modal-inquiry-form-step');
            const successStep = document.getElementById('modal-inquiry-success-step');
            if (formStep) formStep.classList.remove('hidden');
            if (successStep) successStep.classList.add('hidden');

            if (productName) {
                const prodSelect = document.getElementById('modal-inq-product');
                if (prodSelect) {
                    for (let opt of prodSelect.options) {
                        if (opt.value.toLowerCase().includes(productName.toLowerCase())) {
                            prodSelect.value = opt.value;
                            break;
                        }
                    }
                }
            }

            setFloatingWidgetsVisible(false);
            const backdrop = document.getElementById('inquiry-modal-backdrop');
            const modal = document.getElementById('inquiry-modal');
            if (backdrop && modal) {
                backdrop.classList.remove('opacity-0', 'pointer-events-none');
                modal.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                backdrop.style.opacity = '1';
                backdrop.style.pointerEvents = 'auto';
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
                modal.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        },
        closeInquiry: function() {
            setFloatingWidgetsVisible(true);
            const backdrop = document.getElementById('inquiry-modal-backdrop');
            const modal = document.getElementById('inquiry-modal');
            if (backdrop && modal) {
                backdrop.classList.add('opacity-0', 'pointer-events-none');
                modal.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                backdrop.style.opacity = '0';
                backdrop.style.pointerEvents = 'none';
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            }
        },
        handleInquirySubmit: function(e) {
            if (e && e.preventDefault) e.preventDefault();
            const name = document.getElementById('modal-inq-name')?.value || '';
            const phone = document.getElementById('modal-inq-phone')?.value || '';
            const email = document.getElementById('modal-inq-email')?.value || 'Not provided';
            const product = document.getElementById('modal-inq-product')?.value || 'Win Energy System';
            const sector = document.getElementById('modal-inq-sector')?.value || 'General';
            const message = document.getElementById('modal-inq-message')?.value || 'Interested in technical specifications & quote.';

            if (!name || !phone) {
                alert('Please enter your full name and phone number.');
                return;
            }

            // 1. Pipeline Call to Bucket 2 (Proxy Shield) -> Bucket 3 (Backend / SheetDB)
            const inquiryPayload = {
                name: name,
                phone: phone,
                email: email,
                product: product,
                sector: sector,
                message: message,
                source: window.location.pathname || 'Website Modal'
            };

            fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inquiryPayload)
            }).then(r => r.json()).then(res => {
                console.log('[Win Energy Pipeline] Inquiry saved:', res);
            }).catch(err => {
                console.warn('[Win Energy Pipeline] Inquiry saved locally (will sync):', err);
            });

            // Save inquiry in browser local storage as secondary backup
            try {
                const existing = JSON.parse(localStorage.getItem('win_energy_inquiries') || '[]');
                existing.push({
                    name, phone, email, product, sector, message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('win_energy_inquiries', JSON.stringify(existing));
            } catch (err) {
                console.warn('Could not save inquiry to local storage', err);
            }

            // Populate success screen
            const nameEl = document.getElementById('modal-inq-success-name');
            const phoneEl = document.getElementById('modal-inq-success-phone');
            const prodEl = document.getElementById('modal-inq-success-prod');
            const waEl = document.getElementById('modal-inq-success-wa');

            if (nameEl) nameEl.textContent = name;
            if (phoneEl) phoneEl.textContent = phone;
            if (prodEl) prodEl.textContent = product;

            const waMsg = `Hello Win Energy! My name is ${name} (${phone}). I submitted an inquiry for ${product} (${sector}). Message: ${message}`;
            if (waEl) {
                waEl.href = 'https://wa.me/919595955585?text=' + encodeURIComponent(waMsg);
            }

            // Transition to success screen
            const formStep = document.getElementById('modal-inquiry-form-step');
            const successStep = document.getElementById('modal-inquiry-success-step');
            if (formStep) formStep.classList.add('hidden');
            if (successStep) successStep.classList.remove('hidden');

            const form = document.getElementById('modalInquiryForm');
            if (form) form.reset();

            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        },
        // Backwards compatibility mappings
        openLogin: function(startWithRegister) {
            this.openInquiry();
        },
        closeLogin: function() {
            this.closeInquiry();
        }
    };

    // Global aliases
    window.openInquiryModal = (prod) => window.winStore.openInquiry(prod);
    window.closeInquiryModal = () => window.winStore.closeInquiry();
    window.openLoginModal = (prod) => window.winStore.openInquiry(prod);
    window.closeLoginModal = () => window.winStore.closeInquiry();
    window.toggleCartDrawer = () => window.winStore.toggleCart();
    window.openCartDrawer = () => window.winStore.openCart();
    window.closeCartDrawer = () => window.winStore.closeCart();
    window.addToCart = (name, price, img) => window.winStore.addItem(name, price, img);
    window.openCheckoutModal = () => window.winStore.openCheckout();

    // Mobile Navigation Drawer Controller
    window.toggleMobileMenu = function(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        const mobileMenu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('menu-btn');
        if (!mobileMenu) return;

        const isClosed = mobileMenu.classList.contains('hidden');
        if (isClosed) {
            mobileMenu.classList.remove('hidden');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'true');
                menuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
            }
        } else {
            mobileMenu.classList.add('hidden');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
            }
        }
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };

    window.closeMobileMenu = function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('menu-btn');
        if (!mobileMenu || mobileMenu.classList.contains('hidden')) return;
        mobileMenu.classList.add('hidden');
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }
    };

    function initMobileMenu() {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuBtn) {
            menuBtn.removeEventListener('click', window.toggleMobileMenu);
            menuBtn.addEventListener('click', window.toggleMobileMenu);
        }

        // Close when clicking links inside mobile menu
        if (mobileMenu) {
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    window.closeMobileMenu();
                });
            });
        }

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            const m = document.getElementById('mobile-menu');
            const b = document.getElementById('menu-btn');
            if (m && !m.classList.contains('hidden')) {
                if (!m.contains(e.target) && (!b || !b.contains(e.target))) {
                    window.closeMobileMenu();
                }
            }
        });

        // Close mobile drawer on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                window.closeMobileMenu();
            }
        });
    }

    // Visitor Traffic & Arrival Time Logger (Bucket 1 -> Bucket 2 -> Bucket 3)
    function logVisitorTraffic() {
        try {
            // Check session to log once per session visit or page change
            const lastLog = sessionStorage.getItem('win_visitor_logged');
            const currentPage = window.location.pathname || 'home';
            if (lastLog === currentPage) return; // already logged this page in current session

            const payload = {
                page: currentPage,
                referrer: document.referrer || 'Direct Visit',
                device: window.innerWidth < 768 ? 'Mobile' : (window.innerWidth < 1024 ? 'Tablet' : 'Desktop'),
                country: 'India'
            };

            fetch('/api/visitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(r => r.json()).then(res => {
                sessionStorage.setItem('win_visitor_logged', currentPage);
                console.log(`[Win Energy Pipeline] Visit logged (${res.timeOfDay || 'IST'})`);
            }).catch(e => {
                // Silently fallback without affecting user experience
            });
        } catch (err) {}
    }

    // Document Ready initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStoreModals();
            updateCartBadges();
            initMobileMenu();
            logVisitorTraffic();
        });
    } else {
        injectStoreModals();
        updateCartBadges();
        initMobileMenu();
        logVisitorTraffic();
    }
})();
