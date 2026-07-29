const canvas = document.getElementById('3d-avatar-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

// 让 Canvas 铺满整个屏幕
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
// 镜头拉远一点，防止人物太大
camera.position.set(0, 1.2, 4.5); 

// 添加打光，让人物看起来真实
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(2, 2, 2);
scene.add(dirLight);

let avatar, leftEye, rightEye;
let mouseX = 0, mouseY = 0;

// 调用真实 3D 模型加载器
const loader = new THREE.GLTFLoader();

// 加载你 GitHub 仓库里的 avatar.glb
loader.load('avatar.glb', function(gltf) {
    avatar = gltf.scene;
    
    // 缩放和调整模型上下位置
    avatar.scale.set(1.5, 1.5, 1.5);
    avatar.position.y = -1.2; 
    // 把人物往左移一点，避免和右侧文字重叠
    avatar.position.x = -1; 
    
    scene.add(avatar);

    // 寻找并绑定眼睛骨骼
    avatar.traverse((child) => {
        if (child.isBone || child.isMesh) {
            console.log("模型节点:", child.name); // 查错用的“侦察兵”
            
            const name = child.name.toLowerCase();
            if (name.includes('lefteye') || name.includes('eye_l')) leftEye = child;
            if (name.includes('righteye') || name.includes('eye_r')) rightEye = child;
        }
    });
}, undefined, function(error) {
    console.error('模型加载失败，请检查文件是否在仓库内:', error);
});

// 监听鼠标移动
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 动画渲染循环
function animate() {
    requestAnimationFrame(animate);

    if (avatar) {
        // 头部的轻微摆动跟随
        avatar.rotation.y = THREE.MathUtils.lerp(avatar.rotation.y, mouseX * 0.4, 0.05);
        avatar.rotation.x = THREE.MathUtils.lerp(avatar.rotation.x, -mouseY * 0.2, 0.05);

        // 眼球的精准跟随
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

// 窗口缩放自适应
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
