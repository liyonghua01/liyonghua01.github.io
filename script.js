const pupils = document.querySelectorAll('.pupil');

document.addEventListener('mousemove', (e) => {
    // 获取鼠标在页面上的实时坐标
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    pupils.forEach(pupil => {
        // 获取每一只眼球容器的位置信息
        const eye = pupil.parentElement;
        const rect = eye.getBoundingClientRect();
        
        // 计算眼球中心位置的页面坐标
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        // 计算鼠标相对于眼球中心的偏移量
        const dx = mouseX - eyeCenterX;
        const dy = mouseY - eyeCenterY;

        // 计算角度 (使用 Math.atan2 获取弧度)
        const angle = Math.atan2(dy, dx);
        
        // 计算瞳孔移动的最大距离，防止跑出眼眶范围
        // 可以设置为眼眶宽度或高度的四分之一
        const maxDistance = Math.min(rect.width / 4, rect.height / 4); 
        
        // 计算实际的偏移距离，通过除以一个数值（例如 10）来降低敏感度，让移动更自然
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 10, maxDistance); 

        // 将角度和限制后的距离转换为新的 X 和 Y 轴偏移
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;

        // 应用 CSS transform 来更新瞳孔位置
        // 保持初始的 translate(-50%, -50%) 居中，再加上新的计算偏移量
        pupil.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px))`;
    });
});
