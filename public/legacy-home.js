    // Header scroll
    const hdr = document.getElementById('header');
    const hamIco = document.getElementById('ham-ico');
    window.addEventListener('scroll', () => {
        const s = window.scrollY > 55;
        hdr.classList.toggle('scrolled', s);
        if (hamIco) hamIco.setAttribute('stroke', s ? '#1A1A1A' : 'white');
    });

    // Mobile nav
    function toggleMob() {
        document.getElementById('mob-nav').classList.toggle('open');
    }

    // Scroll reveal
    const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (!t) return;
            e.preventDefault();
            window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' });
        });
    });

    // Form
    async function handleSend(e) {
        e.preventDefault();
        const form = document.getElementById('lead-form');
        const ok = document.getElementById('form-ok');
        const err = document.getElementById('form-err');
        const btn = form.querySelector('.btn-send');

        if (!form.reportValidity()) return;

        err.style.display = 'none';
        ok.style.display = 'none';
        btn.disabled = true;
        btn.textContent = 'שולחים...';

        const payload = {
            full_name: document.getElementById('full-name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            event_type: document.getElementById('event-type').value.trim(),
            notes: document.getElementById('notes').value.trim() || 'ללא הערות נוספות'
        };

        try {
            const res = await fetch('https://formsubmit.co/ajax/Tamirgarame@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: 'פנייה חדשה מאתר אדרת',
                    _template: 'table',
                    _captcha: 'false',
                    ...payload
                })
            });

            if (!res.ok) throw new Error('Submit failed');

            ok.style.display = 'block';
            form.reset();
            setTimeout(() => { ok.style.display = 'none'; }, 4200);
        } catch (_) {
            err.style.display = 'block';
            // Fallback: regular form POST still sends the lead
            form.submit();
        } finally {
            btn.disabled = false;
            btn.textContent = 'שלחו פנייה';
        }
    }

    // Testimonial slider
    const testimonials = [
        {
            text: 'הטלית שלי מאדרת הייתה הפריט הכי מיוחד ביום החתונה שלי.<br>כולם שאלו מאיפה זה. הרגשתי מלך.',
            author: '— יוסף ל., חתן מרוצה, תל אביב'
        },
        {
            text: 'העיצוב האישי והגימור ברמה גבוהה ממש.<br>קיבלתי מחמאות בלי סוף בבר המצווה של הבן שלי.',
            author: '— מיכל א., אמא מרוצה, ירושלים'
        },
        {
            text: 'שירות מדויק, יחס אישי, ותוצאה מרגשת.<br>הטלית והתיק יצאו יוקרתיים בדיוק כמו שרציתי.',
            author: '— דוד ר., לקוח חוזר, אשדוד'
        },
        {
            text: 'הזמנתי מתנה לחתן וקיבלתי מוצר ברמה אחרת.<br>אריזה מהודרת ועבודה נקייה מאוד.',
            author: '— שרה ב., לקוחה, בני ברק'
        }
    ];

    const testiText = document.getElementById('testi-text');
    const testiAuth = document.getElementById('testi-auth');
    const testiControls = document.getElementById('testi-controls');
    let testiIndex = 0;
    let testiTimer;
    const testiDots = [];

    function setActiveDot() {
        testiDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === testiIndex);
        });
    }

    function renderTestimonial(nextIndex) {
        if (!testiText || !testiAuth || testimonials.length < 2) return;
        testiText.classList.add('testi-fade');
        testiAuth.classList.add('testi-fade');

        setTimeout(() => {
            testiIndex = (nextIndex + testimonials.length) % testimonials.length;
            testiText.innerHTML = testimonials[testiIndex].text;
            testiAuth.textContent = testimonials[testiIndex].author;
            testiText.classList.remove('testi-fade');
            testiAuth.classList.remove('testi-fade');
            setActiveDot();
        }, 380);
    }

    function startTestimonialAutoRotate() {
        clearInterval(testiTimer);
        testiTimer = setInterval(() => renderTestimonial(testiIndex + 1), 5200);
    }

    if (testiControls) {
        testimonials.forEach((item, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'testi-dot';
            dot.setAttribute('aria-label', 'המלצה ' + (idx + 1));
            dot.addEventListener('click', () => {
                renderTestimonial(idx);
                startTestimonialAutoRotate();
            });
            testiControls.appendChild(dot);
            testiDots.push(dot);
        });
    }

    setActiveDot();
    startTestimonialAutoRotate();

    // Order modal flow (no payment yet)
    const orderModal = document.getElementById('order-modal');
    const orderForm = document.getElementById('order-form');
    const orderOk = document.getElementById('order-ok');
    const orderErr = document.getElementById('order-err');
    const orderProductName = document.getElementById('order-product-name');
    const orderProductPrice = document.getElementById('order-product-price');
    const orderShipping = document.getElementById('order-shipping');
    const orderTotal = document.getElementById('order-total');
    const orderSubmitBtn = orderForm ? orderForm.querySelector('.order-submit-btn') : null;
    const orderCards = document.querySelectorAll('.pcard[data-product-name]');
    const cityInput = document.getElementById('order-city');
    const cityOptions = document.getElementById('order-city-options');

    let selectedProduct = null;
    let productsIndexByName = {};
    const cityList = [
        'אבו גוש', 'אופקים', 'אור יהודה', 'אור עקיבא', 'אילת', 'אשדוד', 'אשקלון',
        'באר שבע', 'בית שמש', 'ביתר עילית', 'בני ברק', 'בת ים',
        'גבעת שמואל', 'גבעתיים', 'דימונה', 'הרצליה', 'חדרה', 'חולון', 'חיפה',
        'טבריה', 'טירת כרמל', 'יבנה', 'יהוד', 'ירושלים', 'יקנעם', 'כפר סבא',
        'כרמיאל', 'לוד', 'מבשרת ציון', 'מודיעין', 'נהריה', 'נס ציונה', 'נצרת', 'נתיבות',
        'נתניה', 'עכו', 'עפולה', 'ערד', 'פתח תקווה', 'פרדס חנה', 'צפת', 'קריית אונו',
        'קריית אתא', 'קריית ביאליק', 'קריית גת', 'קריית ים', 'קריית מוצקין',
        'קריית שמונה', 'ראש העין', 'ראשון לציון', 'רהט', 'רחובות', 'רמלה',
        'רמת גן', 'רמת השרון', 'רעננה', 'שדרות', 'תל אביב'
    ];

    function normalizeName(name) {
        return String(name || '')
            .replace(/["']/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function money(ils) {
        return '₪' + Number(ils || 0).toLocaleString('he-IL');
    }

    function shippingByPrice(price) {
        return Number(price) < 500 ? 30 : 0;
    }

    async function fetchActiveProducts() {
        try {
            const res = await fetch('/api/products');
            const payload = await res.json();
            if (!res.ok || !payload.ok) return;
            productsIndexByName = {};
            (payload.products || []).forEach((p) => {
                productsIndexByName[normalizeName(p.name_he)] = p;
            });
        } catch (_) {
            // Keep graceful fallback when API is not available.
        }
    }

    function openOrderModal() {
        if (!orderModal) return;
        orderModal.classList.add('open');
        orderModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeOrderModal() {
        if (!orderModal) return;
        orderModal.classList.remove('open');
        orderModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function paintSummary() {
        if (!selectedProduct) return;
        const price = Number(selectedProduct.price_ils);
        const shipping = shippingByPrice(price);
        const total = price + shipping;
        orderProductName.textContent = selectedProduct.name_he;
        orderProductPrice.textContent = money(price);
        orderShipping.textContent = money(shipping);
        orderTotal.textContent = money(total);
    }

    function clearOrderMessages() {
        if (orderOk) orderOk.style.display = 'none';
        if (orderErr) {
            orderErr.style.display = 'none';
            orderErr.textContent = '';
        }
    }

    fetchActiveProducts();

    function refreshCityOptions(query) {
        if (!cityOptions) return;
        const cleanQuery = String(query || '').trim();
        const matches = cityList
            .filter((city) => !cleanQuery || city.startsWith(cleanQuery))
            .slice(0, 10);
        cityOptions.innerHTML = matches.map((city) => `<option value="${city}"></option>`).join('');
    }

    if (cityInput) {
        refreshCityOptions('');
        cityInput.addEventListener('input', (e) => refreshCityOptions(e.target.value));
        cityInput.addEventListener('focus', () => refreshCityOptions(cityInput.value));
    }

    orderCards.forEach((card) => {
        const btn = card.querySelector('.pcard-order-btn');
        const cardName = card.getAttribute('data-product-name') || '';
        if (!btn) return;

        btn.addEventListener('click', () => {
            clearOrderMessages();
            const product = productsIndexByName[normalizeName(cardName)];

            if (!product) {
                if (orderErr) {
                    orderErr.textContent =
                        'המוצר הזה עדיין לא מוגדר בדאטהבייס. אפשר לבחור כרגע מוצר שמופיע בעמוד /products.';
                    orderErr.style.display = 'block';
                }
                openOrderModal();
                return;
            }

            selectedProduct = product;
            paintSummary();
            openOrderModal();
        });
    });

    if (orderModal) {
        orderModal.querySelectorAll('[data-close-order-modal]').forEach((el) => {
            el.addEventListener('click', closeOrderModal);
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearOrderMessages();

            if (!selectedProduct) {
                if (orderErr) {
                    orderErr.textContent = 'יש לבחור מוצר קיים לפני שליחת הזמנה.';
                    orderErr.style.display = 'block';
                }
                return;
            }

            if (!orderForm.reportValidity()) return;
            if (orderSubmitBtn) {
                orderSubmitBtn.disabled = true;
                orderSubmitBtn.textContent = 'שולחים...';
            }

            try {
                const payload = {
                    productId: selectedProduct.id,
                    firstName: document.getElementById('order-first-name').value.trim(),
                    lastName: document.getElementById('order-last-name').value.trim(),
                    phone: document.getElementById('order-phone').value.trim(),
                    street: document.getElementById('order-street').value.trim(),
                    houseNumber: document.getElementById('order-house-number').value.trim(),
                    floor: document.getElementById('order-floor').value.trim(),
                    city: document.getElementById('order-city').value.trim(),
                    zipCode: document.getElementById('order-zip-code').value.trim(),
                    deliveryInstructions: document.getElementById('order-delivery-instructions').value.trim(),
                    notes: document.getElementById('order-notes').value.trim()
                };

                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const body = await res.json();
                if (!res.ok || !body.ok) throw new Error(body.error || 'Order failed');

                if (orderOk) orderOk.style.display = 'block';
                orderForm.reset();
                setTimeout(closeOrderModal, 1200);
            } catch (err) {
                if (orderErr) {
                    orderErr.textContent = 'לא הצלחנו לשמור את ההזמנה: ' + err.message;
                    orderErr.style.display = 'block';
                }
            } finally {
                if (orderSubmitBtn) {
                    orderSubmitBtn.disabled = false;
                    orderSubmitBtn.textContent = 'שליחת הזמנה';
                }
            }
        });
    }
