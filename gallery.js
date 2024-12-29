// 创建 Work 类
const Work = AV.Object.extend('Work');

// DOM 元素
const elements = {
    galleryGrid: document.getElementById('galleryGrid'),
    workModal: document.getElementById('workModal'),
    detailModal: document.getElementById('detailModal'),
    workForm: document.getElementById('workForm'),
    modalTitle: document.getElementById('modalTitle'),
    workTitle: document.getElementById('workTitle'),
    workDescription: document.getElementById('workDescription'),
    workImage: document.getElementById('workImage'),
    workDate: document.getElementById('workDate'),
    workTags: document.getElementById('workTags'),
    imagePreview: document.getElementById('imagePreview'),
    addWork: document.getElementById('addWork'),
    cancelWork: document.getElementById('cancelWork'),
    closeDetail: document.getElementById('closeDetail'),
    workDetail: document.getElementById('workDetail')
};

// 当前编辑的作品
let currentEditWork = null;

// 初始化
async function initializeGallery() {
    try {
        const query = new AV.Query('Work');
        query.descending('date');
        const works = await query.find();
        
        elements.galleryGrid.innerHTML = '';
        works.forEach(work => {
            renderWorkCard(work);
        });
    } catch (error) {
        console.error("Error loading works:", error);
        alert('加载作品失败，请刷新页面重试');
    }
}

// 渲染作品卡片
function renderWorkCard(work) {
    const data = work.toJSON();
    const card = document.createElement('div');
    card.className = 'work-card';
    card.innerHTML = `
        <div class="work-image">
            <img src="${data.imageUrl}" alt="${data.title}">
        </div>
        <div class="work-info">
            <h3>${data.title}</h3>
            <p class="work-date">${formatDate(data.date)}</p>
            <div class="work-tags">
                ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="work-actions">
            <button class="view-btn" onclick="showWorkDetail('${work.id}')">查看</button>
            <button class="edit-btn" onclick="editWork('${work.id}')">编辑</button>
            <button class="delete-btn" onclick="deleteWork('${work.id}')">删除</button>
        </div>
    `;
    elements.galleryGrid.appendChild(card);
}

// 显示作品详情
async function showWorkDetail(id) {
    try {
        const query = new AV.Query('Work');
        const work = await query.get(id);
        const data = work.toJSON();
        
        elements.workDetail.innerHTML = `
            <div class="detail-header">
                <h2>${data.title}</h2>
                <p class="detail-date">${formatDate(data.date)}</p>
            </div>
            <div class="detail-image">
                <img src="${data.imageUrl}" alt="${data.title}">
            </div>
            <div class="detail-content">
                <p class="detail-description">${data.description}</p>
                <div class="detail-tags">
                    ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        elements.detailModal.style.display = 'flex';
    } catch (error) {
        console.error("Error loading work detail:", error);
        alert('加载作品详情失败');
    }
}

// 编辑作品
async function editWork(id) {
    try {
        const query = new AV.Query('Work');
        currentEditWork = await query.get(id);
        const data = currentEditWork.toJSON();
        
        elements.modalTitle.textContent = '编辑作品';
        elements.workTitle.value = data.title;
        elements.workDescription.value = data.description;
        elements.workDate.value = data.date;
        elements.workTags.value = data.tags.join(',');
        elements.imagePreview.innerHTML = `<img src="${data.imageUrl}" alt="预览图">`;
        elements.workModal.style.display = 'flex';
    } catch (error) {
        console.error("Error loading work for edit:", error);
        alert('加载作品信息失败');
    }
}

// 删除作品
async function deleteWork(id) {
    if (confirm('确定要删除这个作品吗？')) {
        try {
            const query = new AV.Query('Work');
            const work = await query.get(id);
            await work.destroy();
            initializeGallery();
        } catch (error) {
            console.error("Error deleting work:", error);
            alert('删除作品失败');
        }
    }
}

// 处理图片预览
elements.workImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.imagePreview.innerHTML = `<img src="${e.target.result}" alt="预览图">`;
        };
        reader.readAsDataURL(file);
    }
});

// 处理表单提交
elements.workForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        let work = currentEditWork || new Work();
        
        // 如果有新图片，先上传图片
        let imageUrl = null;
        if (elements.workImage.files[0]) {
            const avFile = new AV.File(elements.workImage.files[0].name, elements.workImage.files[0]);
            const savedFile = await avFile.save();
            imageUrl = savedFile.url();
        }

        // 设置作品数据
        work.set('title', elements.workTitle.value);
        work.set('description', elements.workDescription.value);
        work.set('date', elements.workDate.value);
        work.set('tags', elements.workTags.value.split(',').map(tag => tag.trim()).filter(tag => tag));
        
        if (imageUrl) {
            work.set('imageUrl', imageUrl);
        }

        await work.save();
        
        // 重置表单和状态
        elements.workModal.style.display = 'none';
        elements.workForm.reset();
        elements.imagePreview.innerHTML = '';
        currentEditWork = null;
        
        // 刷新画廊
        initializeGallery();
    } catch (error) {
        console.error("Error saving work:", error);
        alert('保存作品失败：' + error.message);
    }
});

// 事件监听
elements.addWork.addEventListener('click', () => {
    currentEditWork = null;
    elements.modalTitle.textContent = '添加作品';
    elements.workForm.reset();
    elements.imagePreview.innerHTML = '';
    elements.workModal.style.display = 'flex';
});

elements.cancelWork.addEventListener('click', () => {
    elements.workModal.style.display = 'none';
    elements.workForm.reset();
    elements.imagePreview.innerHTML = '';
    currentEditWork = null;
});

elements.closeDetail.addEventListener('click', () => {
    elements.detailModal.style.display = 'none';
});

// 工具函数
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}

// 初始化页面
initializeGallery(); 