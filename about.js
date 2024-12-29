// LeanCloud 初始化
AV.init({
    appId: "Rmjt9JQI4XIFDWolH1dBHMrx-MdYXbMMI",
    appKey: "Kd5npH3UL1rfKGVnVCQXnCHy",
    serverURL: "https://rmjt9jqi.api.lncldglobal.com"
});

// 全局变量
let currentProfile = null;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    setupEventListeners();
});

// 加载个人信息
async function loadProfile() {
    try {
        const query = new AV.Query('Profile');
        const profile = await query.first();
        
        if (profile) {
            currentProfile = profile;
            updateUI(profile);
        } else {
            // 如果没有数据，创建默认数据
            await createDefaultProfile();
        }
    } catch (error) {
        showNotification('加载数据失败：' + error.message, 'error');
    }
}

// 更新界面显示
function updateUI(profile) {
    document.getElementById('name').textContent = profile.get('name') || '姓名';
    document.getElementById('title').textContent = profile.get('title') || '职业头衔';
    document.getElementById('bio').textContent = profile.get('bio') || '在这里添加个人简介...';
    document.getElementById('avatar').src = profile.get('avatar') || 'placeholder-avatar.jpg';
    
    // 更新技能标签
    const skillsContainer = document.getElementById('skillsContainer');
    skillsContainer.innerHTML = '';
    const skills = profile.get('skills') || [];
    skills.forEach(skill => {
        const skillTag = createSkillTag(skill);
        skillsContainer.appendChild(skillTag);
    });
}

// 创建技能标签
function createSkillTag(skill) {
    const div = document.createElement('div');
    div.className = 'skill-tag';
    div.textContent = skill;
    return div;
}

// 设置事件监听
function setupEventListeners() {
    // 编辑资料按钮
    document.getElementById('editProfile').addEventListener('click', () => {
        if (!currentProfile) return;
        
        const name = prompt('请输入姓名:', currentProfile.get('name'));
        if (name === null) return;
        
        const title = prompt('请输入职业头衔:', currentProfile.get('title'));
        if (title === null) return;
        
        const bio = prompt('请输入个人简介:', currentProfile.get('bio'));
        if (bio === null) return;
        
        updateProfile({ name, title, bio });
    });

    // 更换头像
    document.getElementById('uploadAvatar').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = handleAvatarChange;
        input.click();
    });

    // 添加技能
    document.getElementById('addSkill').addEventListener('click', () => {
        const skill = prompt('请输入技能名称:');
        if (!skill) return;
        
        const skills = currentProfile.get('skills') || [];
        skills.push(skill);
        updateProfile({ skills });
    });
}

// 处理头像更改
async function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const avFile = new AV.File(file.name, file);
        await avFile.save();
        updateProfile({ avatar: avFile.url() });
    } catch (error) {
        showNotification('上传头像失败：' + error.message, 'error');
    }
}

// 更新个人信息
async function updateProfile(data) {
    try {
        Object.keys(data).forEach(key => {
            currentProfile.set(key, data[key]);
        });
        
        await currentProfile.save();
        updateUI(currentProfile);
        showNotification('更新成功', 'success');
    } catch (error) {
        showNotification('更新失败：' + error.message, 'error');
    }
}

// 创建默认个人信息
async function createDefaultProfile() {
    try {
        const Profile = AV.Object.extend('Profile');
        const profile = new Profile();
        
        profile.set('name', '姓名');
        profile.set('title', '职业头衔');
        profile.set('bio', '在这里添加个人简介...');
        profile.set('skills', []);
        
        currentProfile = await profile.save();
        updateUI(currentProfile);
    } catch (error) {
        showNotification('创建默认数据失败：' + error.message, 'error');
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 