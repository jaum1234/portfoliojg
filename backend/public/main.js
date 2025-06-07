let currentLanguage = 'pt-br';
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

document.addEventListener('DOMContentLoaded', async () => {
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
        setLanguage('pt-br');
    }

    await loadData();

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
    setLanguage('pt-br');
});

enBtn.addEventListener('click', () => {
    setLanguage('en-us');
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    updateThemeIcon();
});

videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const videoData = {
        titulo: {
            ['pt-br']: document.getElementById('video-title-pt').value,
            ['en-us']: document.getElementById('video-title-en').value
        },
        descricao: {
            ['pt-br']: document.getElementById('video-desc-pt').value,
            ['en-us']: document.getElementById('video-desc-en').value
        },
        url_miniatura: document.getElementById('video-thumbnail').value,
        url_video: document.getElementById('video-url').value,
        categoriaId: document.getElementById('video-category').value
    };

    
    if (editingVideoId) {
        console.log(videoData);
        const index = videosData.findIndex(v => v.id == editingVideoId);
        if (index !== -1) {
            const response = await fetch(`/api/videos/${editingVideoId}`, {
                method: 'PUT',
                body: JSON.stringify(videoData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                handleError(await response.json());
                return;
            }

            const data = await response.json();

            videosData[index] = videoData;
            videoData.id = editingVideoId;

            const p = document.createElement('p');
            p.textContent = data.mensagem;

            showNotification(adminNotification, p, 'success');
        }
        editingVideoId = null;
    } else {
        const response = await fetch(`/api/videos`, {
            method: 'POST',
            body: JSON.stringify(videoData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            handleError(error);
            return;
        }

        const newVideo = await response.json();

        videosData.push({
            ...videoData,
            id: newVideo.id
        });

        const p = document.createElement('p');
        p.textContent = newVideo.mensagem;

        showNotification(adminNotification, p, 'success');
    }
    
    renderVideosTable();
    resetVideoForm();
});

categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    
    const categoryData = {
        nome: {
            "pt-br": document.getElementById('category-name-pt').value,
            "en-us": document.getElementById('category-name-en').value
        }
    };
    
    if (editingCategoryId) {
        const index = categoriesData.findIndex(c => c.id === editingCategoryId);
        if (index !== -1) {
            const response = await fetch(`/api/categorias/${editingCategoryId}`, {
                method: 'PUT',
                body: JSON.stringify(categoryData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                handleError(await response.json());
                return;
            }

            categoryData.id = editingCategoryId;
            
            categoriesData[index] = categoryData;

            const p = document.createElement('p');
            p.textContent = (await response.json()).mensagem;

            showNotification(adminNotification, p, 'success');
        }
        editingCategoryId = null;
    } else {
        const response = await fetch(`/api/categorias`, {
            method: 'POST',
            body: JSON.stringify(categoryData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            handleError(await response.json());
            return;
        }

        const newCategory = await response.json();
        categoryData.id = newCategory.dados.id;

        categoriesData.push(categoryData);

        const p = document.createElement('p');
        p.textContent = newCategory.mensagem;

        showNotification(adminNotification, p, 'success');
    }
    
    renderCategoriesTable();
    populateCategorySelect();
    resetCategoryForm();
});

function atualizarSite() {
    fetch('/api/atualizar-site', {
        method: 'POST'
    });
}

function handleError(err) {
    if (!Array.isArray(err.erros)) {
        const p = document.createElement('p');
        p.innerText = err.mensagem;
        showNotification(adminNotification, p, 'error');
        return;
    }
    
    const ul = document.createElement('ul');
    for (const erro of err.erros) {
        const li = document.createElement('li');
        ul.appendChild(li);
        li.textContent = erro.msg;
    }
    showNotification(adminNotification, ul, 'error');
}

cancelVideoBtn.addEventListener('click', () => {
    resetVideoForm();
});

cancelCategoryBtn.addEventListener('click', () => {
    resetCategoryForm();
});

thumbnailInput.addEventListener('input', () => {
    const url = thumbnailInput.value;
    console.log(url);
    if (url) {
        thumbnailPreview.src = url;
        thumbnailPreview.style.display = 'block';
        
        // // Verificar se a imagem carrega corretamente
        // thumbnailPreview.onerror = () => {
        //     thumbnailPreview.style.display = 'none';
        // };
    } else {
        thumbnailPreview.style.display = 'none';
    }
});

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('.lang-pt-br, .lang-en-us').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll(`.lang-${lang}`).forEach(el => {
        el.style.display = 'block';
    });
    
    ptBtn.classList.toggle('active', lang === 'pt-br');
    enBtn.classList.toggle('active', lang === 'en-us');
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

function showNotification(element, ptMessage, type) {
    element.innerHTML = '';

    element.appendChild(ptMessage);
    element.className = `notification ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
        element.innerHTML = '';
    }, 5000);
}

function renderVideosTable() {
    videosTable.innerHTML = '';
    
    videosData.forEach(video => {
        console.log(video);
        const tr = document.createElement('tr');
        
        const titleTd = document.createElement('td');

        titleTd.textContent = video.titulo[currentLanguage];
        
        const thumbnailTd = document.createElement('td');
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = video.url_miniatura;
        thumbnailImg.style.width = '80px';
        thumbnailImg.style.height = '45px';
        thumbnailImg.style.objectFit = 'cover';
        thumbnailImg.style.borderRadius = '4px';
        thumbnailTd.appendChild(thumbnailImg);
        
        const categoryTd = document.createElement('td');
        const category = categoriesData.find(c => c.id === video.categoriaId);
        categoryTd.textContent = category ? category.nome[currentLanguage] : video.categoriaId;
        
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
        namePtTd.textContent = category.nome['pt-br'];
        
        const nameEnTd = document.createElement('td');
        nameEnTd.textContent = category.nome['en-us'];
        
        const actionsTd = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.setAttribute('data-id', category.id);
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => editCategory(category.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('data-id', category.id);
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
        option.textContent = `${category.nome['pt-br']} / ${category.nome['en-us']}`;
        select.appendChild(option);
    });
}

function editVideo(id) {
    const video = videosData.find(v => v.id == id);
    if (!video) return;
    
    console.log(video);

    document.getElementById('video-id').value = video.id;
    document.getElementById('video-title-pt').value = video.titulo['pt-br'] || '';
    document.getElementById('video-title-en').value = video.titulo['en-us'] || '';
    document.getElementById('video-desc-pt').value = video.descricao['pt-br'] || '';
    document.getElementById('video-desc-en').value = video.descricao['en-us'] || '';
    document.getElementById('video-thumbnail').value = video.url_miniatura || '';
    document.getElementById('video-url').value = video.url_video || '';
    document.getElementById('video-category').value = video.categoriaId || '';
    
    // Mostrar pré-visualização da miniatura
    thumbnailPreview.src = video.url_miniatura;
    thumbnailPreview.style.display = 'block';

    editingVideoId = video.id;
    // Rolar para o formulário
    videoForm.scrollIntoView({ behavior: 'smooth' });
}

async function deleteVideo(id) {
    if (confirm('Tem certeza que deseja excluir este vídeo?')) {
        videosData = videosData.filter(v => v.id != id);
        renderVideosTable();

        const response = await fetch(`/api/videos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            handleError(await response.json());
            return;
        }

        const data = await response.json();

        const p = document.createElement('p');
        p.textContent = data.mensagem;

        showNotification(adminNotification, p, 'success');
    }
}

function editCategory(id) {
    const category = categoriesData.find(c => c.id === id);
    if (!category) return;
    
    document.getElementById('category-name-pt').value = category.nome['pt-br'];
    document.getElementById('category-name-en').value = category.nome['en-us'];
        
    editingCategoryId = category.id;
    
    categoryForm.scrollIntoView({ behavior: 'smooth' });
}

async function deleteCategory(id) {
    const hasVideosUsingCategory = videosData.some(v => v.category === id);
    
    if (hasVideosUsingCategory) {
        showNotification(adminNotification, 
            'Não é possível excluir esta categoria pois há vídeos associados a ela.', 
            'Cannot delete this category because there are videos associated with it.', 
            'error');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        const response = await fetch(`/api/categorias/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            handleError(await response.json());
            return;
        }

        categoriesData = categoriesData.filter(c => c.id !== id);
        const data = await response.json();

        renderCategoriesTable();
        populateCategorySelect();

        const p = document.createElement('p');
        p.textContent = data.mensagem;
        showNotification(adminNotification, p, 'success');
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

async function loadData() {

    const videos = await fetch('/api/videos');
    if (videos.ok) {
        const data = await videos.json();
        videosData = data.dados;
    }
    
    const categorias = await fetch('/api/categorias'); 
    if (categorias.ok) {
        const data = await categorias.json();
        categoriesData = data.dados;
    }
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