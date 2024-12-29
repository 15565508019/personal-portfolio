// 创建 Profile 类（避免使用保留的 User 类名）
const Profile = AV.Object.extend('Profile');

// DOM 元素
const elements = {
    userName: document.getElementById('userName'),
    userTitle: document.getElementById('userTitle'),
    aboutMe: document.getElementById('aboutMe'),
    skillsGrid: document.getElementById('skillsGrid'),
    editModal: document.getElementById('editModal'),
    editInput: document.getElementById('editInput'),
    editTextarea: document.getElementById('editTextarea'),
    modalTitle: document.getElementById('modalTitle'),
    saveEdit: document.getElementById('saveEdit'),
    cancelEdit: document.getElementById('cancelEdit'),
    avatarInput: document.getElementById('avatarInput'),
    avatar: document.getElementById('avatar')
};

// 当前编辑状态
let currentEditField = null;
let currentUser = null;

// 初始化数据
async function initializeData() {
    try {
        const query = new AV.Query('Profile');
        const results = await query.find();
        
        if (results.length > 0) {
            currentUser = results[0];
            const data = currentUser.toJSON();
            elements.userName.textContent = data.name || 'CJF';
            elements.userTitle.textContent = data.title || '职业头衔 / 身份';
            elements.aboutMe.textContent = data.about || '在这里添加个人简介...';
            elements.avatar.src = data.avatarUrl || 'avatar.jpg';
            
            if (data.skills) {
                renderSkills(data.skills);
            }
        } else {
            // 创建新用户档案
            const profile = new Profile();
            profile.set('name', 'CJF');
            profile.set('title', '职业头衔 / 身份');
            profile.set('about', '在这里添加个人简介...');
            profile.set('skills', []);
            currentUser = await profile.save();
        }
    } catch (error) {
        console.error("Error loading data:", error);
        alert('加载数据失败：' + error.message);
    }
}

// 渲染技能标签
function renderSkills(skills) {
    elements.skillsGrid.innerHTML = '';
    skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <span class="remove-skill" onclick="removeSkill('${skill}')">&times;</span>
        `;
        elements.skillsGrid.appendChild(skillTag);
    });
}

// 编辑处理函数
function handleEdit(field, isTextarea = false) {
    currentEditField = field;
    elements.modalTitle.textContent = `编辑${getFieldTitle(field)}`;
    
    const currentValue = elements[field].textContent;
    if (isTextarea) {
        elements.editTextarea.style.display = 'block';
        elements.editInput.style.display = 'none';
        elements.editTextarea.value = currentValue;
    } else {
        elements.editTextarea.style.display = 'none';
        elements.editInput.style.display = 'block';
        elements.editInput.value = currentValue;
    }
    
    elements.editModal.style.display = 'flex';
}

// 保存编辑
async function saveEdit() {
    if (!currentUser) {
        alert('数据未初始化，请刷新页面重试');
        return;
    }

    const value = elements.editTextarea.style.display === 'block' 
        ? elements.editTextarea.value 
        : elements.editInput.value;

    try {
        const key = getFieldKey(currentEditField);
        currentUser.set(key, value);
        await currentUser.save();
        
        elements[currentEditField].textContent = value;
        elements.editModal.style.display = 'none';
    } catch (error) {
        console.error("Error saving data:", error);
        alert('保存失败，请重试：' + error.message);
    }
}

// 添加技能
async function addSkill() {
    if (!currentUser) {
        alert('数据未初始化，请刷新页面重试');
        return;
    }

    const skillName = prompt('请输入技能名称：');
    if (!skillName) return;

    try {
        const currentSkills = currentUser.get('skills') || [];
        if (!currentSkills.includes(skillName)) {
            currentSkills.push(skillName);
            currentUser.set('skills', currentSkills);
            await currentUser.save();
            renderSkills(currentSkills);
        }
    } catch (error) {
        console.error("Error adding skill:", error);
        alert('添加技能失败：' + error.message);
    }
}

// 移除技能
window.removeSkill = async function(skill) {
    if (!currentUser) {
        alert('数据未初始化，请刷新页面重试');
        return;
    }

    try {
        const currentSkills = currentUser.get('skills') || [];
        const newSkills = currentSkills.filter(s => s !== skill);
        currentUser.set('skills', newSkills);
        await currentUser.save();
        renderSkills(newSkills);
    } catch (error) {
        console.error("Error removing skill:", error);
        alert('移除技能失败：' + error.message);
    }
}

// 头像上传处理
async function handleAvatarChange(event) {
    if (!currentUser) {
        alert('数据未初始化，请刷新页面重试');
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    try {
        const avFile = new AV.File(file.name, file);
        const savedFile = await avFile.save();
        const avatarUrl = savedFile.url();
        
        currentUser.set('avatarUrl', avatarUrl);
        await currentUser.save();
        elements.avatar.src = avatarUrl;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        alert('头像上传失败：' + error.message);
    }
}

// 工具函数
function getFieldTitle(field) {
    const titles = {
        userName: '名称',
        userTitle: '职业头衔',
        aboutMe: '个人简介'
    };
    return titles[field] || '';
}

function getFieldKey(field) {
    const keys = {
        userName: 'name',
        userTitle: 'title',
        aboutMe: 'about'
    };
    return keys[field] || field;
}

// 事件监听
document.getElementById('editName').addEventListener('click', () => handleEdit('userName'));
document.getElementById('editTitle').addEventListener('click', () => handleEdit('userTitle'));
document.getElementById('editAbout').addEventListener('click', () => handleEdit('aboutMe', true));
document.getElementById('addSkill').addEventListener('click', addSkill);
document.getElementById('editAvatar').addEventListener('click', () => elements.avatarInput.click());
elements.avatarInput.addEventListener('change', handleAvatarChange);
elements.saveEdit.addEventListener('click', saveEdit);
elements.cancelEdit.addEventListener('click', () => elements.editModal.style.display = 'none');

// 初始化
initializeData(); 