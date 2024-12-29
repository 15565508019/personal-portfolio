document.addEventListener('DOMContentLoaded', function() {
    const videosGrid = document.getElementById('videosGrid');
    const addVideoBtn = document.getElementById('addVideo');
    const editModal = document.getElementById('editVideoModal');
    const videoForm = document.getElementById('videoForm');
    const cancelBtn = document.getElementById('cancelVideo');
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = videoModal.querySelector('video');
    const closeButton = videoModal.querySelector('.close-modal');
    let currentEditingId = null;

    // 加载视频
    loadVideos();

    // 添加视频按钮
    addVideoBtn.addEventListener('click', () => {
        currentEditingId = null;
        videoForm.reset();
        editModal.style.display = 'block';
    });

    // 取消按钮
    cancelBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // 保存视频
    videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const thumbnailFile = document.getElementById('videoThumbnail').files[0];
        const videoFile = document.getElementById('videoFile').files[0];
        
        if (!thumbnailFile && !currentEditingId) {
            alert('请选择缩略图');
            return;
        }
        
        if (!videoFile && !currentEditingId) {
            alert('请选择视频文件');
            return;
        }

        try {
            const video = {
                id: currentEditingId || Date.now(),
                title: document.getElementById('videoTitle').value,
                description: document.getElementById('videoDesc').value,
                duration: document.getElementById('videoDuration').value
            };

            if (thumbnailFile) {
                video.thumbnail = await readFileAsDataURL(thumbnailFile);
            } else if (currentEditingId) {
                video.thumbnail = getVideos().find(v => v.id === currentEditingId).thumbnail;
            }

            if (videoFile) {
                video.videoUrl = await readFileAsDataURL(videoFile);
            } else if (currentEditingId) {
                video.videoUrl = getVideos().find(v => v.id === currentEditingId).videoUrl;
            }

            saveVideo(video);
            editModal.style.display = 'none';
            loadVideos();
        } catch (error) {
            alert('保存视频时出错：' + error.message);
        }
    });

    // 视频播放相关
    closeButton.addEventListener('click', () => {
        videoModal.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.src = '';
    });

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            videoPlayer.pause();
            videoPlayer.src = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.style.display === 'block') {
            videoModal.style.display = 'none';
            videoPlayer.pause();
            videoPlayer.src = '';
        }
    });

    function createVideoElement(video) {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
            <div class="video-thumbnail" onclick="playVideo('${video.videoUrl}')">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="play-button">
                    <svg viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <div class="edit-buttons">
                    <button onclick="event.stopPropagation(); editVideo(${video.id})">编辑</button>
                    <button onclick="event.stopPropagation(); deleteVideo(${video.id})">删除</button>
                </div>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <span class="video-duration">${video.duration}</span>
            </div>
        `;
        return div;
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    function loadVideos() {
        const videos = getVideos();
        videosGrid.innerHTML = '';
        videos.forEach(video => {
            videosGrid.appendChild(createVideoElement(video));
        });
    }

    async function getVideos() {
        try {
            const snapshot = await db.collection('videos').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting videos:', error);
            return [];
        }
    }

    async function saveVideo(video) {
        try {
            if (video.id) {
                await db.collection('videos').doc(video.id).set(video);
            } else {
                await db.collection('videos').add(video);
            }
        } catch (error) {
            console.error('Error saving video:', error);
            alert('保存失败，请重试');
        }
    }

    // 暴露给全局的函数
    window.playVideo = function(videoUrl) {
        videoPlayer.src = videoUrl;
        videoModal.style.display = 'block';
        videoPlayer.play();
    };

    window.editVideo = function(id) {
        const video = getVideos().find(v => v.id === id);
        if (video) {
            currentEditingId = id;
            document.getElementById('videoTitle').value = video.title;
            document.getElementById('videoDesc').value = video.description;
            document.getElementById('videoDuration').value = video.duration;
            editModal.style.display = 'block';
        }
    };

    async function deleteVideo(id) {
        try {
            await db.collection('videos').doc(id).delete();
            loadVideos();
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('删除失败，请重试');
        }
    }
}); 