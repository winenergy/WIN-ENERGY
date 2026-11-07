/**
 * Win Energy - Interactive Product Gallery & E-Commerce Buy Box Engine
 * Powers multi-image gallery carousels and dynamic model selector pills.
 */

(function () {
    window.WinProductBuyBox = {
        init: function (config) {
            const galleryRoot = document.getElementById(config.galleryId);
            const buyBoxRoot = document.getElementById(config.buyBoxId);
            const models = config.models || [];
            const images = config.images || [];
            const activeThemeBorder = config.activeBorderClass || 'border-orange-500 ring-2 ring-orange-200';

            let currentImgIndex = 0;

            // Gallery Elements
            if (galleryRoot && images.length > 0) {
                const mainImg = galleryRoot.querySelector('[data-gallery-main]');
                const thumbs = galleryRoot.querySelectorAll('[data-gallery-thumb]');
                const counter = galleryRoot.querySelector('[data-gallery-counter]');
                const prevBtn = galleryRoot.querySelector('[data-gallery-prev]');
                const nextBtn = galleryRoot.querySelector('[data-gallery-next]');

                function showImage(index) {
                    if (index < 0) index = images.length - 1;
                    if (index >= images.length) index = 0;
                    currentImgIndex = index;

                    if (mainImg) {
                        mainImg.style.opacity = '0.3';
                        setTimeout(() => {
                            mainImg.src = images[currentImgIndex].src;
                            mainImg.alt = images[currentImgIndex].alt || 'Product Image';
                            mainImg.style.opacity = '1';
                        }, 120);
                    }

                    if (counter) {
                        counter.textContent = `${currentImgIndex + 1} / ${images.length}`;
                    }

                    thumbs.forEach((th, idx) => {
                        const borderClasses = activeThemeBorder.split(' ');
                        if (idx === currentImgIndex) {
                            borderClasses.forEach(c => th.classList.add(c));
                            th.classList.remove('border-transparent', 'border-slate-200');
                        } else {
                            borderClasses.forEach(c => th.classList.remove(c));
                            th.classList.add('border-slate-200');
                        }
                    });
                }

                thumbs.forEach((th, idx) => {
                    th.addEventListener('click', function () {
                        showImage(idx);
                    });
                });

                if (prevBtn) {
                    prevBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        showImage(currentImgIndex - 1);
                    });
                }

                if (nextBtn) {
                    nextBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        showImage(currentImgIndex + 1);
                    });
                }

                // Initial image setup
                showImage(0);
            }

            // Model Switcher Elements
            if (buyBoxRoot && models.length > 0) {
                const modelPills = buyBoxRoot.querySelectorAll('[data-model-id]');
                const priceEl = buyBoxRoot.querySelector('[data-product-price]');
                const mrpEl = buyBoxRoot.querySelector('[data-product-mrp]');
                const savingsEl = buyBoxRoot.querySelector('[data-product-savings]');
                const fitEl = buyBoxRoot.querySelector('[data-product-fit]');
                const cartBtn = buyBoxRoot.querySelector('[data-product-cart-btn]');
                const cartBtnText = buyBoxRoot.querySelector('[data-product-cart-text]');
                const waBtn = buyBoxRoot.querySelector('[data-product-wa-btn]');

                function selectModel(modelId) {
                    const model = models.find(m => m.id === modelId) || models[0];

                    // Update Model Pills Style
                    modelPills.forEach(pill => {
                        const isCurrent = pill.getAttribute('data-model-id') === model.id;
                        if (isCurrent) {
                            pill.setAttribute('data-active', 'true');
                            pill.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
                            if (config.pillActiveClass) {
                                config.pillActiveClass.split(' ').forEach(c => pill.classList.add(c));
                            }
                        } else {
                            pill.setAttribute('data-active', 'false');
                            if (config.pillActiveClass) {
                                config.pillActiveClass.split(' ').forEach(c => pill.classList.remove(c));
                            }
                            pill.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
                        }
                    });

                    // Update Price Display
                    if (priceEl) {
                        priceEl.textContent = model.priceFormatted;
                    }

                    // Update MRP & Savings
                    if (mrpEl) {
                        if (model.mrpFormatted) {
                            mrpEl.textContent = model.mrpFormatted;
                            mrpEl.style.display = 'inline';
                        } else {
                            mrpEl.style.display = 'none';
                        }
                    }

                    if (savingsEl) {
                        if (model.savingsText) {
                            savingsEl.textContent = model.savingsText;
                            savingsEl.style.display = 'inline-block';
                        } else {
                            savingsEl.style.display = 'none';
                        }
                    }

                    // Update Fit / Pipeline Details
                    if (fitEl) {
                        fitEl.textContent = model.fitText;
                    }

                    // Update Cart Button
                    if (cartBtn) {
                        if (model.isQuote) {
                            if (cartBtnText) cartBtnText.textContent = 'Request Custom Sizing Quote';
                            cartBtn.onclick = function () {
                                window.location.href = `contact.html?product=${encodeURIComponent(model.name)}`;
                            };
                        } else {
                            if (cartBtnText) cartBtnText.textContent = `Add to Cart — ${model.priceFormatted}`;
                            cartBtn.onclick = function () {
                                if (typeof addToCart === 'function') {
                                    addToCart(model.name, model.priceNumber, model.image || (images[0] ? images[0].src : ''));
                                } else if (window.winCart && typeof window.winCart.addItem === 'function') {
                                    window.winCart.addItem(model.id);
                                }
                            };
                        }
                    }

                    // Update WhatsApp Button
                    if (waBtn) {
                        const waText = encodeURIComponent(`Hello Win Energy, I am interested in ${model.name} (${model.priceFormatted}). Please share details.`);
                        waBtn.href = `https://wa.me/919595955585?text=${waText}`;
                    }

                    // Optional: Switch Gallery image if model has an associated image index
                    if (typeof model.imageIndex === 'number' && galleryRoot && images.length > 0) {
                        const thumbs = galleryRoot.querySelectorAll('[data-gallery-thumb]');
                        if (thumbs[model.imageIndex]) {
                            thumbs[model.imageIndex].click();
                        }
                    }
                }

                modelPills.forEach(pill => {
                    pill.addEventListener('click', function (e) {
                        e.preventDefault();
                        const modelId = pill.getAttribute('data-model-id');
                        selectModel(modelId);
                    });
                });

                // Expose selectModel on the global object for page interactions
                window.WinProductBuyBox.selectModel = selectModel;

                // Select initial model from URL query (?model=...) or hash (#...), or fallback to first
                let initialModelId = models[0].id;
                try {
                    const urlParams = new URLSearchParams(window.location.search);
                    const requestedModel = urlParams.get('model') || (window.location.hash ? window.location.hash.replace(/^#/, '') : null);
                    if (requestedModel && models.some(m => m.id === requestedModel)) {
                        initialModelId = requestedModel;
                    }
                } catch (err) {
                    console.warn('URL parsing for model failed:', err);
                }

                selectModel(initialModelId);
            }

            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }
    };
})();
