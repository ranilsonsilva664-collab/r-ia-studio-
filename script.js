document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================
       DATA STRUCTURES (DEFAULT DATA)
       ========================================== */
    const portfolioData = [
        {
            id: 'video-1',
            type: 'video',
            category: 'videos',
            title: 'Comercial Futurista',
            description: 'Vídeo promocional cinematográfico com renderização 3D e inteligência artificial.',
            mediaUrl: 'https://res.cloudinary.com/dmxeqe939/video/upload/v1782391251/grok-video-a6d7bd4b-688e-4b51-9fc5-d597481d8d68_ulvspq.mp4'
        },
        {
            id: 'video-2',
            type: 'video',
            category: 'videos',
            title: 'Campanha Cyberpunk',
            description: 'Clipe promocional em estilo cyberpunk com fusão de áudio e imagem inteligente.',
            mediaUrl: 'https://res.cloudinary.com/dmxeqe939/video/upload/v1782391251/grok-video-a6d7bd4b-688e-4b51-9fc5-d597481d8d68_ulvspq.mp4'
        },
        {
            id: 'video-3',
            type: 'video',
            category: 'videos',
            title: 'Avatar Corporativo',
            description: 'Vídeo explicativo utilizando avatar hiper-realista dublado por IA.',
            mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-in-front-of-futuristic-computer-screens-43034-large.mp4'
        },
        {
            id: 'app-1',
            type: 'image',
            category: 'apps',
            title: 'Gerador de Copys Automáticas',
            description: 'Plataforma SaaS web de escrita criativa para anúncios baseada em GPT-4.',
            mediaUrl: 'assets/app_mockup1.png'
        },
        {
            id: 'app-2',
            type: 'image',
            category: 'apps',
            title: 'Atendente WhatsApp IA',
            description: 'Painel inteligente integrado com LLM para agendar consultas automaticamente.',
            mediaUrl: 'assets/app_mockup2.png'
        },
        {
            id: 'site-1',
            type: 'image',
            category: 'sites',
            title: 'Site Dr. Rodrigo Alencar',
            description: 'Website premium institucional para escritório de advocacia corporativa.',
            mediaUrl: 'assets/site_mockup1.png'
        },
        {
            id: 'site-2',
            type: 'image',
            category: 'sites',
            title: 'Site Dra. Joana',
            description: 'Website moderno, minimalista e interativo focado na conversão de pacientes.',
            mediaUrl: 'assets/site_mockup2.png',
            externalUrl: 'https://marvelous-torrone-04bc67.netlify.app/'
        },
        {
            id: 'design-1',
            type: 'image',
            category: 'design',
            title: 'Retrato Executivo IA',
            description: 'Foto profissional de alta resolução gerada inteiramente a partir de fotos comuns.',
            mediaUrl: 'assets/photo_portrait1.png'
        },
        {
            id: 'design-2',
            type: 'image',
            category: 'design',
            title: 'Anúncio Social Media',
            description: 'Arte publicitária de alta conversão para campanha de marketing de produto.',
            mediaUrl: 'assets/banner_flyer1.png'
        }
    ];

    /* ==========================================
       MOBILE NAVIGATION
       ========================================== */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileNavToggle?.querySelector('i');

    if (mobileNavToggle && mobileMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const isOpen = mobileMenu.classList.contains('active');
            if (menuIcon) {
                menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
            });
        });
    }

    /* ==========================================
       SMOOTH SCROLL & ACTIVE NAV LINK
       ========================================== */
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================
       RENDER PORTFOLIO DYNAMICALLY
       ========================================== */
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    const getCategoryLabel = (cat) => {
        const labels = {
            'videos': 'Vídeo com IA',
            'apps': 'Web App com IA',
            'sites': 'Landing Page',
            'design': 'Foto / Banner'
        };
        return labels[cat] || cat;
    };

    const renderPortfolio = () => {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';
        
        portfolioData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'portfolio-item card-glass';
            card.setAttribute('data-category', item.category);
            card.setAttribute('data-id', item.id);
            
            let mediaHtml = '';
            if (item.type === 'video') {
                mediaHtml = `
                    <div class="media-container video-container">
                        <video class="portfolio-video" muted loop playsinline preload="metadata">
                            <source src="${item.mediaUrl.includes('#t=') ? item.mediaUrl : item.mediaUrl + '#t=0.001'}" type="video/mp4">
                            Seu navegador não suporta vídeos HTML5.
                        </video>
                        <div class="video-overlay">
                            <button class="play-btn" aria-label="Play"><i class="fa-solid fa-play"></i></button>
                        </div>
                    </div>
                `;
            } else {
                mediaHtml = `
                    <div class="media-container image-container">
                        <img src="${item.mediaUrl}" alt="${item.title}" class="portfolio-img">
                        <div class="image-overlay">
                            ${item.category === 'apps' || item.category === 'sites' 
                                ? `<a href="${item.externalUrl ? item.externalUrl : '#'}" target="${item.externalUrl ? '_blank' : '_self'}" class="view-details-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir Demo</a>`
                                : `<button class="zoom-btn"><i class="fa-solid fa-magnifying-glass-plus"></i></button>`
                            }
                        </div>
                    </div>
                `;
            }
            
            card.innerHTML = `
                ${mediaHtml}
                <div class="card-info">
                    <span class="card-category">
                        ${item.type === 'video' ? '<i class="fa-solid fa-circle-play" style="margin-right: 5px;"></i>' : ''}${getCategoryLabel(item.category)}
                    </span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            portfolioGrid.appendChild(card);
        });

        bindPortfolioEvents();
        applyActiveFilter();
    };

    /* ==========================================
       PORTFOLIO TAB FILTERING
       ========================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    const applyActiveFilter = () => {
        const activeTabBtn = document.querySelector('.tab-btn.active');
        if (!activeTabBtn) return;
        
        const category = activeTabBtn.getAttribute('data-tab');
        const items = document.querySelectorAll('.portfolio-item');
        
        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyActiveFilter();
        });
    });

    /* ==========================================
       PORTFOLIO CAROUSEL CONTROLS
       ========================================== */
    const carouselPrevBtn = document.getElementById('carouselPrevBtn');
    const carouselNextBtn = document.getElementById('carouselNextBtn');
    
    if (carouselPrevBtn && carouselNextBtn && portfolioGrid) {
        carouselPrevBtn.addEventListener('click', () => {
            const cardWidth = portfolioGrid.querySelector('.portfolio-item')?.offsetWidth || 340;
            portfolioGrid.scrollBy({ left: -(cardWidth + 30), behavior: 'smooth' });
        });
        
        carouselNextBtn.addEventListener('click', () => {
            const cardWidth = portfolioGrid.querySelector('.portfolio-item')?.offsetWidth || 340;
            portfolioGrid.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
        });
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                portfolioGrid.scrollTo({ left: 0, behavior: 'smooth' });
            });
        });
    }

    /* ==========================================
       BIND DYNAMIC MEDIA EVENTS
       ========================================== */
    const videoLightbox = document.getElementById('videoLightbox');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxClose = document.getElementById('lightboxClose');
    const imageLightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const imageLightboxClose = document.getElementById('imageLightboxClose');

    const bindPortfolioEvents = () => {
        const videoContainers = document.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            container.addEventListener('mouseenter', () => video.play().catch(() => {}));
            container.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });

        const playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!videoLightbox) return;
                const card = btn.closest('.portfolio-item');
                const videoSource = card.querySelector('video source').getAttribute('src');
                
                lightboxVideo.querySelector('source').setAttribute('src', videoSource);
                lightboxVideo.load();
                videoLightbox.classList.add('open');
                
                lightboxVideo.muted = false;
                lightboxVideo.play().catch(() => {});
            });
        });

        const zoomButtons = document.querySelectorAll('.zoom-btn');
        zoomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!imageLightbox) return;
                const card = btn.closest('.portfolio-item');
                const imgSrc = card.querySelector('.portfolio-img').getAttribute('src');
                
                lightboxImg.setAttribute('src', imgSrc);
                imageLightbox.classList.add('open');
            });
        });
    };

    if (lightboxClose) lightboxClose.addEventListener('click', () => {
        if (videoLightbox) {
            videoLightbox.classList.remove('open');
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
        }
    });

    if (imageLightboxClose) imageLightboxClose.addEventListener('click', () => {
        if (imageLightbox) imageLightbox.classList.remove('open');
    });

    renderPortfolio();
});
