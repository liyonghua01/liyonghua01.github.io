/* 全局样式和米色背景 */
* {
    margin: 0;
    padding: 0;
    box-spacing: border-box;
}

body {
    background-color: #f7e6cf; /* 复制目标图像的米色背景 */
    color: #000;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow: hidden; /* 防止出现滚动条 */
    height: 100vh;
    width: 100vw;
}

/* 全屏布局容器 */
.site-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    width: 100vw;
    padding: 20px;
}

/* Header 顶部栏样式 */
.site-header, .site-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    letter-spacing: 0.1em;
    padding: 10px 0;
    text-transform: uppercase;
}

.user-name { font-weight: bold; margin-right: 10px; }
.user-title { color: #555; }

.device-switcher {
    display: flex;
    gap: 15px;
    background-color: #d1b89c; /* 米色背景下的暗色块 */
    padding: 5px 15px;
    border-radius: 20px;
}
.device-item { cursor: pointer; color: #555; }
.device-item.active { color: #000; font-weight: bold; }

.header-right { text-align: right; }
.copyright { margin-right: 10px; }

/* Main 中央内容样式 (左右布局) */
.main-content {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin: 40px 0;
}

.content-left {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

/* Canvas 占据左侧的大部分空间并居中 */
#3d-avatar-canvas {
    width: 100%;
    height: 100%;
    display: block;
}

.content-right {
    width: 400px; /* 固定右侧文本宽度 */
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-left: 40px;
}

.about-title {
    font-size: 72px; /* 巨大的 About Me 标题 */
    font-weight: 300;
    line-height: 1.1;
}

.about-intro {
    font-size: 18px;
    line-height: 1.6;
    color: #333;
}

/* 社交图标样式 */
.social-icons {
    display: flex;
    gap: 15px;
    align-items: center;
}
.social-icons span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border: 1px solid #000;
    border-radius: 50%;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
}
.social-icons svg {
    width: 20px;
    height: 20px;
    fill: #000;
}

/* 滚动提示样式 */
.scroll-down {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #555;
    font-size: 12px;
    cursor: pointer;
}
.scroll-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 24px;
    border: 1px solid #555;
    border-radius: 8px;
}

/* Footer 底部栏样式 */
.footer-right { text-align: right; }
.footer-item { color: #555; }
.location-text { font-weight: bold; }
