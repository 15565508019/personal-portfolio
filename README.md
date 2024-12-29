# 个人主页项目说明文档

## 项目概述
这是一个基于 HTML、CSS 和 JavaScript 开发的个人主页网站，使用 LeanCloud 作为后端服务。网站包含个人信息、工作经历、图文作品和影像作品四个主要板块。

## 技术栈
- 前端：HTML5、CSS3、JavaScript
- 后端：LeanCloud
- 存储：LeanCloud Storage
- 部署：Netlify

## 项目结构
```
├── index.html          # 首页
├── about.html         # 个人信息页面
├── experience.html    # 工作经历页面
├── gallery.html       # 图文作品页面
├── videos.html        # 影像作品页面
├── styles.css         # 样式文件
├── about.js          # 个人信息页面脚本
├── gallery.js        # 图文作品页面脚本
├── videos.js         # 影像作品页面脚本
├── experience.js     # 工作经历页面脚本
├── leancloud-config.js # LeanCloud 配置文件
└── backgrounds/      # 背景图片目录
    ├── about-bg.jpg
    ├── experience-bg.jpg
    ├── gallery-bg.jpg
    └── videos-bg.jpg
```

## 功能说明

### 1. 个人信息页面（about.html）
- 个人头像上传和更换
- 姓名和职业头衔编辑
- 个人简介编辑
- 技能标签的添加和删除
- 所有修改自动保存到云端

### 2. 工作经历页面（experience.html）
- 时间轴形式展示工作经历
- 支持添加、编辑和删除经历
- 按时间顺序自动排序
- 响应式布局适配

### 3. 图文作品页面（gallery.html）
- 网格布局展示作品
- 支持作品图片上传
- 作品信息编辑（标题、描述、日期、标签）
- 作品详情查看
- 删除作品功能

### 4. 影像作品页面（videos.html）
- 视频作品展示
- 支持视频上传和缩略图设置
- 视频信息编辑
- 在线播放功能
- 视频时长显示

## 配置说明

### LeanCloud 配置
1. 注册 [LeanCloud](https://console.leancloud.app/) 账号
2. 创建应用
3. 获取应用凭证：
   - App ID
   - App Key
   - Server URL
4. 修改 `leancloud-config.js` 文件：
```javascript
AV.init({
    appId: "你的App ID",
    appKey: "你的App Key",
    serverURL: "你的Server URL"
});
```

### 安全设置
1. 在 LeanCloud 控制台中设置安全域名
2. 添加部署域名到 Web 安全域名列表
3. 开启 CORS 支持

## 部署说明

### Netlify 部署
1. 注册 [Netlify](https://www.netlify.com/) 账号
2. 创建新站点
3. 上传项目文件或连接 Git 仓库
4. 设置自定义域名（可选）

### 本地开发
1. 克隆项目到本地
2. 配置 LeanCloud 凭证
3. 使用本地服务器运行项目（如 Live Server）
4. 在浏览器中访问 `http://localhost:端口号`

## 注意事项
1. 确保 LeanCloud 配置正确
2. 上传文件大小限制：
   - 图片：不超过 10MB
   - 视频：不超过 100MB
3. 定期备份重要数据
4. 注意浏览器兼容性
5. 移动端适配已优化

## 常见问题
1. 如果遇到 CORS 错误，检查：
   - LeanCloud 安全域名设置
   - serverURL 配置是否正确
   
2. 如果上传失败，检查：
   - 文件大小是否超限
   - 网络连接是否正常
   - LeanCloud 存储容量是否足够

3. 如果编辑无法保存，检查：
   - LeanCloud 配置是否正确
   - 控制台是否有错误信息

## 技术支持
如有问题，请通过以下方式获取帮助：
1. 查看 [LeanCloud 文档](https://leancloud.cn/docs/)
2. 提交 Issue
3. 联系技术支持 