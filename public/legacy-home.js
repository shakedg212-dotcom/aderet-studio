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
    const testimonialsByLang = {
        he: [
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
        ],
        en: [
            {
                text: 'My Aderet tallit was the most unique item on my wedding day.<br>Everyone asked where it was from.',
                author: '— Yosef L., Groom, Tel Aviv'
            },
            {
                text: 'The custom design and finish quality were exceptional.<br>I got endless compliments at my son\'s Bar Mitzvah.',
                author: '— Michal A., Mother, Jerusalem'
            },
            {
                text: 'Precise service, personal care, and an emotional result.<br>The tallit and matching bag looked truly premium.',
                author: '— David R., Returning customer, Ashdod'
            },
            {
                text: 'I ordered a gift for a groom and received top-level quality.<br>Elegant packaging and very clean craftsmanship.',
                author: '— Sarah B., Customer, Bnei Brak'
            }
        ]
    };
    let testimonials = testimonialsByLang.he;

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

    // Language toggle (Hebrew default <-> English)
    const langToggle = document.getElementById('lang-toggle');
    const langFlag = document.getElementById('lang-flag');
    const langLabel = document.getElementById('lang-label');
    let currentLang = localStorage.getItem('siteLang') || 'he';

    const i18n = {
        he: {
            navHome: 'דף הבית',
            navCollection: 'קולקציה',
            navAbout: 'מי אנחנו',
            navContact: 'צור קשר',
            navCta: 'הזמן עכשיו',
            heroEyebrow: 'עיצוב טליתות בוטיק · ישראל',
            heroTagline: 'קדושה בסטייל',
            heroDesc: 'טליתות מעוצבות בהתאמה אישית, ברמת גימור שטרם הכרתם.',
            heroCtaCollection: 'לצפייה בקולקציה',
            heroCtaContact: 'לצור קשר',
            manifestoLabel: 'הפילוסופיה שלנו',
            manifestoTitle: 'קדושה וסטייל אינם שני עולמות נפרדים —<br>הם <em>משלימים זה את זה</em>.',
            manifestoDesc: 'כל טלית אדרת היא יצירת אמנות של ממש. מבדים מובחרים, דרך עטרות מעוצבות ועד לרקמה אישית — הידור שלא מוותר על דבר.',
            collectionLabel: 'הקולקציה שלנו',
            collectionTitle: 'בחרו את הטלית שלכם',
            collectionDesc: 'כל דגם זמין בהתאמה אישית מלאה — שם, פסוק, צבע וסגנון עטרה.',
            tickerItems: [
                'הידור מצווה ברמה אחרת',
                'הטלית שלך. הסיפור שלך.',
                'מתנה מושלמת לחתן ולבר המצווה',
                'קדושה שמרגישים, סטייל שלא שוכחים',
                'בדים מובחרים · רקמה ידנית · עיצוב בוטיק'
            ],
            productBadges: ['bestseller', 'חדש', 'מומלץ לחתן'],
            productNames: [
                'דגם "נחל נובע"',
                'דגם "אפור אורבני"',
                'דגם "מזמור לתודה"',
                'דגם "האישי שלי"',
                'דגם "חתן ספיר"',
                'דגם "חום מלכותי"'
            ],
            productSubs: [
                'עטרה שחורה דרמטית · עיטורי להבות',
                'מינימליסטי · נקי · חדשני',
                'רקמת זהב עדינה',
                'זמש יוקרתי · שם אישי',
                'טקסטיל לבן מהודר · עיטורי פס כחול',
                "ג'קוור נחושת · להבות"
            ],
            productOrderBtn: 'להזמנה',
            collectionFoot: 'כל הדגמים זמינים בהתאמה אישית מלאה · ניתן לרכוש עם תיק ו/או סידור תואמים',
            collectionFootBtn: 'לכל הקולקציה וסגנונות נוספים ←',
            aboutLabel: 'הסיפור שלנו',
            aboutTitle: 'מי אנחנו',
            aboutHeadline: 'אדרת היא לא עוד טלית.<br>זו אמירה.',
            aboutBody: [
                'אנו יוצרים טליתות פרימיום בהתאמה אישית,<br>לגברים שמבינים שעיצוב, חומר ודיוק — הם חלק מהקדושה.',
                'כל פריט נבנה בקפידה מחומרים מובחרים,<br>בעבודת יד שקטה, מדויקת, ללא פשרות.',
                'בלי רעש. בלי עומס.<br>רק נוכחות.',
                'אדרת היא הבחירה של מי שלא מתפשר —<br>לא על האמונה, ולא על הסטייל.'
            ],
            aboutFeatures: ['אישיות', 'הידור', 'מסורת'],
            aboutFeatureSubs: ['ביטוי אישי מדויק', 'איכות ללא פשרות', 'שורש. עומק. נוכחות.'],
            processLabel: 'פשוט ומוקפד',
            processTitle: 'הזמנה אישית',
            processStepNames: ['בחירת קונספט', 'התאמה אישית', 'ייצור בוטיק', 'משלוח עד הבית'],
            processStepDescs: [
                'בוחרים דגם, צבעים וסגנון עטרה מתוך הקולקציה',
                'בוחרים כיתוב – פסוק, שם או הקדשה בכתב האדרת המיוחד',
                'אנחנו רוקמים ותופרים את הטלית והתיק התואם בעבודת יד',
                'הטלית מגיעה באריזה מהודרת, מוכנה לרגעים הגדולים של החיים'
            ],
            contactLabel: 'בואו נדבר',
            contactTitle: 'יצירת קשר',
            contactDesc: 'רוצים להזמין טלית מותאמת אישית? שלחו לנו הודעה בוואטסאפ ונחזור אליכם תוך 24 שעות עם כל הפרטים.',
            contactPoints: ['מענה מהיר: עד 24 שעות', 'טלפון ישיר:'],
            contactWhatsApp: 'שלחו הודעה בוואטסאפ',
            contactFollow: 'עקבו אחרינו:',
            formTitle: 'שלחו פרטים ונחזור אליכם',
            formLabels: ['שם מלא', 'מספר טלפון', 'סוג האירוע', 'הערות / בקשות מיוחדות'],
            formPlaceholders: ['ישראל ישראלי', '050-0000000', 'ספרו לנו על החזון שלכם...'],
            formSelectDefault: 'בחרו...',
            formSelectOptions: ['חתונה', 'בר מצווה', 'מתנה', 'שימוש אישי'],
            formSubmit: 'שלחו פנייה',
            footerNav: ['דף הבית', 'קולקציה', 'מי אנחנו', 'צור קשר'],
            orderTitle: 'הזמנה מהירה',
            orderSubtitle: 'מלאו את הפרטים ונשמור הזמנה במערכת.',
            orderSummaryLabels: ['מוצר', 'מחיר מוצר', 'משלוח', 'סה"כ לתשלום'],
            orderFieldLabels: ['שם פרטי *', 'שם משפחה *', 'טלפון *', 'רחוב *', 'מספר בית *', 'עיר *', 'קומה', 'מיקוד', 'הוראות למסירה', 'הערות'],
            orderSubmit: 'שליחת הזמנה',
            langFlag: '🇮🇱',
            langLabel: 'עברית'
        },
        en: {
            navHome: 'Home',
            navCollection: 'Collection',
            navAbout: 'About Us',
            navContact: 'Contact',
            navCta: 'Order Now',
            heroEyebrow: 'Boutique Tallit Design · Israel',
            heroTagline: 'Holiness in Style',
            heroDesc: 'Custom-designed tallitot with an uncompromising luxury finish.',
            heroCtaCollection: 'View Collection',
            heroCtaContact: 'Contact Us',
            manifestoLabel: 'Our Philosophy',
            manifestoTitle: 'Holiness and style are not separate worlds —<br>they <em>complete each other</em>.',
            manifestoDesc: 'Every Aderet tallit is a true work of art. Premium fabrics, refined atarot, and personal embroidery with no compromises.',
            collectionLabel: 'Our Collection',
            collectionTitle: 'Choose Your Tallit',
            collectionDesc: 'Each model is fully customizable — name, verse, color, and atarah style.',
            tickerItems: [
                'Mitzvah beauty at another level',
                'Your tallit. Your story.',
                'A perfect gift for grooms and bar mitzvahs',
                'Holiness you feel, style you remember',
                'Premium fabrics · hand embroidery · boutique design'
            ],
            productBadges: ['BESTSELLER', 'NEW', 'Recommended for Groom'],
            productNames: [
                'Model "Nahal Novea"',
                'Model "Urban Gray"',
                'Model "Mizmor LeToda"',
                'Model "My Signature"',
                'Model "Hatan Sapir"',
                'Model "Royal Brown"'
            ],
            productSubs: [
                'Dramatic black atarah · flame motifs',
                'Minimal · clean · modern',
                'Fine gold embroidery',
                'Luxury suede · personal name',
                'Elegant white textile · blue trims',
                'Copper jacquard · flame motifs'
            ],
            productOrderBtn: 'Order',
            collectionFoot: 'All models are fully customizable · available with matching bag and/or siddur',
            collectionFootBtn: 'View full collection & more styles ←',
            aboutLabel: 'Our Story',
            aboutTitle: 'Who We Are',
            aboutHeadline: 'Aderet is not just another tallit.<br>It is a statement.',
            aboutBody: [
                'We create premium custom tallitot,<br>for men who understand that design, material, and precision are part of holiness.',
                'Each piece is crafted from selected materials,<br>with quiet, precise handwork and zero compromise.',
                'No noise. No excess.<br>Only presence.',
                'Aderet is for those who never compromise —<br>not on faith, and not on style.'
            ],
            aboutFeatures: ['Personality', 'Excellence', 'Tradition'],
            aboutFeatureSubs: ['Accurate personal expression', 'Uncompromising quality', 'Root. Depth. Presence.'],
            processLabel: 'Simple & Refined',
            processTitle: 'Personal Order',
            processStepNames: ['Choose Concept', 'Personalize', 'Boutique Craft', 'Home Delivery'],
            processStepDescs: [
                'Pick model, colors, and atarah style from our collection',
                'Choose your text – verse, name, or dedication in the Aderet signature script',
                'We embroider and tailor the tallit and matching bag by hand',
                'Delivered in elegant packaging, ready for life\'s meaningful moments'
            ],
            contactLabel: "Let's Talk",
            contactTitle: 'Contact',
            contactDesc: 'Want a custom tallit? Send us a WhatsApp message and we will respond within 24 hours with full details.',
            contactPoints: ['Fast response: up to 24 hours', 'Direct phone:'],
            contactWhatsApp: 'Send WhatsApp Message',
            contactFollow: 'Follow us:',
            formTitle: 'Leave your details and we will contact you',
            formLabels: ['Full name', 'Phone number', 'Event type', 'Notes / special requests'],
            formPlaceholders: ['Israel Israeli', '050-0000000', 'Tell us about your vision...'],
            formSelectDefault: 'Select...',
            formSelectOptions: ['Wedding', 'Bar Mitzvah', 'Gift', 'Personal use'],
            formSubmit: 'Send Request',
            footerNav: ['Home', 'Collection', 'About Us', 'Contact'],
            orderTitle: 'Quick Order',
            orderSubtitle: 'Fill in your details and we will save your order.',
            orderSummaryLabels: ['Product', 'Product Price', 'Shipping', 'Total'],
            orderFieldLabels: ['First Name *', 'Last Name *', 'Phone *', 'Street *', 'House Number *', 'City *', 'Floor', 'ZIP Code', 'Delivery Instructions', 'Notes'],
            orderSubmit: 'Submit Order',
            langFlag: '🇺🇸',
            langLabel: 'English'
        }
    };

    function setText(id, value, isHtml) {
        const el = document.getElementById(id);
        if (!el || value == null) return;
        if (isHtml) el.innerHTML = value;
        else el.textContent = value;
    }

    function updateLanguageToggle(lang) {
        // Button shows the NEXT language to switch to (clearer UX).
        if (!langFlag || !langLabel || !langToggle) return;
        const nextLang = lang === 'he' ? 'en' : 'he';
        if (nextLang === 'en') {
            langFlag.textContent = '🇺🇸';
            langLabel.textContent = 'English';
            langToggle.setAttribute('aria-label', 'Switch to English');
        } else {
            langFlag.textContent = '🇮🇱';
            langLabel.textContent = 'עברית';
            langToggle.setAttribute('aria-label', 'לעבור לעברית');
        }
    }

    function applyLanguage(lang) {
        const t = i18n[lang] || i18n.he;
        setText('nav-home', t.navHome);
        setText('nav-collection', t.navCollection);
        setText('nav-about', t.navAbout);
        setText('nav-contact', t.navContact);
        setText('mob-nav-home', t.navHome);
        setText('mob-nav-collection', t.navCollection);
        setText('mob-nav-about', t.navAbout);
        setText('mob-nav-contact', t.navContact);
        setText('nav-cta', t.navCta);
        setText('hero-eyebrow', t.heroEyebrow);
        setText('hero-tagline', t.heroTagline);
        setText('hero-desc', t.heroDesc);
        setText('hero-cta-collection', t.heroCtaCollection);
        setText('hero-cta-contact', t.heroCtaContact);
        setText('manifesto-label', t.manifestoLabel);
        setText('manifesto-title', t.manifestoTitle, true);
        setText('manifesto-desc', t.manifestoDesc);
        setText('collection-label', t.collectionLabel);
        setText('collection-title', t.collectionTitle);
        setText('collection-desc', t.collectionDesc);
        document.querySelectorAll('.ti').forEach((el, idx) => {
            el.textContent = t.tickerItems[idx % t.tickerItems.length];
        });
        document.querySelectorAll('.pcard-badge').forEach((el, idx) => {
            el.textContent = t.productBadges[idx] || el.textContent;
        });
        document.querySelectorAll('.pcard-name').forEach((el, idx) => {
            el.textContent = t.productNames[idx] || el.textContent;
        });
        document.querySelectorAll('.pcard-sub').forEach((el, idx) => {
            el.textContent = t.productSubs[idx] || el.textContent;
        });
        document.querySelectorAll('.pcard-order-btn').forEach((el) => {
            el.textContent = t.productOrderBtn;
        });
        const collectionFoot = document.querySelector('.collection-foot p');
        if (collectionFoot) collectionFoot.textContent = t.collectionFoot;
        const collectionFootBtn = document.querySelector('.collection-foot .btn-outline-dark');
        if (collectionFootBtn) collectionFootBtn.textContent = t.collectionFootBtn;

        const aboutLabel = document.querySelector('.about-premium__label');
        if (aboutLabel) aboutLabel.textContent = t.aboutLabel;
        const aboutTitle = document.querySelector('.about-premium__title');
        if (aboutTitle) aboutTitle.textContent = t.aboutTitle;
        const aboutHeadline = document.querySelector('.about-premium__headline');
        if (aboutHeadline) aboutHeadline.innerHTML = t.aboutHeadline;
        document.querySelectorAll('.about-premium__body p').forEach((el, idx) => {
            el.innerHTML = t.aboutBody[idx] || el.innerHTML;
        });
        document.querySelectorAll('.about-premium__feat-title').forEach((el, idx) => {
            el.textContent = t.aboutFeatures[idx] || el.textContent;
        });
        document.querySelectorAll('.about-premium__feat-sub').forEach((el, idx) => {
            el.textContent = t.aboutFeatureSubs[idx] || el.textContent;
        });

        const processLabel = document.querySelector('.process-top .label');
        if (processLabel) processLabel.textContent = t.processLabel;
        const processTitle = document.querySelector('.process-top h2');
        if (processTitle) processTitle.textContent = t.processTitle;
        document.querySelectorAll('.step-name').forEach((el, idx) => {
            el.textContent = t.processStepNames[idx] || el.textContent;
        });
        document.querySelectorAll('.step-desc').forEach((el, idx) => {
            el.textContent = t.processStepDescs[idx] || el.textContent;
        });

        const contactLabel = document.querySelector('.contact-info .label');
        if (contactLabel) contactLabel.textContent = t.contactLabel;
        const contactTitle = document.querySelector('.contact-info h2');
        if (contactTitle) contactTitle.textContent = t.contactTitle;
        const contactDesc = document.querySelector('.contact-info p');
        if (contactDesc) contactDesc.textContent = t.contactDesc;
        const contactPointList = document.querySelectorAll('.contact-point');
        if (contactPointList[0]) contactPointList[0].textContent = t.contactPoints[0];
        if (contactPointList[1]) {
            const anchor = contactPointList[1].querySelector('a');
            contactPointList[1].textContent = t.contactPoints[1] + ' ';
            if (anchor) contactPointList[1].appendChild(anchor);
        }
        const waBtn = document.querySelector('.btn-wa');
        if (waBtn) {
            const txtNode = waBtn.childNodes[waBtn.childNodes.length - 1];
            if (txtNode && txtNode.nodeType === Node.TEXT_NODE) txtNode.textContent = ' ' + t.contactWhatsApp;
        }
        const follow = document.querySelector('.social-lbl');
        if (follow) follow.textContent = t.contactFollow;

        const formTitle = document.querySelector('.contact-form h3');
        if (formTitle) formTitle.textContent = t.formTitle;
        document.querySelectorAll('.contact-form .field label').forEach((el, idx) => {
            el.textContent = t.formLabels[idx] || el.textContent;
        });
        const fullNameInput = document.getElementById('full-name');
        const phoneInput = document.getElementById('phone');
        const notesInput = document.getElementById('notes');
        if (fullNameInput) fullNameInput.placeholder = t.formPlaceholders[0];
        if (phoneInput) phoneInput.placeholder = t.formPlaceholders[1];
        if (notesInput) notesInput.placeholder = t.formPlaceholders[2];
        const eventSelect = document.getElementById('event-type');
        if (eventSelect && eventSelect.options.length >= 5) {
            eventSelect.options[0].textContent = t.formSelectDefault;
            eventSelect.options[1].textContent = t.formSelectOptions[0];
            eventSelect.options[2].textContent = t.formSelectOptions[1];
            eventSelect.options[3].textContent = t.formSelectOptions[2];
            eventSelect.options[4].textContent = t.formSelectOptions[3];
        }
        const formSubmit = document.querySelector('.btn-send');
        if (formSubmit) formSubmit.textContent = t.formSubmit;
        document.querySelectorAll('.foot-nav a').forEach((el, idx) => {
            el.textContent = t.footerNav[idx] || el.textContent;
        });
        const orderTitle = document.getElementById('order-modal-title');
        if (orderTitle) orderTitle.textContent = t.orderTitle;
        const orderSub = document.querySelector('.order-modal__subtitle');
        if (orderSub) orderSub.textContent = t.orderSubtitle;
        document.querySelectorAll('.order-line span').forEach((el, idx) => {
            el.textContent = t.orderSummaryLabels[idx] || el.textContent;
        });
        document.querySelectorAll('.order-form .field label').forEach((el, idx) => {
            el.textContent = t.orderFieldLabels[idx] || el.textContent;
        });
        const orderSubmitBtnEl = document.querySelector('.order-submit-btn');
        if (orderSubmitBtnEl) orderSubmitBtnEl.textContent = t.orderSubmit;
        testimonials = testimonialsByLang[lang] || testimonialsByLang.he;
        if (testiControls) {
            testiControls.querySelectorAll('.testi-dot').forEach((dot, idx) => {
                dot.setAttribute('aria-label', (lang === 'en' ? 'Testimonial ' : 'המלצה ') + (idx + 1));
            });
        }
        if (testiText && testiAuth && testimonials[testiIndex]) {
            testiText.innerHTML = testimonials[testiIndex].text;
            testiAuth.textContent = testimonials[testiIndex].author;
        }
        updateLanguageToggle(lang);

        document.documentElement.lang = lang === 'en' ? 'en' : 'he';
        localStorage.setItem('siteLang', lang);
    }

    applyLanguage(currentLang);
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'he' ? 'en' : 'he';
            applyLanguage(currentLang);
        });
    }

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

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
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
