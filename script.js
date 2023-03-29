import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//variables
let scene, camera, renderer, orbitControls;

const textureLoader = new THREE.TextureLoader();
const color = new THREE.Color();
const groupRight = new THREE.Object3D();
const groupLeft = new THREE.Object3D();

///// for collision detection
let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
let ballBB;

initThree();
createLights();
createGround();
createBar();
createXylophone();

function initThree(){
     scene = new THREE.Scene();
     scene.background = new THREE.Color(0x111111);
     scene.fog = new THREE.Fog(0x333333, 1, 180);
     camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth/window.innerHeight,
          0.1,
          1000
     )
     camera.position.set(0, 1, 12);
     camera.lookAt(0, 0, 0);
     renderer = new THREE.WebGLRenderer({antialias: true, 
     canvas: canvas});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.domElement);
     renderer.shadowMap.enabled = true;

     orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.005;

     const axesHelper = new THREE.AxesHelper(5);
     scene.add(axesHelper);
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0x333333, 0.8);
     scene.add(ambientLight);
     const dirLight = new THREE.DirectionalLight(0xffffff, 1);
     dirLight.position.set(5, 30, -5);
     scene.add(dirLight);
     dirLight.castShadow = true;
     dirLight.shadow.mapSize.width = 1024;
     dirLight.shadow.mapSize.height = 1024;
     const d = 20;
     dirLight.shadow.camera.top = d;
     dirLight.shadow.camera.right = d;
     dirLight.shadow.camera.bottom = -d;
     dirLight.shadow.camera.left = -d;
     dirLight.shadow.camera.near = 0.1;
     dirLight.shadow.camera.far = 100;

     const pointLight = new THREE.PointLight(0xffffff, 0.6);
     pointLight.position.set(0, 8, 5);
     scene.add(pointLight);
}

function createGround(){
     const stoneTextureColor = textureLoader.load('./texture/Wall_Stone_022_SD/Wall_Stone_022_basecolor.jpg');
     const stoneTextureRoughness = textureLoader.load('./texture/Wall_Stone_022_SD/Wall_Stone_022_roughness.jpg');
     const stoneTextureNormal = textureLoader.load('./texture/Wall_Stone_022_SD/Wall_Stone_022_normal.jpg');

     const planeGeometry = new THREE.PlaneGeometry(50, 50);
     const planeMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: stoneTextureColor,
          normalMap: stoneTextureNormal,
          normalScale: new THREE.Vector2(5, 5),
          roughness: 1,
          roughnessMap: stoneTextureRoughness
     }) 
     const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
     mesh.rotation.x = -Math.PI/2;
     mesh.receiveShadow = true;
     mesh.position.set(0, -4, -10);
     scene.add(mesh);
}

///// instruments /////

function createCubeMesh(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          color: color
     })
     const cubeMesh = new THREE.Mesh(geometry, material);
     cubeMesh.castShadow = true;
     cubeMesh.receiveShadow = true;
     scene.add(cubeMesh);
     return cubeMesh;
}


function createXylophone(){
     for(let i = 0; i < 12; i++){
          const cube = createCubeMesh();
          cube.material.color = new THREE.Color(`hsl(${i*21.24}, 100%, 50%)`);
          cube.position.set(13.85 + (i * 0.07), 3, -i * 1.25);
          cube.scale.set(0.25, i * 1.125 + 2, 1);
          groupRight.add(cube);     
          groupRight.rotation.z = Math.PI / 9;
          
          ///// for collision detection
          cubeBB.setFromObject(cube);
          cubeBB.name = `cubeBBR${i}`;
     } 
     
     for(let i = 0; i < 12; i++){
          const cube = createCubeMesh();
          cube.material.color = new THREE.Color(`hsl(${244 - i*21.24}, 100%, 50%)`);
          cube.position.set(-13.85 - (i * 0.07), 4, -i * 1.25);
          cube.scale.set(0.25, (13.75 - i * 1.125) + 2, 1);
          groupLeft.add(cube);  
          groupLeft.rotation.z = -Math.PI/9;  
          
          cubeBB.setFromObject(cube);
          cubeBB.name = `cubeBBL${i}`;          
          //console.log(cubeBB);
     } 
     scene.add(groupRight);
     scene.add(groupLeft);
};

