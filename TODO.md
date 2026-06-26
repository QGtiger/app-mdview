# MdView 开发 TODO

> 按访谈确认的方案拆解，先完成 MVP，再逐步推进 v2。

## MVP

- [x] 方案确认（匿名短链、公开广场可选、跟随系统主题）
- [x] 清理模板示例代码
- [x] 数据库 Schema：`shares` 表
- [x] 执行 `npx lightfish-server db push`
- [x] 安装 Markdown 渲染依赖
- [x] 后端接口：`POST /shares`、`GET /shares/:slug`、`DELETE /shares/:slug`、`GET /shares/public/list`
- [x] Markdown 渲染组件（GFM + 代码高亮 + LaTeX + Mermaid + XSS 过滤）
- [x] 首页：创建表单 + 实时预览 + 公开广场列表
- [x] 分享详情页
- [x] 创建成功页（分享链接 + 删除链接）
- [x] 「我的分享」页（基于 localStorage）
- [x] 404 页
- [x] 全局样式与布局
- [x] ESLint 与 build 通过

## v2（用户系统上线后）

- [ ] 用户注册 / 登录
- [ ] 分享归属到用户，服务器端存储「我的分享」
- [ ] 图片本地上传 / 粘贴截图
- [ ] OG 社交卡片（服务端注入 meta）
- [ ] 阅读量统计 + 热门排序
- [ ] IP 限流 + 内容审核 / 举报
- [ ] 主题切换与自定义主题
- [ ] 导出图片 / PDF
