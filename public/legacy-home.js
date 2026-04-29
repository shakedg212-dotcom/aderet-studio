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