function createBar(){
     const bar = createCubeMesh();
     bar.position.set(0, 12.5, -8);
     bar.scale.set(1, 1, 20);
     scene.add(bar);

     const beam = createCubeMesh();
     beam.position.set(0, 0, -17.5);
     beam.scale.set(2, 25.5, 2);
     scene.add(beam);

     const stone = createCubeMesh();
     stone.position.set(0, -4, -18);
     stone.scale.set(8, 2, 4);
     stone.material.color = 0x222222;
     scene.add(stone);
};



 
///////////////////


function createStringMesh(){
     const geometry = new THREE.CylinderGeometry(0.05, 0.05, 12);
     const material = new THREE.MeshStandardMaterial({
          color: 0xeeffee,
     })
     const string = new THREE.Mesh(geometry, material);
     string.castShadow = true;
     string.receiveShadow = true;
     scene.add(string);
     return string;
};

function createBallMesh(){
     const ballTextureColor = textureLoader.load('./textures/Metal043A_1K-JPG/Metal043A_1K_Color.jpg');
     const ballTextureRoughness = textureLoader.load('./textures/Metal043A_1K-JPG/Metal043A_1K_Roughness.jpg');
     const geometry = new THREE.SphereGeometry(0.56);
     const material = new THREE.MeshStandardMaterial({
          //color: 0x00ff00,
          map: ballTextureColor,
          roughness: 1,
          roughnessMap: ballTextureRoughness,
          metalness: 0.2
     })
     const ball = new THREE.Mesh(geometry, material);
     ball.castShadow = true;
     ball.receiveShadow = true;
     scene.add(ball);
     return ball;
};

class Pendulum {
     constructor(stringMesh, ballMesh, frequency, amplitude){
          
          this.string = stringMesh;
          this.ball = ballMesh;
          this.frequency = frequency;
          this.amplitude = amplitude;
     }
     update(totalTime){
          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);
     }
};

function createPendulum(origin, frequency, amplitude){
     const stringMesh = createStringMesh();
     stringMesh.position.add(origin);
     stringMesh.translateY(12);
     stringMesh.geometry.translate(0, -6, 0);

     const ballMesh = createBallMesh();
     ballMesh.position.add(origin);
     ballMesh.translateY(12);
     ballMesh.geometry.translate(0, -12.5, 0);

     ///// for collision detection
     ballBB = new THREE.Sphere(ballMesh.position, 0.7);
     ballBB.name = 'ball';
     //console.log(ballBB);

     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
     return pendulum;
};

const pendulums = [];
for(let i = 0; i < 12; i++){
     const pendulum = createPendulum(new THREE.Vector3(0, 0, -i * 1.25), 1.2 + i * 0.0125, 1.2 + i * 0.01);
     pendulums.push(pendulum);
}; 

/* for(let i = 0; i < 7; i++){
     const pendulum = createPendulum(new THREE.Vector3(0, 0, 0), 1.2 + i * 0.0125, 3.14/4);
     pendulums.push(pendulum);
};  */

let startTime = null;
//let lastTime = null;

function animate(time){
     if(startTime == null){
          startTime = time;
     }
     //if(lastTime == null){
          //lastTime = time;
     //}
     //const deltaTime = time - lastTime;
     //lastTime = time;
     const totalTime = time - startTime;
     update(totalTime);
     renderer.render(scene, camera);
     window.requestAnimationFrame(animate);
}

function update(totalTime){
          pendulums.forEach((p) => {p.update(totalTime);
          orbitControls.update();
     });
};

animate();
//console.log(pendulums);

///// collision detection but did not working why?????
let collision = ballBB.intersectsBox(cubeBB);
if(collision) console.log('hit sound');

window.addEventListener('resize', () => {
     const aspect = window.innerWidth/window.innerHeight;
     camera.aspect = aspect;
     camera.updateProjectionMatrix();
     camera.position.z = Math.max(8/aspect, 6);
     camera.lookAt(0, 0, 0);
     renderer.setSize(window.innerWidth, window.innerHeight);
});