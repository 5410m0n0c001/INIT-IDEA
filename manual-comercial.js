// INIT IDEA - Manual Comercial y Operativo JS
// Lógica interactiva con sincronización de idioma bilingüe

document.addEventListener('DOMContentLoaded', () => {
    initLangToggle();
    initNavigation();
    initMobileMenu();
    initFormatCards();
    initPricingCalculator();
    initFaqAccordion();
    initLeadForm();
});

/* 1. Sincronización de Idioma con LocalStorage */
function initLangToggle() {
    const btn = document.getElementById('langToggle');
    const body = document.body;
    if (!btn) return;

    // Leer idioma guardado
    const saved = localStorage.getItem('init-idea-lang');
    if (saved === 'en') {
        body.classList.replace('lang-es', 'lang-en');
    } else {
        body.classList.replace('lang-en', 'lang-es');
    }

    btn.addEventListener('click', () => {
        const isEs = body.classList.contains('lang-es');
        body.classList.replace(
            isEs ? 'lang-es' : 'lang-en',
            isEs ? 'lang-en' : 'lang-es'
        );
        localStorage.setItem('init-idea-lang', isEs ? 'en' : 'es');
        
        // Recalcular cotización en caso de cambio de idioma (por los textos dinámicos de los bullets)
        if (typeof window.recalculatePricing === 'function') {
            window.recalculatePricing();
        }
    });
}

/* 2. Navegación y Control de Secciones */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');

    // Función reutilizable para cambiar de sección
    function switchSection(targetId) {
        // Encontrar si la sección existe
        const targetSec = document.getElementById(targetId);
        if (!targetSec) return;

        // Actualizar clase activa en los links del sidebar
        navLinks.forEach(l => {
            const href = l.getAttribute('href');
            if (href && href.substring(1) === targetId) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });

        // Mostrar sección correspondiente y ocultar las demás
        sections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.add('active-sec');
                sec.style.display = 'block';
                setTimeout(() => {
                    sec.style.opacity = '1';
                    sec.style.transform = 'translateY(0)';
                }, 50);
            } else {
                sec.classList.remove('active-sec');
                sec.style.display = 'none';
                sec.style.opacity = '0';
                sec.style.transform = 'translateY(15px)';
            }
        });

        // Cerrar menú móvil al navegar
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }

        // Scroll suave hacia arriba en el main
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Escuchar clicks en cualquier link de la página que sea un anchor interno
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            // Verificar si el targetId es una sección de main
            const isSection = Array.from(sections).some(sec => sec.id === targetId);
            if (isSection) {
                e.preventDefault();
                switchSection(targetId);
                // Si la URL tiene un hash, actualizamos el hash del historial sin recargar
                history.pushState(null, null, href);
            }
        }
    });

    // Manejar navegación cuando se carga la página con un hash (ej: #diagnostico)
    const initialHash = window.location.hash;
    if (initialHash) {
        const targetId = initialHash.substring(1);
        const isSection = Array.from(sections).some(sec => sec.id === targetId);
        if (isSection) {
            // Un pequeño retraso para asegurar que la página se inicializó
            setTimeout(() => {
                switchSection(targetId);
            }, 100);
        }
    }
}

/* 3. Menú Móvil Lateral */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Cerrar sidebar si se hace clic fuera en móvil
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
}

