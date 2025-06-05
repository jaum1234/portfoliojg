document.addEventListener('DOMContentLoaded', function() {
    let currentLanguage = 'pt';
    let currentCategory = 'all';
    let isDarkTheme = false;
    
    const videoGrid = document.getElementById('video-grid');
    const modal = document.getElementById('video-modal');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const modalTitle = document.getElementById('modal-video-title');
    const modalDescription = document.getElementById('modal-video-description');
    const closeModal = document.querySelector('.close-modal');

    const ptBtn = document.getElementById('pt-btn');
    const enBtn = document.getElementById('en-btn');
    
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    function loadVideos(category = 'all') {
        videoGrid.innerHTML = '';
        
        const filteredVideos = category === 'all' 
            ? videos 
            : videos.filter(video => video.category === category);
        
        filteredVideos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.dataset.id = video.id;
            
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title[currentLanguage]}">
                    <div class="play-icon">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${video.title[currentLanguage]}</h3>
                    <p>${video.description[currentLanguage].substring(0, 100)}...</p>
                </div>
            `;
            
            videoCard.addEventListener('click', () => openVideoModal(video));
            videoGrid.appendChild(videoCard);
        });
    }
    
    function openVideoModal(video) {
        modalVideoContainer.innerHTML = `
            <iframe 
                src="${video.videoUrl}" 
                title="${video.title[currentLanguage]}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        modalTitle.textContent = video.title[currentLanguage];
        modalDescription.textContent = video.description[currentLanguage];
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeVideoModal() {
        modal.style.display = 'none';
        modalVideoContainer.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
    
    function setLanguage(lang) {
        currentLanguage = lang;
        document.body.setAttribute('data-language', lang);
        
        if (lang === 'pt') {
            ptBtn.classList.add('active');
            enBtn.classList.remove('active');
        } else {
            enBtn.classList.add('active');
            ptBtn.classList.remove('active');
        }
        
        loadVideos(currentCategory);
    }
    
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        
        if (isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.body.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    function filterByCategory(category) {
        currentCategory = category;
        
        categoryBtns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        loadVideos(category);
    }
    
    ptBtn.addEventListener('click', () => setLanguage('pt'));
    enBtn.addEventListener('click', () => setLanguage('en'));
    
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
    });
    
    closeModal.addEventListener('click', closeVideoModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });
    
    loadVideos();
});
