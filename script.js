const canvas = document.getElementById('3d-avatar-canvas');
const container = document.querySelector('.content-left'); // 抓取左侧 70% 的容器
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

// 让 3D 渲染器的尺寸完美匹配左侧的 70% 空间
renderer.setSize(container.clientWidth, container.clientHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
// 镜头拉近一点
camera.position.set(0, 1.2, 3.5); 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(2, 2, 2);
scene.add(dirLight);

let avatar, leftEye, rightEye;
let mouseX = 0, mouseY = 0;

const loader = new THREE.GLTFLoader();

loader.load('avatar.glb', function(gltf) {
    avatar = gltf.scene;
    
    // ★ 核心调整：放大模型并在 70% 空间内居中 ★
    avatar.scale.set(2.2, 2.2, 2.2); // 将模型放大，使其占据主体视觉
    avatar.position.set(0, -1.9, 0); // X 设为 0 (在左侧完全居中)，Y 轴向下调保证胸部以上完美展示
    
    scene.add(avatar);

    avatar.traverse((child) => {
        if (child.isBone || child.isMesh) {
            const name = child.name.toLowerCase();
            if (name.includes('lefteye') || name.includes('eye_l')) leftEye = child;
            if (name.includes('righteye') || name.includes('eye_r')) rightEye = child;
        }
    });
}, undefined, function(error) {
    console.error('模型加载失败:', error);
});

// 监听鼠标移动 (坐标基准依然是整个屏幕)
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    if (avatar) {
        avatar.rotation.y = THREE.MathUtils.lerp(avatar.rotation.y, mouseX * 0.4, 0.05);
        avatar.rotation.x = THREE.MathUtils.lerp(avatar.rotation.x, -mouseY * 0.2, 0.05);

        if (leftEye && rightEye) {
            leftEye.rotation.y = mouseX * 0.5;
            leftEye.rotation.x = -mouseY * 0.5;
            rightEye.rotation.y = mouseX * 0.5;
            rightEye.rotation.x = -mouseY * 0.5;
        }
    }
    renderer.render(scene, camera);
}
animate();

// 窗口大小改变时自动适应 70% 比例
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