/* 4. Biblioteca de Formatos de Contenido (Búsqueda & Acordeones) */
function initFormatCards() {
    const cards = document.querySelectorAll('.format-card');
    const searchInputEs = document.getElementById('format-search');
    const searchInputEn = document.getElementById('format-search-en');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('open-format');
        });
    });

    function filterFormats(query) {
        const queryClean = query.toLowerCase().trim();
        cards.forEach(card => {
            const title = card.getAttribute('data-title');
            if (title.includes(queryClean)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInputEs) {
        searchInputEs.addEventListener('input', (e) => filterFormats(e.target.value));
    }
    if (searchInputEn) {
        searchInputEn.addEventListener('input', (e) => filterFormats(e.target.value));
    }
}

/* 5. Cotizador Interactivo */
function initPricingCalculator() {
    const planRadios = document.querySelectorAll('input[name="base-plan"]');
    const monthlyChecks = document.querySelectorAll('.addon-calc');
    const onceChecks = document.querySelectorAll('.addon-calc-once');
    
    const resMonthly = document.getElementById('res-monthly');
    const resOnce = document.getElementById('res-once');
    const resTotal = document.getElementById('res-total');
    const bulletsList = document.getElementById('res-bullets-list');

    // Mapeo de entregables según plan seleccionado (Bilingüe)
    const planDeliverables = {
        '0': {
            es: [
                'Ningún plan de contenidos base seleccionado.',
                'Solo se sumarán los servicios de configuración, desarrollo web o ads adicionales.'
            ],
            en: [
                'No base content plan selected.',
                'Only additional configuration, web dev or ads management will be added.'
            ]
        },
        '3500': {
            es: [
                'Facebook + Instagram integrados',
                '8 publicaciones mensuales',
                '4 Reels / Videos cortos mensuales',
                '12 Historias en total al mes',
                'Diseño gráfico y copies profesionales',
                'Monitoreo básico de comentarios'
            ],
            en: [
                'Facebook + Instagram integrated',
                '8 monthly posts',
                '4 Reels / short videos monthly',
                '12 stories in total',
                'Professional graphic design & copy',
                'Basic comments monitoring'
            ]
        },
        '8000': {
            es: [
                'FB + IG + TikTok + YouTube Shorts',
                '12 publicaciones mensuales de alto impacto',
                '8 Reels / TikToks mensuales',
                '20 Historias mensuales',
                '2 Carruseles educativos',
                'Community Management activo de lunes a viernes',
                'Reunión estratégica mensual de análisis de KPIs'
            ],
            en: [
                'FB + IG + TikTok + YouTube Shorts',
                '12 high-impact monthly posts',
                '8 Reels / TikToks monthly',
                '20 monthly stories',
                '2 educational carousels',
                'Active Community Management Mon-Fri',
                'Monthly strategic KPI analysis meeting'
            ]
        },
        '15000': {
            es: [
                'FB + IG + TikTok + YouTube Shorts + LinkedIn',
                '16 publicaciones al mes',
                '12 Reels de alta calidad estética',
                '30 Historias mensuales (1 diaria de lunes a sábado)',
                '4 Carruseles e infografías educativas',
                '1 Video largo para YouTube (sujeto a material del cliente)',
                'Estrategia completa y optimización constante de perfiles',
                'Reuniones quincenales/mensuales del departamento de marketing'
            ],
            en: [
                'FB + IG + TikTok + YouTube Shorts + LinkedIn',
                '16 monthly posts',
                '12 high-aesthetic reels',
                '30 monthly stories (1 daily Mon-Sat)',
                '4 educational carousels & infographics',
                '1 long video for YouTube (subject to material)',
                'Full strategy and constant profile optimization',
                'Biweekly/monthly marketing department meetings'
            ]
        }
    };

    function calculate() {
        let monthlyTotal = 0;
        let onceTotal = 0;
        let selectedPlanPrice = 0;
        const isEn = document.body.classList.contains('lang-en');

        // 1. Obtener precio de plan base
        planRadios.forEach(radio => {
            if (radio.checked) {
                selectedPlanPrice = parseInt(radio.value);
            }
        });
        monthlyTotal += selectedPlanPrice;

        // 2. Obtener add-ons mensuales (Ads)
        monthlyChecks.forEach(check => {
            if (check.checked) {
                monthlyTotal += parseInt(check.getAttribute('data-price'));
            }
        });

        // 3. Obtener add-ons de pago único
        onceChecks.forEach(check => {
            if (check.checked) {
                onceTotal += parseInt(check.getAttribute('data-price'));
            }
        });

        // 4. Calcular inversión total inicial
        const totalInitial = monthlyTotal + onceTotal;

        // 5. Renderizar resultados en pantalla
        resMonthly.textContent = `$${monthlyTotal.toLocaleString('es-MX')} MXN`;
        resOnce.textContent = `$${onceTotal.toLocaleString('es-MX')} MXN`;
        resTotal.textContent = `$${totalInitial.toLocaleString('es-MX')} MXN`;

        // 6. Actualizar bullets de entregables según idioma activo
        bulletsList.innerHTML = '';
        const langKey = isEn ? 'en' : 'es';
        const deliverables = planDeliverables[selectedPlanPrice.toString()][langKey] || [];
        deliverables.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            bulletsList.appendChild(li);
        });
    }

    // Registrar oyentes de eventos
    planRadios.forEach(r => r.addEventListener('change', calculate));
    monthlyChecks.forEach(c => c.addEventListener('change', calculate));
    onceChecks.forEach(c => c.addEventListener('change', calculate));

    // Exponer función de recálculo globalmente
    window.recalculatePricing = calculate;

    // Ejecución inicial
    calculate();
}

