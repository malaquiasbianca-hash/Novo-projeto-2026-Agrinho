document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialização dos módulos principais
    initAccordion();
    initAccessibility();
    initFormHandling();
});

/**
 * MÓDULO 1: GERENCIAMENTO DE ACCORDION (CAIXAS RETRÁTEIS)
 */
function initAccordion() {
    const triggers = document.querySelectorAll('.accordion-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const panelId = trigger.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            const icon = trigger.querySelector('.accordion-icon');
            
            // Inverte estado do gatilho atual
            trigger.setAttribute('aria-expanded', !isExpanded);
            panel.hidden = isExpanded;
            
            // Atualiza componente visual do ícone
            icon.textContent = isExpanded ? '+' : '−';
        });
    });
}

/**
 * MÓDULO 2: SISTEMA AVANÇADO DE ACESSIBILIDADE (WCAG CONFORME)
 */
function initAccessibility() {
    let currentScale = 1.0;
    const maxScale = 1.4;
    const minScale = 0.8;
    const step = 0.1;
    let speechInstance = null;

    // Elementos de captura
    const btnIncrease = document.getElementById('btn-increase-font');
    const btnDecrease = document.getElementById('btn-decrease-font');
    const btnContrast = document.getElementById('btn-toggle-contrast');
    const btnSpeak = document.getElementById('btn-speak');
    const btnStopSpeak = document.getElementById('btn-stop-speak');

    // Controle de Zoom do Texto Principal
    btnIncrease.addEventListener('click', () => {
        if (currentScale < maxScale) {
            currentScale += step;
            document.documentElement.style.setProperty('--font-scale', currentScale);
        }
    });

    btnDecrease.addEventListener('click', () => {
        if (currentScale > minScale) {
            currentScale -= step;
            document.documentElement.style.setProperty('--font-scale', currentScale);
        }
    });

    // Alternador de Modo de Alto Contraste
    btnContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isDark = document.body.classList.contains('high-contrast');
        btnContrast.setAttribute('aria-pressed', isDark);
    });

    // Síntese de Voz Nativa (Text-to-Speech API)
    btnSpeak.addEventListener('click', () => {
        // Cancela qualquer leitura em andamento prévia
        window.speechSynthesis.cancel();

        // Mapeia sistematicamente apenas tags de texto p e h2 contidas no main content
        const mainContent = document.getElementById('main-content');
        const textElements = mainContent.querySelectorAll('p, h2');
        let consolidatedText = '';

        textElements.forEach(el => {
            // Ignora o subtítulo do accordion e elementos internos ocultos
            if(!el.closest('.accordion-panel[hidden]') && !el.classList.contains('section-subtitle')) {
                consolidatedText += el.textContent + ' . ';
            }
        });

        if (consolidatedText.trim() !== '') {
            speechInstance = new SpeechSynthesisUtterance(consolidatedText);
            speechInstance.lang = 'pt-BR';
            speechInstance.rate = 1.0; // Velocidade natural

            speechInstance.addEventListener('start', () => {
                btnSpeak.classList.add('active-speaking');
            });

            speechInstance.addEventListener('end', () => {
                btnSpeak.classList.remove('active-speaking');
            });

            window.speechSynthesis.speak(speechInstance);
        }
    });

    // Interrupção imediata da voz
    btnStopSpeak.addEventListener('click', () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            btnSpeak.classList.remove('active-speaking');
        }
    });
}

/**
 * MÓDULO 3: COMPONENTES INTERATIVOS E CAPTURA DE DADOS
 */
function initFormHandling() {
    const seminarioForm = document.getElementById('seminario-form');
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');

    // Envio do formulário de seminário
    seminarioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('txt-nome').value;
        const email = document.getElementById('txt-email').value;

        // Feedback profissional sem alert inline poluente
        alert(`Obrigado pelo interesse, ${nome}! Enviamos as credenciais de acesso ao seminário para o e-mail: ${email}.`);
        seminarioForm.reset();
    });

    // Postagem dinâmica na área de comentários
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const commentText = document.getElementById('txt-comment').value;
        
        // Remove mensagem padrão caso seja o primeiro comentário
        const noCommentsMsg = commentsContainer.querySelector('.no-comments');
        if (noCommentsMsg) {
            noCommentsMsg.remove();
        }

        // Criando o elemento do comentário via DOM Nativo com segurança anti-XSS
        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');
        
        const textElement = document.createElement('p');
        textElement.textContent = commentText;
        
        const dateElement = document.createElement('span');
        const now = new Date();
        dateElement.textContent = `Enviado em: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;

        commentCard.appendChild(textElement);
        commentCard.appendChild(dateElement);
        
        // Insere sempre no topo da pilha de comentários
        commentsContainer.insertBefore(commentCard, commentsContainer.firstChild);
        
        commentForm.reset();
    });
}