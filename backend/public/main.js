let currentLanguage = 'pt';
let isDarkTheme = false;
let videosData = [];
let categoriesData = [];
let editingVideoId = null;
let editingCategoryId = null;

const adminNotification = document.getElementById('admin-notification');
const videosNav = document.getElementById('videos-nav');
const categoriesNav = document.getElementById('categories-nav');
const videosSection = document.getElementById('videos-section');
const categoriesSection = document.getElementById('categories-section');
const videoForm = document.getElementById('video-form');
const categoryForm = document.getElementById('category-form');
const videosTable = document.getElementById('videos-table').querySelector('tbody');
const categoriesTable = document.getElementById('categories-table').querySelector('tbody');
const logoutBtn = document.getElementById('logout-btn');
const thumbnailPreview = document.getElementById('thumbnail-preview');
const thumbnailInput = document.getElementById('video-thumbnail');
const cancelVideoBtn = document.getElementById('cancel-video');
const cancelCategoryBtn = document.getElementById('cancel-category');
const ptBtn = document.getElementById('pt-btn');
const enBtn = document.getElementById('en-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        isDarkTheme = true;
        updateThemeIcon();
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    } else {
        setLanguage('pt');
    }

    loadData();

    renderVideosTable();
    renderCategoriesTable();
    populateCategorySelect();
});

logoutBtn.addEventListener('click', () => {
    window.location.href = '/logout';
});

// Navegação entre seções
videosNav.addEventListener('click', () => {
    videosNav.classList.add('active');
    categoriesNav.classList.remove('active');
    videosSection.classList.add('active');
    categoriesSection.classList.remove('active');
});

categoriesNav.addEventListener('click', () => {
    categoriesNav.classList.add('active');
    videosNav.classList.remove('active');
    categoriesSection.classList.add('active');
    videosSection.classList.remove('active');
});

ptBtn.addEventListener('click', () => {
    setLanguage('pt');
});

enBtn.addEventListener('click', () => {
    setLanguage('en');
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    updateThemeIcon();
});

videoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const videoData = {
        id: document.getElementById('video-id').value || generateId(),
        title: {
            pt: document.getElementById('video-title-pt').value,
            en: document.getElementById('video-title-en').value
        },
        description: {
            pt: document.getElementById('video-desc-pt').value,
            en: document.getElementById('video-desc-en').value
        },
        thumbnail: document.getElementById('video-thumbnail').value,
        videoUrl: document.getElementById('video-url').value,
        category: document.getElementById('video-category').value
    };
    
    if (editingVideoId) {
        const index = videosData.findIndex(v => v.id == editingVideoId);
        if (index !== -1) {
            videosData[index] = videoData;
            showNotification(adminNotification, 'Vídeo atualizado com sucesso!', 'Video updated successfully!', 'success');
        }
        editingVideoId = null;
    } else {
        videosData.push(videoData);
        showNotification(adminNotification, 'Vídeo adicionado com sucesso!', 'Video added successfully!', 'success');
    }
    
    saveData();
    renderVideosTable();
    resetVideoForm();
});

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const categoryId = document.getElementById('category-id').value;
    
    // Verificar se o ID já existe (exceto se estiver editando)
    if (!editingCategoryId && categoriesData.some(c => c.id === categoryId)) {
        showNotification(adminNotification, 'Este ID de categoria já existe!', 'This category ID already exists!', 'error');
        return;
    }
    
    const categoryData = {
        id: categoryId,
        name: {
            pt: document.getElementById('category-name-pt').value,
            en: document.getElementById('category-name-en').value
        }
    };
    
    if (editingCategoryId) {
        const index = categoriesData.findIndex(c => c.id === editingCategoryId);
        if (index !== -1) {
            if (editingCategoryId !== categoryId) {
                videosData.forEach(video => {
                    if (video.category === editingCategoryId) {
                        video.category = categoryId;
                    }
                });
            }
            
            categoriesData[index] = categoryData;
            showNotification(adminNotification, 'Categoria atualizada com sucesso!', 'Category updated successfully!', 'success');
        }
        editingCategoryId = null;
    } else {
        categoriesData.push(categoryData);
        showNotification(adminNotification, 'Categoria adicionada com sucesso!', 'Category added successfully!', 'success');
    }
    
    saveData();
    renderCategoriesTable();
    populateCategorySelect();
    resetCategoryForm();
});