/* 6. Acordeón de Preguntas Frecuentes (FAQ) */
function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        trigger.addEventListener('click', () => {
            items.forEach(other => {
                if (other !== item && other.classList.contains('open')) {
                    other.classList.remove('open');
                }
            });
            item.classList.toggle('open');
        });
    });
}

/* 7. Lógica del Quiz / Diagnóstico de Salud Digital (Bilingüe) */
let currentQuizStep = 1;
const answers = {
    q1: [],
    q2: '',
    q3: ''
};

function nextStep(stepNum) {
    const currentStepDiv = document.getElementById(`step-${currentQuizStep}`);
    const nextStepDiv = document.getElementById(`step-${stepNum}`);

    if (currentStepDiv && nextStepDiv) {
        currentStepDiv.classList.remove('active');
        nextStepDiv.classList.add('active');
        currentQuizStep = stepNum;
    }
}

function prevStep(stepNum) {
    const currentStepDiv = document.getElementById(`step-${currentQuizStep}`);
    const prevStepDiv = document.getElementById(`step-${stepNum}`);

    if (currentStepDiv && prevStepDiv) {
        currentStepDiv.classList.remove('active');
        prevStepDiv.classList.add('active');
        currentQuizStep = stepNum;
    }
}

function calculateDiagnosis() {
    // Recolectar datos
    const q1Inputs = document.querySelectorAll('input[name="q1"]:checked');
    answers.q1 = Array.from(q1Inputs).map(i => i.value);

    const q2Input = document.querySelector('input[name="q2"]:checked');
    answers.q2 = q2Input ? q2Input.value : 'low';

    const q3Input = document.querySelector('input[name="q3"]:checked');
    answers.q3 = q3Input ? q3Input.value : 'none';

    // Algoritmo de puntuación
    let score = 0;
    score += answers.q1.length * 15; // q1: Activos (hasta 60%)

    if (answers.q2 === 'med') score += 15; // q2: Contenido (hasta 25%)
    if (answers.q2 === 'high') score += 25;

    if (answers.q3 === 'self') score += 10; // q3: Pauta (hasta 15%)
    if (answers.q3 === 'agency') score += 15;

    score = Math.min(score, 100);

    // Renderizar círculo y número
    const scoreNum = document.getElementById('score-num');
    scoreNum.textContent = `${score}%`;

    // Renderizar feedback personalizado bilingüe
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackDesc = document.getElementById('feedback-desc');
    const suggestedPlanVal = document.getElementById('suggested-plan-val');
    const isEn = document.body.classList.contains('lang-en');

    if (score < 35) {
        feedbackTitle.textContent = isEn ? "⚠️ Critical Digital Status" : "⚠️ Estado Crítico Digital";
        feedbackDesc.textContent = isEn 
            ? "Your ecosystem lacks essential tech assets (pixels, GA4) and your content volume is low. You are losing visibility and not measuring results."
            : "Tu ecosistema carece de activos técnicos esenciales (píxeles, GA4) y la producción es baja. Estás perdiendo visibilidad frente a competidores en Morelos y no estás midiendo los resultados.";
        suggestedPlanVal.textContent = isEn 
            ? "Starter + Premium Onboarding (Mandatory Launch)" 
            : "Starter + Premium Onboarding (Lanzamiento Obligatorio)";
        suggestedPlanVal.className = "badge bg-neon-red";
    } else if (score >= 35 && score <= 75) {
        feedbackTitle.textContent = isEn ? "⚡ Intermediate Status" : "⚡ Estado Intermedio";
        feedbackDesc.textContent = isEn
            ? "You have an active digital presence, but have major leaks in automated ads tracking. You prioritize organic content but need to drive qualified leads."
            : "Cuentas con presencia digital activa, pero tienes fugas importantes en la automatización o medición de campañas publicitarias. Priorizas el contenido orgánico pero requieres traccionar clientes calificados.";
        suggestedPlanVal.textContent = isEn 
            ? "Growth + Meta Ads Management" 
            : "Growth + Gestión de Meta Ads";
        suggestedPlanVal.className = "badge bg-neon-amber";
    } else {
        feedbackTitle.textContent = isEn ? "🚀 Excellent Digital Health" : "🚀 Excelente Estado Digital";
        feedbackDesc.textContent = isEn
            ? "Congratulations! Your ecosystem is well structured with active conversion tracking. The recommendation is to scale lead capture through advanced funnel setups."
            : "Felicidades. Cuentas con un ecosistema bien estructurado y medición activa. La recomendación es escalar la captación de leads mediante embudos mixtos más avanzados y multicanal.";
        suggestedPlanVal.textContent = isEn 
            ? "Scale (Complete External Marketing Dept.)" 
            : "Scale (Departamento de Marketing Externo Completo)";
        suggestedPlanVal.className = "badge bg-neon-green";
    }

    // Ir a la sección de resultados
    const step3Div = document.getElementById('step-3');
    const resultsDiv = document.getElementById('step-results');
    step3Div.classList.remove('active');
    resultsDiv.classList.add('active');
    currentQuizStep = 4;
}

