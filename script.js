document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       DATA STRUCTURES (DEFAULT DATA)
       ========================================== */
    const defaultPortfolio = [
        {
            id: 'video-1',
            type: 'video',
            category: 'videos',
            title: 'Comercial Futurista',
            description: 'Vídeo promocional cinematográfico com renderização 3D e inteligência artificial.',
            mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-digital-screens-44026-large.mp4'
        },
        {
            id: 'video-2',
            type: 'video',
            category: 'videos',
            title: 'Campanha Cyberpunk',
            description: 'Clipe promocional em estilo cyberpunk com fusão de áudio e imagem inteligente.',
            mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-with-neon-lights-at-night-40134-large.mp4'
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
            mediaUrl: 'assets/site_mockup2.png'
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

    // Load or initialize portfolio
    let portfolioData = JSON.parse(localStorage.getItem('ai_portfolio_items'));
    let fallbackPortfolio = defaultPortfolio;

    // ATTEMPT TO LOAD BAKED-IN DATA FROM HTML EXPORT
    const dataScript = document.getElementById('portfolioDataScript');
    if (dataScript) {
        try {
            const bakedData = JSON.parse(dataScript.textContent);
            if (Array.isArray(bakedData) && bakedData.length > 0) {
                fallbackPortfolio = bakedData;
            }
        } catch(e) {}
    }

    if (!portfolioData || !Array.isArray(portfolioData) || portfolioData.length === 0) {
        portfolioData = fallbackPortfolio;
        localStorage.setItem('ai_portfolio_items', JSON.stringify(fallbackPortfolio));
    }
    
    // Save to localStorage helper
    const savePortfolioToStorage = () => {
        localStorage.setItem('ai_portfolio_items', JSON.stringify(portfolioData));
    };

    /* ==========================================
       WHATSAPP PHONE NUMBER MANAGER
       ========================================== */
    let whatsappPhone = localStorage.getItem('whatsapp_phone_number') || document.body.getAttribute('data-whatsapp') || '5511999999999';

    const updateWhatsappLinks = (num) => {
        const cleanNum = num.replace(/\D/g, ''); // Apenas números
        if (!cleanNum) return;
        
        whatsappPhone = cleanNum;
        localStorage.setItem('whatsapp_phone_number', cleanNum);
        
        // Atualiza todos os links do WhatsApp na página
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

    // Inicializa os links com o número salvo
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
    };
    
    loadSavedTexts();

    /* ==========================================
       RENDER PORTFOLIO DYNAMICALLY
       ========================================== */
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    const renderPortfolio = () => {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';
        
        const isAdmin = document.body.classList.contains('admin-mode-active');
        
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
            
            portfolioGrid.appendChild(card);
        });

        // Rebind video previews and lightbox event listeners
        bindPortfolioEvents();
        
        // Retrigger active tab filter in case a filter is active
        applyActiveFilter();
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
        
        // Reseta o scroll para o início ao trocar de aba
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                portfolioGrid.scrollTo({ left: 0, behavior: 'smooth' });
            });
        });
    }

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

    // Inicializa o input de WhatsApp e vincula o evento de alteração
    const adminPhoneInput = document.getElementById('adminWhatsappPhone');
    if (adminPhoneInput) {
        adminPhoneInput.value = whatsappPhone;
        adminPhoneInput.addEventListener('input', (e) => {
            updateWhatsappLinks(e.target.value);
        });
    }

    // Atalho secreto: Dois cliques na logo abrem o prompt de senha para editar
    const logoEl = document.querySelector('.logo');
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
        document.getElementById('itemTitle').value = item.title;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemMediaType').value = item.type;
        document.getElementById('itemMediaUrl').value = item.mediaUrl;
        document.getElementById('itemDescription').value = item.description;
        const extUrlEl = document.getElementById('itemExternalUrl');
        if (extUrlEl) extUrlEl.value = item.externalUrl || '';
        
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

    // Form Submission (Add or Edit)
    if (portfolioItemForm) {
        portfolioItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('editItemId').value;
            const title = document.getElementById('itemTitle').value;
            const category = document.getElementById('itemCategory').value;
            const type = document.getElementById('itemMediaType').value;
            const mediaUrl = document.getElementById('itemMediaUrl').value;
            const description = document.getElementById('itemDescription').value;
            const extUrlEl = document.getElementById('itemExternalUrl');
            const externalUrl = extUrlEl ? extUrlEl.value : '';
            
            if (id) {
                // Edit existing
                const index = portfolioData.findIndex(item => item.id === id);
                if (index !== -1) {
                    portfolioData[index] = { id, type, category, title, description, mediaUrl, externalUrl };
                }
            } else {
                // Add new
                const newId = 'item_' + Date.now();
                portfolioData.push({ id: newId, type, category, title, description, mediaUrl, externalUrl });
            }
            
            savePortfolioToStorage();
            renderPortfolio();
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
            
            // Grava o número do WhatsApp atualizado no clone
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
            
            alert('Parabéns! Arquivo index.html gerado e baixado. Substitua o arquivo index.html da sua pasta pelo arquivo que acabou de baixar para gravar suas alterações de vez.');
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
                'video': 'Vídeos com Inteligência Artificial',
                'app': 'Web App Interativo com IA',
                'site': 'Website / Landing Page Premium',
                'photo': 'Foto Profissional / Banners',
                'outro': 'Outro Projeto Personalizado'
            };
            
            const serviceText = serviceMap[service] || service;
            
            // WhatsApp link prep
            const phoneNumber = whatsappPhone; // Usa o número de WhatsApp configurado
            const introText = `Olá! Vim através do site e gostaria de solicitar um orçamento:\n\n`;
            const bodyText = `*Nome:* ${name}\n*E-mail:* ${email}\n*Serviço:* ${serviceText}\n*Descrição do Projeto:* ${details}`;
            
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

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

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
