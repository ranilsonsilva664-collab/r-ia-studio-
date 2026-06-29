document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       FIREBASE INITIALIZATION
       ========================================== */
    const firebaseConfig = {
      apiKey: "AIzaSyACPDy1FhYgkNQdBfCfAe26hXpPFRojCf4",
      authDomain: "im-zap-atom.firebaseapp.com",
      projectId: "im-zap-atom",
      storageBucket: "im-zap-atom.firebasestorage.app",
      messagingSenderId: "208800360224",
      appId: "1:208800360224:web:7e0b625b73976008e2d945"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    /* ==========================================
       DATA STRUCTURES (DEFAULT DATA)
       ========================================== */
    const defaultPortfolio = [
        {
            id: 'video-1',
            type: 'video',
            category: 'videos',
            title: 'Comercial Futurista',
            description: 'V├¡deo promocional cinematogr├ífico com renderiza├º├úo 3D e intelig├¬ncia artificial.',
            mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-digital-screens-44026-large.mp4'
        },
        {
            id: 'video-2',
            type: 'video',
            category: 'videos',
            title: 'Campanha Cyberpunk',
            description: 'Clipe promocional em estilo cyberpunk com fus├úo de ├íudio e imagem inteligente.',
            mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-with-neon-lights-at-night-40134-large.mp4'
        },
        {
            id: 'video-3',
            type: 'video',
            category: 'videos',
            title: 'Avatar Corporativo',
            description: 'V├¡deo explicativo utilizando avatar hiper-realista dublado por IA.',
            mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-in-front-of-futuristic-computer-screens-43034-large.mp4'
        },
        {
            id: 'app-1',
            type: 'image',
            category: 'apps',
            title: 'Gerador de Copys Autom├íticas',
            description: 'Plataforma SaaS web de escrita criativa para an├║ncios baseada em GPT-4.',
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
            description: 'Website premium institucional para escrit├│rio de advocacia corporativa.',
            mediaUrl: 'assets/site_mockup1.png'
        },
        {
            id: 'site-2',
            type: 'image',
            category: 'sites',
            title: 'Site Dra. Joana',
            description: 'Website moderno, minimalista e interativo focado na convers├úo de pacientes.',
            mediaUrl: 'assets/site_mockup2.png'
        },
        {
            id: 'design-1',
            type: 'image',
            category: 'design',
            title: 'Retrato Executivo IA',
            description: 'Foto profissional de alta resolu├º├úo gerada inteiramente a partir de fotos comuns.',
            mediaUrl: 'assets/photo_portrait1.png'
        },
        {
            id: 'design-2',
            type: 'image',
            category: 'design',
            title: 'An├║ncio Social Media',
            description: 'Arte publicit├íria de alta convers├úo para campanha de marketing de produto.',
            mediaUrl: 'assets/banner_flyer1.png'
        }
    ];

    // Load or initialize portfolio
    let portfolioData = JSON.parse(localStorage.getItem('ai_portfolio_items'));
    let fallbackPortfolio = defaultPortfolio;

    if (!portfolioData || !Array.isArray(portfolioData) || portfolioData.length === 0) {
        portfolioData = fallbackPortfolio;
        localStorage.setItem('ai_portfolio_items', JSON.stringify(fallbackPortfolio));
    }
    
    // Save to localStorage & Firebase
    const savePortfolioToStorage = async () => {
        localStorage.setItem('ai_portfolio_items', JSON.stringify(portfolioData));
        try {
            await db.collection('r_ia_studio_portfolio').doc('data').set({ items: portfolioData });
        } catch(e) { console.error("Firebase error", e); }
    };

    // Fetch live portfolio
    db.collection('r_ia_studio_portfolio').doc('data').get().then(doc => {
        if (doc.exists && doc.data().items) {
            portfolioData = doc.data().items;
            localStorage.setItem('ai_portfolio_items', JSON.stringify(portfolioData));
            renderPortfolio();
        }
    }).catch(e => console.error(e));

    // Load or initialize testimonials
    let testimonialsData = JSON.parse(localStorage.getItem('ai_testimonials_items')) || [];
    if (!Array.isArray(testimonialsData)) testimonialsData = [];
    
    // Save to localStorage & Firebase
    const saveTestimonialsToStorage = async () => {
        localStorage.setItem('ai_testimonials_items', JSON.stringify(testimonialsData));
        try {
            await db.collection('r_ia_studio_testimonials').doc('data').set({ items: testimonialsData });
        } catch(e) { console.error("Firebase error", e); }
    };

    // Fetch live testimonials
    db.collection('r_ia_studio_testimonials').doc('data').get().then(doc => {
        if (doc.exists && doc.data().items) {
            testimonialsData = doc.data().items;
            localStorage.setItem('ai_testimonials_items', JSON.stringify(testimonialsData));
            renderTestimonials();
        }
    }).catch(e => console.error(e));

    /* ==========================================
       WHATSAPP PHONE NUMBER MANAGER
       ========================================== */
    let whatsappPhone = localStorage.getItem('whatsapp_phone_number') || document.body.getAttribute('data-whatsapp') || '5511999999999';

    const updateWhatsappLinks = (num) => {
        const cleanNum = num.replace(/\D/g, ''); // Apenas n├║meros
        if (!cleanNum) return;
        
        whatsappPhone = cleanNum;
        localStorage.setItem('whatsapp_phone_number', cleanNum);
        
        // Atualiza todos os links do WhatsApp na p├ígina
        document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(el => {
            if (el.href.includes('wa.me')) {
                const url = new URL(el.href);
                const textParam = url.searchParams.get('text');
                el.href = `https://wa.me/${cleanNum}${textParam ? '?text=' + textParam : ''}`;
            }
        });
        
        // Atualiza o campo de input administrativo
        const adminPhoneInput = document.getElementById('adminWhatsappPhone');
        if (adminPhoneInput && adminPhoneInput.value !== cleanNum) {
            adminPhoneInput.value = cleanNum;
        }
    };

    // Inicializa os links com o n├║mero salvo
    updateWhatsappLinks(whatsappPhone);

    /* ==========================================
       LOAD SAVED INLINE TEXTS
       ========================================== */
    const loadSavedTexts = () => {
        const editables = document.querySelectorAll('.editable');
        editables.forEach(el => {
            const key = el.getAttribute('data-key');
            const savedVal = localStorage.getItem(`editable_text_${key}`);
            if (savedVal) {
                el.innerHTML = savedVal;
            }
        });
        
        // Load Avatar Src
        const savedAvatar = localStorage.getItem('avatar_img_src');
        const avatarImg = document.getElementById('avatarImg');
        if (savedAvatar && avatarImg) {
            avatarImg.setAttribute('src', savedAvatar);
        }

        // Fetch live texts from Firebase
        db.collection('r_ia_studio_settings').doc('texts').get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                
                editables.forEach(el => {
                    const key = el.getAttribute('data-key');
                    const fbKey = `editable_text_${key}`;
                    if (data[fbKey]) {
                        el.innerHTML = data[fbKey];
                        localStorage.setItem(fbKey, data[fbKey]);
                    }
                });
                
                if (data.avatar_img_src && avatarImg) {
                    avatarImg.setAttribute('src', data.avatar_img_src);
                    localStorage.setItem('avatar_img_src', data.avatar_img_src);
                }
                
                if (data.whatsapp_phone_number && data.whatsapp_phone_number !== whatsappPhone) {
                    updateWhatsappLinks(data.whatsapp_phone_number);
                }
            }
        }).catch(e => console.error(e));
    };
    
    loadSavedTexts();

    /* ==========================================
       RENDER PORTFOLIO DYNAMICALLY
       ========================================== */
    const renderPortfolio = () => {
        const grids = {
            videos: document.getElementById('portfolioGridVideos'),
            apps: document.getElementById('portfolioGridApps'),
            sites: document.getElementById('portfolioGridSites'),
            design: document.getElementById('portfolioGridDesign')
        };
        
        // Clear all grids
        Object.values(grids).forEach(grid => {
            if (grid) grid.innerHTML = '';
        });
        
        const isAdmin = document.body.classList.contains('admin-mode-active');
        
        portfolioData.forEach(item => {
            const grid = grids[item.category];
            if (!grid) return;

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
                            Seu navegador n├úo suporta v├¡deos HTML5.
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
            
            const adminActionsHtml = `
                <div class="card-admin-actions">
                    <button class="card-admin-btn card-edit-btn" onclick="window.editPortfolioItem('${item.id}')" title="Editar Card">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="card-admin-btn card-delete-btn" onclick="window.deletePortfolioItem('${item.id}')" title="Excluir Card">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            
            card.innerHTML = `
                ${mediaHtml}
                ${adminActionsHtml}
                <div class="card-info">
                    <span class="card-category">
                        ${item.type === 'video' ? '<i class="fa-solid fa-circle-play" style="margin-right: 5px;"></i>' : ''}${getCategoryLabel(item.category)}
                    </span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            grid.appendChild(card);
        });

        // Rebind video previews and lightbox event listeners
        bindPortfolioEvents();
        
        // Hide empty category blocks
        Object.entries(grids).forEach(([cat, grid]) => {
            if (grid) {
                const block = document.getElementById(`category-${cat}`);
                if (block) {
                    block.style.display = grid.children.length === 0 ? 'none' : 'block';
                }
            }
        });
    };

    const getCategoryLabel = (cat) => {
        const labels = {
            'videos': 'Vídeo com IA',
            'apps': 'Web App com IA',
            'sites': 'Landing Page',
            'design': 'Foto / Banner'
        };
        return labels[cat] || cat;
    };

    /* ==========================================
       RENDER TESTIMONIALS DYNAMICALLY
       ========================================== */
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    
    const renderTestimonials = () => {
        if (!testimonialsGrid) return;
        testimonialsGrid.innerHTML = '';
        
        testimonialsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'portfolio-item card-glass';
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
                            <button class="zoom-btn"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                        </div>
                    </div>
                `;
            }
            
            const adminActionsHtml = `
                <div class="card-admin-actions">
                    <button class="card-admin-btn card-edit-btn" onclick="window.editTestimonialItem('${item.id}')" title="Editar Card">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="card-admin-btn card-delete-btn" onclick="window.deleteTestimonialItem('${item.id}')" title="Excluir Card">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            
            card.innerHTML = `
                ${mediaHtml}
                ${adminActionsHtml}
                <div class="card-info">
                    <span class="card-category">Depoimento</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            testimonialsGrid.appendChild(card);
        });

        // Rebind video previews and lightbox event listeners
        bindPortfolioEvents();
    };

    const setupTestimonialsCarousel = () => {
        const grid = document.getElementById('testimonialsGrid');
        const prevBtn = document.getElementById('testiPrevBtn');
        const nextBtn = document.getElementById('testiNextBtn');

        if (grid && prevBtn && nextBtn) {
            const scrollAmount = 330;
            prevBtn.addEventListener('click', () => {
                grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    };

    /* ==========================================
       MOBILE NAVIGATION
       ========================================== */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileNavToggle.querySelector('i');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const isOpen = mobileMenu.classList.contains('open');
            menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuIcon.className = 'fa-solid fa-bars';
        });
    });

    /* ==========================================
       PORTFOLIO CAROUSEL CONTROLS
       ========================================== */
    const setupCategoryCarousel = (catName) => {
        const grid = document.getElementById(`portfolioGrid${catName}`);
        const prevBtn = document.getElementById(`carouselPrev${catName}`);
        const nextBtn = document.getElementById(`carouselNext${catName}`);
        
        if (grid && prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = grid.querySelector('.portfolio-item')?.offsetWidth || 340;
                grid.scrollBy({ left: -(cardWidth + 30), behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                const cardWidth = grid.querySelector('.portfolio-item')?.offsetWidth || 340;
                grid.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
            });
        }
    };

    setupCategoryCarousel('Videos');
    setupCategoryCarousel('Apps');
    setupCategoryCarousel('Sites');
    setupCategoryCarousel('Design');

    /* ==========================================
       BIND DYNAMIC MEDIA EVENTS (HOVER VIDEO, LIGHTBOX)
       ========================================== */
    const videoLightbox = document.getElementById('videoLightbox');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxClose = document.getElementById('lightboxClose');
    const imageLightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const imageLightboxClose = document.getElementById('imageLightboxClose');

    const bindPortfolioEvents = () => {
        // Hover previews
        const videoContainers = document.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            
            // Mouse Enter
            container.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });
            
            // Mouse Leave
            container.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });

        // Click play button for video lightbox
        const playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.portfolio-item');
                const videoSource = card.querySelector('video source').getAttribute('src');
                
                lightboxVideo.querySelector('source').setAttribute('src', videoSource);
                lightboxVideo.load();
                videoLightbox.classList.add('open');
                
                lightboxVideo.muted = false;
                lightboxVideo.play().catch(() => {});
            });
        });

        // Click zoom button for image lightbox
        const zoomButtons = document.querySelectorAll('.zoom-btn');
        zoomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.portfolio-item');
                const imgSrc = card.querySelector('.portfolio-img').getAttribute('src');
                
                lightboxImg.setAttribute('src', imgSrc);
                imageLightbox.classList.add('open');
            });
        });
    };

    // Close lightboxes functions
    const closeVideoLightbox = () => {
        if (videoLightbox) {
            videoLightbox.classList.remove('open');
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
        }
    };

    const closeImageLightbox = () => {
        if (imageLightbox) {
            imageLightbox.classList.remove('open');
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeVideoLightbox);
    if (videoLightbox) {
        videoLightbox.addEventListener('click', (e) => {
            if (e.target === videoLightbox) closeVideoLightbox();
        });
    }

    if (imageLightboxClose) imageLightboxClose.addEventListener('click', closeImageLightbox);
    if (imageLightbox) {
        imageLightbox.addEventListener('click', (e) => {
            if (e.target === imageLightbox) closeImageLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoLightbox();
            closeImageLightbox();
        }
    });

    /* ==========================================
       ADMIN MODE CONTROLLER
       ========================================== */
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    const adminControlsPanel = document.getElementById('adminControlsPanel');
    const exitAdminBtn = document.getElementById('exitAdminBtn');
    const addNewItemBtn = document.getElementById('addNewItemBtn');
    const exportHtmlBtn = document.getElementById('exportHtmlBtn');
    
    const adminModal = document.getElementById('adminModal');
    const adminModalClose = document.getElementById('adminModalClose');
    const portfolioItemForm = document.getElementById('portfolioItemForm');
    
    const avatarModal = document.getElementById('avatarModal');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarModalClose = document.getElementById('avatarModalClose');
    const avatarForm = document.getElementById('avatarForm');

    // Toggle Admin Mode
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminParam = urlParams.get('admin') === 'true';
    if (adminToggleBtn) {
        if (isAdminParam) {
            adminToggleBtn.style.setProperty('display', 'flex', 'important');
        } else {
            adminToggleBtn.style.setProperty('display', 'none', 'important');
        }
    }

    const toggleAdminMode = (activate = null) => {
        const body = document.body;
        const willBeActive = activate !== null ? activate : !body.classList.contains('admin-mode-active');
        
        if (willBeActive) {
            body.classList.add('admin-mode-active');
            adminControlsPanel.classList.add('open');
            adminToggleBtn.style.background = '#ffe600';
            adminToggleBtn.style.color = '#000';
            
            // Make texts editable
            document.querySelectorAll('.editable').forEach(el => {
                el.setAttribute('contenteditable', 'true');
            });
        } else {
            body.classList.remove('admin-mode-active');
            adminControlsPanel.classList.remove('open');
            adminToggleBtn.style.background = '';
            adminToggleBtn.style.color = '';
            
            // Remove text editable
            document.querySelectorAll('.editable').forEach(el => {
                el.removeAttribute('contenteditable');
            });
        }
        
        // Re-render to update edit/delete buttons
        renderPortfolio();
    };

    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => toggleAdminMode());
    }
    
    if (exitAdminBtn) {
        exitAdminBtn.addEventListener('click', () => toggleAdminMode(false));
    }

    // Inicializa o input de WhatsApp e vincula o evento de altera├º├úo
    const adminPhoneInput = document.getElementById('adminWhatsappPhone');
    if (adminPhoneInput) {
        adminPhoneInput.value = whatsappPhone;
        adminPhoneInput.addEventListener('input', (e) => {
            updateWhatsappLinks(e.target.value);
            db.collection('r_ia_studio_settings').doc('texts').set({ whatsapp_phone_number: e.target.value }, { merge: true });
        });
    }

    // Atalho secreto: Dois cliques na logo abrem o prompt de senha para editar
    const logoEl = document.querySelector('.brand-logo');
    if (logoEl) {
        logoEl.addEventListener('dblclick', (e) => {
            e.preventDefault();
            const password = prompt('Digite a senha de administrador para editar:');
            if (password === 'admin123') {
                toggleAdminMode(true);
            } else if (password !== null) {
                alert('Senha incorreta.');
            }
        });
    }

    // Save Edited Texts on Blur
    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('blur', () => {
            const key = el.getAttribute('data-key');
            localStorage.setItem(`editable_text_${key}`, el.innerHTML);
            db.collection('r_ia_studio_settings').doc('texts').set({ [`editable_text_${key}`]: el.innerHTML }, { merge: true });
        });
    });

    /* ==========================================
       PORTFOLIO CARD CRUD LOGIC (ADMIN PANEL)
       ========================================== */
    
    // Open Modal to Add
    if (addNewItemBtn) {
        addNewItemBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Adicionar Item ao Portfólio';
            document.getElementById('editItemId').value = '';
            document.getElementById('itemSectionType').value = 'portfolio';
            document.getElementById('categoryGroup').style.display = 'block';
            portfolioItemForm.reset();
            adminModal.classList.add('open');
        });
    }

    // Open Modal to Add Testimonial Item
    const addNewTestiBtn = document.getElementById('addNewTestiBtn');
    if (addNewTestiBtn) {
        addNewTestiBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Adicionar Novo Depoimento';
            document.getElementById('editItemId').value = '';
            document.getElementById('itemSectionType').value = 'testimonial';
            document.getElementById('categoryGroup').style.display = 'none';
            portfolioItemForm.reset();
            adminModal.classList.add('open');
        });
    }

    if (adminModalClose) {
        adminModalClose.addEventListener('click', () => adminModal.classList.remove('open'));
    }

    // Edit Item function (exposed to window)
    window.editPortfolioItem = (id) => {
        const item = portfolioData.find(i => i.id === id);
        if (!item) return;
        
        document.getElementById('modalTitle').textContent = 'Editar Item do Portfólio';
        document.getElementById('editItemId').value = item.id;
        document.getElementById('itemSectionType').value = 'portfolio';
        document.getElementById('categoryGroup').style.display = 'block';
        document.getElementById('itemTitle').value = item.title;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemMediaType').value = item.type;
        document.getElementById('itemMediaUrl').value = item.mediaUrl;
        document.getElementById('itemDescription').value = item.description;
        const extUrlEl = document.getElementById('itemExternalUrl');
        if (extUrlEl) extUrlEl.value = item.externalUrl || '';
        
        adminModal.classList.add('open');
    };

    // Edit Testimonial Item function
    window.editTestimonialItem = (id) => {
        const item = testimonialsData.find(i => i.id === id);
        if (!item) return;
        
        document.getElementById('modalTitle').textContent = 'Editar Depoimento';
        document.getElementById('editItemId').value = item.id;
        document.getElementById('itemSectionType').value = 'testimonial';
        document.getElementById('categoryGroup').style.display = 'none';
        document.getElementById('itemTitle').value = item.title;
        document.getElementById('itemMediaType').value = item.type;
        document.getElementById('itemMediaUrl').value = item.mediaUrl;
        document.getElementById('itemDescription').value = item.description;
        
        adminModal.classList.add('open');
    };

    // Delete Item function (exposed to window)
    window.deletePortfolioItem = (id) => {
        if (confirm('Tem certeza que deseja remover este item?')) {
            portfolioData = portfolioData.filter(i => i.id !== id);
            savePortfolioToStorage();
            renderPortfolio();
        }
    };

    // Delete Testimonial Item function
    window.deleteTestimonialItem = (id) => {
        if (confirm('Tem certeza que deseja remover este depoimento?')) {
            testimonialsData = testimonialsData.filter(i => i.id !== id);
            saveTestimonialsToStorage();
            renderTestimonials();
        }
    };

    // Form Submission (Add or Edit)
    if (portfolioItemForm) {
        portfolioItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const sectionType = document.getElementById('itemSectionType').value;
            const id = document.getElementById('editItemId').value;
            const title = document.getElementById('itemTitle').value;
            const type = document.getElementById('itemMediaType').value;
            const mediaUrl = document.getElementById('itemMediaUrl').value;
            const description = document.getElementById('itemDescription').value;
            
            if (sectionType === 'testimonial') {
                if (id) {
                    const index = testimonialsData.findIndex(item => item.id === id);
                    if (index !== -1) testimonialsData[index] = { id, type, title, description, mediaUrl };
                } else {
                    const newId = 'testi_' + Date.now();
                    testimonialsData.push({ id: newId, type, title, description, mediaUrl });
                }
                saveTestimonialsToStorage();
                renderTestimonials();
            } else {
                const category = document.getElementById('itemCategory').value;
                const extUrlEl = document.getElementById('itemExternalUrl');
                const externalUrl = extUrlEl ? extUrlEl.value : '';
                
                if (id) {
                    const index = portfolioData.findIndex(item => item.id === id);
                    if (index !== -1) portfolioData[index] = { id, type, category, title, description, mediaUrl, externalUrl };
                } else {
                    const newId = 'item_' + Date.now();
                    portfolioData.push({ id: newId, type, category, title, description, mediaUrl, externalUrl });
                }
                savePortfolioToStorage();
                renderPortfolio();
            }
            
            adminModal.classList.remove('open');
        });
    }

    /* ==========================================
       AVATAR EDITING
       ========================================== */
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            const avatarImg = document.getElementById('avatarImg');
            document.getElementById('avatarUrl').value = avatarImg ? avatarImg.getAttribute('src') : '';
            avatarModal.classList.add('open');
        });
    }

    if (avatarModalClose) {
        avatarModalClose.addEventListener('click', () => avatarModal.classList.remove('open'));
    }

    if (avatarForm) {
        avatarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const url = document.getElementById('avatarUrl').value;
            const avatarImg = document.getElementById('avatarImg');
            if (avatarImg) {
                avatarImg.setAttribute('src', url);
                localStorage.setItem('avatar_img_src', url);
                db.collection('r_ia_studio_settings').doc('texts').set({ avatar_img_src: url }, { merge: true });
            }
            avatarModal.classList.remove('open');
        });
    }

    /* ==========================================
       HTML CODE EXPORT LOGIC
       ========================================== */
    if (exportHtmlBtn) {
        exportHtmlBtn.addEventListener('click', () => {
            // Clone Document to manipulate safely
            const clone = document.documentElement.cloneNode(true);
            
            // Clean up admin classes and panels on body
            const body = clone.querySelector('body');
            body.classList.remove('admin-mode-active');
            
            // Find and close mobile menus
            const mobileMenuClone = clone.querySelector('.mobile-menu');
            if (mobileMenuClone) mobileMenuClone.classList.remove('open');
            const menuIconClone = clone.querySelector('.mobile-nav-toggle i');
            if (menuIconClone) menuIconClone.className = 'fa-solid fa-bars';
            
            // Close admin control panels
            const controlsPanelClone = clone.querySelector('#adminControlsPanel');
            if (controlsPanelClone) controlsPanelClone.classList.remove('open');
            
            // Save active inline texts in HTML
            clone.querySelectorAll('.editable').forEach(el => {
                const key = el.getAttribute('data-key');
                const savedVal = localStorage.getItem(`editable_text_${key}`);
                if (savedVal) {
                    el.innerHTML = savedVal;
                }
                el.removeAttribute('contenteditable');
            });
            
            // Set avatar src
            const avatarImgClone = clone.querySelector('#avatarImg');
            const savedAvatar = localStorage.getItem('avatar_img_src');
            if (savedAvatar && avatarImgClone) {
                avatarImgClone.setAttribute('src', savedAvatar);
            }
            
            // Grava o n├║mero do WhatsApp atualizado no clone
            clone.querySelector('body').setAttribute('data-whatsapp', whatsappPhone);
            clone.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(el => {
                if (el.href.includes('wa.me')) {
                    const cleanNum = whatsappPhone.replace(/\D/g, '');
                    const url = new URL(el.href);
                    const textParam = url.searchParams.get('text');
                    el.href = `https://wa.me/${cleanNum}${textParam ? '?text=' + textParam : ''}`;
                }
            });
            
            // Bake the portfolio grid items directly into HTML
            const gridClone = clone.querySelector('#portfolioGrid');
            if (gridClone) {
                gridClone.innerHTML = '';
                
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
                            Seu navegador n├úo suporta v├¡deos HTML5.
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
                    
                    const adminActionsHtml = `
                <div class="card-admin-actions">
                    <button class="card-admin-btn card-edit-btn" onclick="window.editPortfolioItem('${item.id}')" title="Editar Card">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="card-admin-btn card-delete-btn" onclick="window.deletePortfolioItem('${item.id}')" title="Excluir Card">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                    `;
                    
                    card.innerHTML = `
                        ${mediaHtml}
                        ${adminActionsHtml}
                        <div class="card-info">
                            <span class="card-category">${getCategoryLabel(item.category)}</span>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `;
                    gridClone.appendChild(card);
                });
            }
            
            // Inject portfolio data JSON into the clone so it survives the export
            let dataScriptClone = clone.querySelector('#portfolioDataScript');
            if (!dataScriptClone) {
                dataScriptClone = document.createElement('script');
                dataScriptClone.id = 'portfolioDataScript';
                dataScriptClone.type = 'application/json';
                clone.querySelector('body').appendChild(dataScriptClone);
            }
            dataScriptClone.textContent = JSON.stringify(portfolioData);

            // Bake the testimonials grid items directly into HTML
            const testiGridClone = clone.querySelector('#testimonialsGrid');
            if (testiGridClone) {
                testiGridClone.innerHTML = '';
                
                testimonialsData.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'portfolio-item card-glass';
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
                            <button class="zoom-btn"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                        </div>
                    </div>
                        `;
                    }
                    
                    const adminActionsHtml = `
                <div class="card-admin-actions">
                    <button class="card-admin-btn card-edit-btn" onclick="window.editTestimonialItem('${item.id}')" title="Editar Card">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="card-admin-btn card-delete-btn" onclick="window.deleteTestimonialItem('${item.id}')" title="Excluir Card">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                    `;
                    
                    card.innerHTML = `
                        ${mediaHtml}
                        ${adminActionsHtml}
                        <div class="card-info">
                            <span class="card-category">Depoimento</span>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `;
                    testiGridClone.appendChild(card);
                });
            }
            
            // Inject testimonials data JSON into the clone
            let testiDataScriptClone = clone.querySelector('#testimonialsDataScript');
            if (!testiDataScriptClone) {
                testiDataScriptClone = document.createElement('script');
                testiDataScriptClone.id = 'testimonialsDataScript';
                testiDataScriptClone.type = 'application/json';
                clone.querySelector('body').appendChild(testiDataScriptClone);
            }
            testiDataScriptClone.textContent = JSON.stringify(testimonialsData);

            // Build raw HTML string
            const htmlString = '<!DOCTYPE html>\n<html lang="pt-BR">\n' + clone.innerHTML + '\n</html>';
            
            // Download HTML file
            const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('Parab├®ns! Arquivo index.html gerado e baixado. Substitua o arquivo index.html da sua pasta pelo arquivo que acabou de baixar para gravar suas altera├º├Áes de vez.');
        });
    }

    /* ==========================================
       CONTACT FORM SUBMIT -> WHATSAPP INTEGRATION
       ========================================== */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[placeholder="Seu Nome"]').value;
            const email = contactForm.querySelector('input[placeholder="Seu E-mail"]').value;
            const service = contactForm.querySelector('.form-select').value;
            const details = contactForm.querySelector('textarea').value;
            
            const serviceMap = {
                'video': 'V├¡deos com Intelig├¬ncia Artificial',
                'app': 'Web App Interativo com IA',
                'site': 'Website / Landing Page Premium',
                'photo': 'Foto Profissional / Banners',
                'outro': 'Outro Projeto Personalizado'
            };
            
            const serviceText = serviceMap[service] || service;
            
            // WhatsApp link prep
            const phoneNumber = whatsappPhone; // Usa o n├║mero de WhatsApp configurado
            const introText = `Ol├í! Vim atrav├®s do site e gostaria de solicitar um or├ºamento:\n\n`;
            const bodyText = `*Nome:* ${name}\n*E-mail:* ${email}\n*Servi├ºo:* ${serviceText}\n*Descri├º├úo do Projeto:* ${details}`;
            
            const fullMessage = encodeURIComponent(introText + bodyText);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${fullMessage}`;
            
            window.open(whatsappUrl, '_blank');
            contactForm.reset();
        });
    }

    /* ==========================================
       INITIAL RENDER & ANIMATION ON SCROLL
       ========================================= */
    renderPortfolio();
    renderTestimonials();
    setupTestimonialsCarousel();

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 180)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});