cancelVideoBtn.addEventListener('click', () => {
    resetVideoForm();
});

cancelCategoryBtn.addEventListener('click', () => {
    resetCategoryForm();
});

thumbnailInput.addEventListener('input', () => {
    const url = thumbnailInput.value;
    if (url) {
        thumbnailPreview.src = url;
        thumbnailPreview.style.display = 'block';
        
        // Verificar se a imagem carrega corretamente
        thumbnailPreview.onerror = () => {
            thumbnailPreview.style.display = 'none';
        };
    } else {
        thumbnailPreview.style.display = 'none';
    }
});

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('.lang-pt, .lang-en').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll(`.lang-${lang}`).forEach(el => {
        el.style.display = 'block';
    });
    
    // Atualizar botões de idioma
    ptBtn.classList.toggle('active', lang === 'pt');
    enBtn.classList.toggle('active', lang === 'en');
}

function updateThemeIcon() {
    const icon = themeToggleBtn.querySelector('i');
    if (isDarkTheme) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function showNotification(element, ptMessage, enMessage, type) {
    element.textContent = currentLanguage === 'pt' ? ptMessage : enMessage;
    element.className = `notification ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function renderVideosTable() {
    videosTable.innerHTML = '';
    
    videosData.forEach(video => {
        const tr = document.createElement('tr');
        
        const titleTd = document.createElement('td');
        titleTd.textContent = video.title[currentLanguage];
        
        const thumbnailTd = document.createElement('td');
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = video.thumbnail;
        thumbnailImg.style.width = '80px';
        thumbnailImg.style.height = '45px';
        thumbnailImg.style.objectFit = 'cover';
        thumbnailImg.style.borderRadius = '4px';
        thumbnailTd.appendChild(thumbnailImg);
        
        const categoryTd = document.createElement('td');
        const category = categoriesData.find(c => c.id === video.category);
        categoryTd.textContent = category ? category.name[currentLanguage] : video.category;
        
        const actionsTd = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => editVideo(video.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteVideo(video.id));
        
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);
        
        tr.appendChild(titleTd);
        tr.appendChild(thumbnailTd);
        tr.appendChild(categoryTd);
        tr.appendChild(actionsTd);
        
        videosTable.appendChild(tr);
    });
}

function renderCategoriesTable() {
    categoriesTable.innerHTML = '';
    
    categoriesData.forEach(category => {
        const tr = document.createElement('tr');
        
        const idTd = document.createElement('td');
        idTd.textContent = category.id;
        
        const namePtTd = document.createElement('td');
        namePtTd.textContent = category.name.pt;
        
        const nameEnTd = document.createElement('td');
        nameEnTd.textContent = category.name.en;
        
        const actionsTd = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => editCategory(category.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteCategory(category.id));
        
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);
        
        tr.appendChild(idTd);
        tr.appendChild(namePtTd);
        tr.appendChild(nameEnTd);
        tr.appendChild(actionsTd);
        
        categoriesTable.appendChild(tr);
    });
}

function populateCategorySelect() {
    const select = document.getElementById('video-category');
    select.innerHTML = '';
    
    categoriesData.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.name.pt} / ${category.name.en}`;
        select.appendChild(option);
    });
}

