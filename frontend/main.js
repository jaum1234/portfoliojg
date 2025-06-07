document.addEventListener('DOMContentLoaded', function() {
    let currentLanguage = 'pt';
    let currentCategory = 'all';
    let isDarkTheme = false;
    
    const ptBtn = document.getElementById('pt-btn');
    const enBtn = document.getElementById('en-btn');
    
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    const categoryBtns = document.querySelectorAll('.category-btn');

    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', () => {
            openVideoModal(card.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('[data-modal]').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVideoModal(modal);
            }
        });
        modal.querySelector('.close-modal').addEventListener('click', () => {
            closeVideoModal(modal);
        });
    });
    
    function loadVideos(category = 'all') {
        document.querySelectorAll('.video-card').forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                return;
            }

            card.style.display = 'none';
        });
    }
    
    function openVideoModal(id) {
        document.querySelector(`div[data-modal][data-video-id=${id}`).style.display = 'block';
    }
    
    function closeVideoModal(modal) {
        modal.style.display = 'none'
        const idVideo = modal.getAttribute('data-video-id');
        document.querySelector(`[id=modal-video-container-${idVideo}]`).innerHTML = '';
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
});
