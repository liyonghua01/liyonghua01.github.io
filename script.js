// 初始化全屏 Three.js 视口
const canvas = document.getElementById('3d-avatar-canvas');
const siteWrapper = document.querySelector('.site-wrapper');
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0xf7e6cf, 1); // 设置背景色与 CSS 一致

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 5;

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 加载纹理 (核心：加载你的源图像)
const textureLoader = new THREE.TextureLoader();
textureLoader.load('image_14.png', (texture) => {
    
    // --- 组件化 3D 头部模型拼装 ---
    
    // 1. 头部基座球体
    const headGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const headMaterial = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.1, roughness: 0.8 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    scene.add(head);

    // 2. 眼镜网格体 (受目标图像启发，使用简化的 CSS 和网格体实现)
    const glassesGeometry = new THREE.RingGeometry(0.35, 0.45, 32);
    const glassesMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const glasses = new THREE.Mesh(glassesGeometry, glassesMaterial);
    glasses.position.set(0, 0.25, 0.45); // 放在头部前面
    glasses.scale.set(1.4, 0.8, 1); // 形状
    scene.add(glasses);

    // 3. 单独的眼睛组件（两个瞳孔，模拟滑稽的视线跟随）
    const pupilGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.35, 0.25, 0.4); // 初始位置
    scene.add(leftPupil);
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.35, 0.25, 0.4); // 初始位置
    scene.add(rightPupil);

    // 4. 皱眉微调网格体 (通过微妙移动模拟表情随鼠标变化)
    const browGeometry = new THREE.PlaneGeometry(0.5, 0.1);
    const browMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-0.35, 0.45, 0.38);
    scene.add(leftBrow);
    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(0.35, 0.45, 0.38);
    scene.add(rightBrow);

    // 鼠标侦听和交互逻辑
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (event) => {
        // 计算归一化鼠标坐标 (-1 to 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 动画循环
    const animate = () => {
        requestAnimationFrame(animate);

        // --- 核心：眼睛跟随和滑稽微调逻辑 ---
        
        // 1. 微调头部旋转 (轻微旋转)
        head.rotation.y = mouse.x * 0.1;
        head.rotation.x = -mouse.y * 0.1;

        // 2. 微调眼镜旋转
        glasses.rotation.y = mouse.x * 0.1;
        glasses.rotation.x = -mouse.y * 0.1;

        // 3. 眼神跟随和“斗鸡眼”微调
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const headIntersects = raycaster.intersectObject(head);
        
        if (headIntersects.length > 0) {
            // 当鼠标移近头部（视线在脸上）时，让黑眼珠斗鸡眼
            const targetX = headIntersects[0].point.x * 0.1;
            const targetY = (headIntersects[0].point.y - 0.25) * 0.1; // 相对脸部中线移动
            
            leftPupil.position.x = THREE.MathUtils.lerp(leftPupil.position.x, -0.35 + targetX, 0.1);
            rightPupil.position.x = THREE.MathUtils.lerp(rightPupil.position.x, 0.35 - targetX, 0.1);
            
            leftPupil.position.y = THREE.MathUtils.lerp(leftPupil.position.y, 0.25 + targetY, 0.1);
            rightPupil.position.y = THREE.MathUtils.lerp(rightPupil.position.y, 0.25 + targetY, 0.1);
        } else {
            // 当鼠标离开时，让眼睛滑向鼠标
            leftPupil.position.x = THREE.MathUtils.lerp(leftPupil.position.x, -0.35 + mouse.x * 0.1, 0.1);
            rightPupil.position.x = THREE.MathUtils.lerp(rightPupil.position.x, 0.35 + mouse.x * 0.1, 0.1);
            leftPupil.position.y = THREE.MathUtils.lerp(leftPupil.position.y, 0.25 + mouse.y * 0.05, 0.1);
            rightPupil.position.y = THREE.MathUtils.lerp(rightPupil.position.y, 0.25 + mouse.y * 0.05, 0.1);
        }

        // 4. 表情微调：皱眉 (随鼠标垂直移动皱眉)
        browMaterial.opacity = THREE.MathUtils.clamp(-mouse.y * 0.5, 0, 0.2); // 鼠标向下时稍微显示，向下移动皱眉
        leftBrow.position.y = THREE.MathUtils.lerp(leftBrow.position.y, 0.45 + mouse.y * 0.02, 0.1);
        rightBrow.position.y = THREE.MathUtils.lerp(rightBrow.position.y, 0.45 + mouse.y * 0.02, 0.1);

        renderer.render(scene, camera);
    };
    animate();
});

// 响应窗口大小变化
window.addEventListener('resize', () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
});