function editVideo(id) {
    const video = videosData.find(v => v.id == id);
    if (!video) return;
    
    document.getElementById('video-id').value = video.id;
    document.getElementById('video-title-pt').value = video.title.pt;
    document.getElementById('video-title-en').value = video.title.en;
    document.getElementById('video-desc-pt').value = video.description.pt;
    document.getElementById('video-desc-en').value = video.description.en;
    document.getElementById('video-thumbnail').value = video.thumbnail;
    document.getElementById('video-url').value = video.videoUrl;
    document.getElementById('video-category').value = video.category;
    
    // Mostrar pré-visualização da miniatura
    thumbnailPreview.src = video.thumbnail;
    thumbnailPreview.style.display = 'block';
    
    editingVideoId = video.id;
    
    // Rolar para o formulário
    videoForm.scrollIntoView({ behavior: 'smooth' });
}

function deleteVideo(id) {
    if (confirm(currentLanguage === 'pt' ? 'Tem certeza que deseja excluir este vídeo?' : 'Are you sure you want to delete this video?')) {
        videosData = videosData.filter(v => v.id != id);
        saveData();
        renderVideosTable();
        showNotification(adminNotification, 'Vídeo excluído com sucesso!', 'Video deleted successfully!', 'success');
    }
}

function editCategory(id) {
    const category = categoriesData.find(c => c.id === id);
    if (!category) return;
    
    document.getElementById('category-id-hidden').value = category.id;
    document.getElementById('category-id').value = category.id;
    document.getElementById('category-name-pt').value = category.name.pt;
    document.getElementById('category-name-en').value = category.name.en;
    
    // Desabilitar campo ID se houver vídeos usando esta categoria
    const hasVideosUsingCategory = videosData.some(v => v.category === id);
    document.getElementById('category-id').disabled = hasVideosUsingCategory;
    
    if (hasVideosUsingCategory) {
        showNotification(adminNotification, 
            'Esta categoria está sendo usada por vídeos. O ID não pode ser alterado.', 
            'This category is being used by videos. ID cannot be changed.', 
            'error');
    }
    
    editingCategoryId = category.id;
    
    // Rolar para o formulário
    categoryForm.scrollIntoView({ behavior: 'smooth' });
}

function deleteCategory(id) {
    // Verificar se há vídeos usando esta categoria
    const hasVideosUsingCategory = videosData.some(v => v.category === id);
    
    if (hasVideosUsingCategory) {
        showNotification(adminNotification, 
            'Não é possível excluir esta categoria pois há vídeos associados a ela.', 
            'Cannot delete this category because there are videos associated with it.', 
            'error');
        return;
    }
    
    if (confirm(currentLanguage === 'pt' ? 'Tem certeza que deseja excluir esta categoria?' : 'Are you sure you want to delete this category?')) {
        categoriesData = categoriesData.filter(c => c.id !== id);
        saveData();
        renderCategoriesTable();
        populateCategorySelect();
        showNotification(adminNotification, 'Categoria excluída com sucesso!', 'Category deleted successfully!', 'success');
    }
}

function resetVideoForm() {
    videoForm.reset();
    document.getElementById('video-id').value = '';
    thumbnailPreview.style.display = 'none';
    editingVideoId = null;
}

function resetCategoryForm() {
    categoryForm.reset();
    document.getElementById('category-id-hidden').value = '';
    document.getElementById('category-id').disabled = false;
    editingCategoryId = null;
}

function generateId() {
    return Date.now().toString();
}

function loadData() {
    const savedVideos = localStorage.getItem('adminVideos');
    const savedCategories = localStorage.getItem('adminCategories');
    
    if (savedVideos) {
        try {
            videosData = JSON.parse(savedVideos);
        } catch (e) {
            console.error('Erro ao carregar vídeos:', e);
        }
    }
    
    if (savedCategories) {
        try {
            categoriesData = JSON.parse(savedCategories);
        } catch (e) {
            console.error('Erro ao carregar categorias:', e);
        }
    }
}

function saveData() {
    localStorage.setItem('adminVideos', JSON.stringify(videosData));
    localStorage.setItem('adminCategories', JSON.stringify(categoriesData));
}

function generateDataJsContent() {
    return `// Dados dos vídeos
const videos = ${JSON.stringify(videosData, null, 2)};

// Categorias
const categories = ${JSON.stringify(categoriesData, null, 2)};`;
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}