function restartQuiz() {
    const checkboxes = document.querySelectorAll('input[name="q1"]');
    checkboxes.forEach(c => c.checked = false);

    document.querySelector('input[name="q2"][value="low"]').checked = true;
    document.querySelector('input[name="q3"][value="none"]').checked = true;

    const resultsDiv = document.getElementById('step-results');
    const step1Div = document.getElementById('step-1');
    resultsDiv.classList.remove('active');
    step1Div.classList.add('active');
    currentQuizStep = 1;
}

/* 8. Registro de prospectos */
function initLeadForm() {
    const form = document.getElementById('lead-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('lead-name').value;
            const phone = document.getElementById('lead-phone').value;
            const email = document.getElementById('lead-email').value;
            const isEn = document.body.classList.contains('lang-en');
            
            if (isEn) {
                form.innerHTML = `
                    <div style="text-align: center; padding: 20px; background-color: rgba(16, 185, 129, 0.05); border: 1px solid var(--neon-green); border-radius: 8px; margin-top: 15px;">
                        <h4 style="color: var(--neon-green); margin-bottom: 8px;">✓ Diagnostic Sent</h4>
                        <p style="font-size: 12.5px; color: var(--text-secondary);">Thank you, ${name}. A consultant from INIT IDEA will contact you at ${phone} or via email at ${email} shortly.</p>
                    </div>
                `;
            } else {
                form.innerHTML = `
                    <div style="text-align: center; padding: 20px; background-color: rgba(16, 185, 129, 0.05); border: 1px solid var(--neon-green); border-radius: 8px; margin-top: 15px;">
                        <h4 style="color: var(--neon-green); margin-bottom: 8px;">✓ Diagnóstico Enviado</h4>
                        <p style="font-size: 12.5px; color: var(--text-secondary);">Gracias ${name}. Un consultor de INIT IDEA se pondrá en contacto contigo al número ${phone} o por correo a ${email} pronto.</p>
                    </div>
                `;
            }
        });
    }
}

// Exponer funciones necesarias al HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.calculateDiagnosis = calculateDiagnosis;
window.restartQuiz = restartQuiz;

window.openPdfModal = function() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closePdfModal = function() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};
