/* --- SETUP DOM ELEMENTS --- */
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

/* --- EVENTS ONSCROLL / CLICKS --- */
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

window.addEventListener('scroll', () => {
    let top = window.scrollY;

    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    header.classList.toggle('sticky', top > 100);

    // Remove active da navbar ao realizar o scroll
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
});


ScrollReveal({
    reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200

});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });


const typed = new Typed('.multiple-text', {
    strings: ['Front-end', 'Back-end'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 100,
    loop: true,
})

/* --- MODAL LOGIC --- */
const modal = document.getElementById('project-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalImg = document.getElementById('modal-img');
const modalTags = document.getElementById('modal-tags');
const modalGithub = document.getElementById('modal-github');
const modalLive = document.getElementById('modal-live');

const openModalBtns = document.querySelectorAll('.open-modal-btn');

openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get data attributes
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        const img = btn.getAttribute('data-img');
        const imgType = btn.getAttribute('data-img-type');
        const tags = btn.getAttribute('data-tags');
        const github = btn.getAttribute('data-github');
        const live = btn.getAttribute('data-live');
        
        // Populate modal
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalImg.src = img;
        
        // Ajuste especial se a imagem for um ícone
        if (imgType === 'icon') {
            modalImg.style.objectFit = 'contain';
            modalImg.style.backgroundColor = '#e2e8f0';
            modalImg.style.padding = '2rem';
        } else {
            modalImg.style.objectFit = 'cover';
            modalImg.style.backgroundColor = 'transparent';
            modalImg.style.padding = '0';
        }
        
        // Populate tags
        modalTags.innerHTML = '';
        if(tags) {
            const tagsArray = tags.split(',');
            tagsArray.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag.trim();
                modalTags.appendChild(span);
            });
        }
        
        // Setup buttons
        modalGithub.href = github;
        
        if(live) {
            modalLive.style.display = 'inline-flex';
            modalLive.href = live;
        } else {
            modalLive.style.display = 'none';
        }
        
        // Open modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

/* --- CONTACT FORM LOGIC --- */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Update UI
        submitBtn.value = 'Enviando...';
        submitBtn.disabled = true;
        formStatus.style.display = 'none';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                formStatus.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
                formStatus.style.color = 'var(--main-color)'; // Cor principal do tema
                contactForm.reset();
            } else {
                formStatus.textContent = result.error || 'Erro ao enviar a mensagem. Tente novamente.';
                formStatus.style.color = '#ff6b6b'; // Vermelho suave
            }
        } catch (error) {
            formStatus.textContent = 'Erro de rede. Verifique sua conexão e tente novamente.';
            formStatus.style.color = '#ff6b6b'; // Vermelho suave
        } finally {
            formStatus.style.display = 'block';
            submitBtn.value = 'Enviar Mensagem';
            submitBtn.disabled = false;
        }
    });
}