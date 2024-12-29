#!/bin/bash
echo "开始部署更新..."

# 拉取最新代码
git pull

# 添加所有更改
git add .

# 获取提交信息
echo "请输入更新说明: "
read commit_msg

# 提交更改
git commit -m "$commit_msg"

# 推送到远程仓库
git push

echo "部署完成！更新将在几分钟内生效。" 