import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {Reflector} from './js/Reflector.js';

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const toggles = {
     sound: document.getElementById('sound-toggle')
}

// 61 colors
const colors = [
     "#D0E7F5",
     "#D9E7F4",
     "#D6E3F4",
     "#BCDFF5",
     "#B7D9F4",
     "#C3D4F0",
     "#9DC1F3",
     "#9AA9F4",
     "#8D83EF",
     "#AE69F0",
     "#D46FF1",
     "#DB5AE7",
     "#D911DA",
     "#D601CB",
     "#E713BF",
     "#F24CAE",
     "#FB79AB",
     "#FFB6C1",
     "#FED2CF",
     "#FDDFD5",
     "#FEDCD1",
     "#D0E7F5",
     "#D9E7F4",
     "#D6E3F4",
     "#BCDFF5",
     "#B7D9F4",
     "#C3D4F0",
     "#9DC1F3",
     "#9AA9F4",
     "#8D83EF",
     "#AE69F0",
     "#D46FF1",
     "#DB5AE7",
     "#D911DA",
     "#D601CB",
     "#E713BF",
     "#F24CAE",
     "#FB79AB",
     "#FFB6C1",
     "#FED2CF",
     "#FDDFD5",
     "#FEDCD1",

     "#D0E7F5",
     "#D9E7F4",
     "#D6E3F4",
     "#BCDFF5",
     "#B7D9F4",
     "#C3D4F0",
     "#9DC1F3",
     "#9AA9F4",
     "#8D83EF",
     "#AE69F0",
     "#D46FF1",
     "#DB5AE7",
     "#D911DA",
     "#D601CB",
     "#E713BF",
     "#F24CAE",
     "#FB79AB",
     "#FFB6C1",
     "#FED2CF",
    
];

let soundEnabled = false;
let pulseEnabled = true;

const handleSoundToggle = (enabled = !soundEnabled) => {
     soundEnabled = enabled;
     toggles.sound.dataset.toggled = enabled;
}

document.onvisibilitychange = () => {
     handleSoundToggle(false);
}

document.onclick = () => {
     handleSoundToggle();
}

const getFileName = (index) => {
     return `key-${index}`;
}

const getURL = (index) => {
     return `./audios/nylon/${getFileName(index)}.mp3`;
}

 const keys = colors.map((color, index) => {
     const audio = new Audio(getURL(index));
     audio.currentTime = 0; 
     audio.volume = 0.5;
     return audio;
})

  const playKey = (index) => {
     keys[index].currentTime = 0;
     keys[index].play();
}

// second instrument //

const getURL2 = (index) => {
     return `./audios/pluck/${getFileName(index)}.mp3`;
}
const keys2 = colors.map((color, index) => {
     const audio = new Audio(getURL2(index));
     audio.currentTime = 0; 
     audio.volume = 0.5;
     return audio;
})

  const playKey2 = (index) => {
     keys2[index].currentTime = 0;
     keys2[index].play();
}

////////// THREE ////////////////////////

///// variables
let scene, camera, renderer, orbitControls;
let cameraFront, cameraTop, insetWidth, insetHeight;

const textureLoader = new THREE.TextureLoader();
const space = textureLoader.load('./assets/galaxy1.jpg');
// stone textures   
const stoneTextureColor = textureLoader.load('./textures/wall_stone/Wall_Stone_022_basecolor.jpg');
const stoneTextureRoughness = textureLoader.load('./textures/wall_stone/Wall_Stone_022_roughness.jpg');
const stoneTextureNormal = textureLoader.load('./textures/wall_stone/Wall_Stone_022_normal.jpg'); 

//metal textures
const metalTextureColor = textureLoader.load('./textures/metal/Metal043A_1K_Color.jpg');
const metalTextureRoughness = textureLoader.load('./textures/metal/Metal043A_1K_Roughness.jpg');

const color = new THREE.Color();
const groupRight = new THREE.Object3D();
const groupLeft = new THREE.Object3D();

let rightCubes = [];
let leftCubes = [];

initThree();
createLights();
createBar();
createVibraphone();
//cameraMove();
cameraFrontMove();
createGroundMirror();

//init Three //

function initThree(){
     scene = new THREE.Scene();
     scene.background = new THREE.Color(0x111111);
     scene.background = space;
     scene.fog = new THREE.Fog(0x555555, 1, 580);
     camera = new THREE.PerspectiveCamera(
          65,
          window.innerWidth/window.innerHeight,
          0.1,
          10000
     )
     camera.position.set(0, 0, 85);
     camera.lookAt(0, 0, 0);

     insetWidth = window.innerHeight * 0.40;
     insetHeight = window.innerHeight * 0.35;

     // camera top //
     cameraTop = new THREE.PerspectiveCamera(70, insetWidth/insetHeight, 1, 500);
     cameraTop.position.set(0, 90, 0);
     cameraTop.lookAt(0, 0, 0);
     cameraTop.name = 'cameraTop';
     
     //cameraFront
     
     cameraFront = new THREE.PerspectiveCamera( 70, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 5, 60);
     //cameraFront.lookAt(0, 0, 0);
     cameraFront.name = 'frontCamera';     

     renderer = new THREE.WebGLRenderer({antialias: true, 
     canvas: canvas});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     renderer.shadowMap.enabled = true;

     orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.04;  
}

//camera controls
function cameraMove(){
     let tl = gsap.timeline({repeat: 4, repeatDelay: 5});
     tl.to(camera.position, {z: 50, delay: 5, duration:12});
     tl.to(camera.position, {z: 30, duration:6});
     tl.to(camera.position, {z: 60, duration:6});
     tl.to(camera.position, {x: -30, duration: 8});
     tl.to(camera.position, {y: 60, duration: 8});
     tl.to(camera.position, {x: 38, duration:4});
     tl.to(camera.position, {x: 1, duration:2});
     tl.to(camera.position, {z: 0 , duration: 6});
     tl.to(camera.position, {y: 80 , duration: 12});
     tl.to(camera.position, {x: 10 * 0 , duration: 6});
     tl.to(camera.position, {z: 58, duration:6}); 
     tl.to(camera.position, {x: 60, duration:4}); 
     tl.to(camera.position, {x: -50, duration:6}); 
     tl.to(camera.position, {x: 1, duration:8});  
     tl.to(camera.position, {z: 100, duration:4});  
     tl.to(camera.position, {y: 30, duration:6});  
     tl.to(camera.position, {z: 0, duration:8});  
     tl.to(camera.position, {y: 20, duration:4});  
     tl.to(camera.position, {z: 150, duration:6});
}
//cameraFront controls
function cameraFrontMove(){
     let tl = gsap.timeline({repeat: 4, repeatDelay: 5});
     tl.to(cameraFront.position, {z: 50, delay: 5, duration:12});
     tl.to(cameraFront.position, {z: 10, duration:6});
     tl.to(cameraFront.position, {y: 10, duration:6});
     tl.to(cameraFront.position, {z: 20, duration:6});
     tl.to(cameraFront.position, {x: -50, duration: 8});
     tl.to(cameraFront.position, {y: 30, duration: 8});
     tl.to(cameraFront.position, {x: 55, duration:7});
     tl.to(cameraFront.position, {x: 0, duration:6});
     tl.to(cameraFront.position, {z: 30 , duration: 6});
     tl.to(cameraFront.position, {y: 20 , duration: 12});
     tl.to(cameraFront.position, {x: 60  , duration: 6});
     tl.to(cameraFront.position, {z: 38, duration:6}); 
     tl.to(cameraFront.position, {y: 10, duration:4}); 
     tl.to(cameraFront.position, {x: -60, duration:4}); 
     tl.to(cameraFront.position, {x: 1, duration:8});  
     tl.to(cameraFront.position, {z: 20, duration:4});  
     tl.to(cameraFront.position, {y: 0, duration:6});  
     tl.to(cameraFront.position, {z: 10, duration:8});  
     tl.to(cameraFront.position, {x: 0, duration:6}); 
     tl.to(cameraFront.position, {y: 20, duration:4});  
     tl.to(cameraFront.position, {z: 50, duration:6});
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0xcccccc, 0.51);
     scene.add(ambientLight);
     const dirLight = new THREE.DirectionalLight(0xffffff, 0.51);
     dirLight.position.set(5, 150, 50);
     scene.add(dirLight);
     dirLight.castShadow = true;
     dirLight.shadow.mapSize.width = 1024;
     dirLight.shadow.mapSize.height = 1024;
     const d = 150;
     dirLight.shadow.camera.top = d;
     dirLight.shadow.camera.right = d;
     dirLight.shadow.camera.bottom = -d;
     dirLight.shadow.camera.left = -d;
     dirLight.shadow.camera.near = 0.1;
     dirLight.shadow.camera.far = 100;

     const pointLight = new THREE.PointLight(0xffffff, 0.5);
     pointLight.position.set(0, 20, 25);
     scene.add(pointLight);

     const greenLight = new THREE.PointLight(0x00ff00, 0.5, 1000, 0);
     greenLight.position.set(550, 50, 0);
     scene.add(greenLight);

     const redLight = new THREE.PointLight(0xff0000, 0.5, 1000, 0);
     redLight.position.set(-550, 50, 0);
     scene.add(redLight);

     const blueLight = new THREE.PointLight(0x0000ff, 0.5, 1000, 0);
     greenLight.position.set(0, 50, 550);
     scene.add(blueLight);
}

function createCube(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          transparent: true,
          opacity: 1
     })
     const cubeMesh = new THREE.Mesh(geometry, material);
     cubeMesh.castShadow = true;
     cubeMesh.receiveShadow = true;
     scene.add(cubeMesh);
     return cubeMesh;
}

///// create Bar Beam Stone
function createBar(){
     const bar = createCube();
     bar.position.set(27.5, 31.5, 0);
     bar.scale.set(1, 1, 50);
     scene.add(bar);

     const bar2 = createCube();
     bar2.position.set(-27.5, 31.5, 0);
     bar2.scale.set(1, 1, 50);
     scene.add(bar2);

     const beam = createCube();
     beam.position.set(27.5, 10, -18);
     beam.scale.set(2, 55, 2);
     scene.add(beam);

     const beam2 = createCube();
     beam2.position.set(-27.5, 10, -18);
     beam2.scale.set(2, 55, 2);
     scene.add(beam2);

     const stone = createCube();
     stone.position.set(27.5, -18, -18);
     stone.scale.set(18, 8, 10);
     stone.material.color = 0xffffff;
     stone.material.map = stoneTextureNormal;
     scene.add(stone);

     const stone2 = createCube();
     stone2.position.set(-27.5, -18, -18);
     stone2.scale.set(18, 8, 10);
     stone2.material.color = 0xffffff;
     stone2.material.map = stoneTextureColor;
     scene.add(stone2);
}

///// Vibraphone right/left
function createVibraphone(){
     for(let i = 0; i < 21; i++){
          const cube = createCube();
          cube.material.color = new THREE.Color(colors[i]);
          //cube.scale.set(1.5, i * 0.5 + 5, 0.5);
          cube.scale.set(1.5, 15 - (i * 0.5), 1);
          cube.position.set(6 + i * 2 , 12 + (i * 0.25),  0.18);
          rightCubes.push(cube);
          groupRight.add(cube);
          groupRight.rotation.y = Math.PI / 2;
          //groupRight.position.set(26.5, 0, 30);
          groupRight.position.set(54.75, 0, 30);
     }
     scene.add(groupRight);
8
     for(let i = 0; i < 21; i++){
          const cube = createCube();
          cube.material.color = new THREE.Color(colors[i]);
          //cube.scale.set(1.5, i * 0.5 + 5, 0.5);
          cube.scale.set(1.5, 15 - (i * 0.5), 1);
          cube.position.set(-6 - (i * 2.02), 12 + (i * 0.25),  0.18);
          leftCubes.push(cube);
          groupLeft.add(cube);
          groupLeft.rotation.y = -Math.PI / 2;
          groupLeft.position.set(-54.75, 0, 30);
     }
     scene.add(groupLeft);
}

///// pendulum string mesh / ball mesh

let ballRadius = 1.5;
let stringLength = 31;
let stringWidth = 0.2;
const maxPendulum = 21;

function createStringMesh(){
     const geometry = new THREE.CylinderGeometry(stringWidth, stringWidth, stringLength);
     const material = new THREE.MeshStandardMaterial({
          color: 0xeeffee,

     })
     const string = new THREE.Mesh(geometry, material);
     string.position.set(0, 0, 0);
     string.castShadow = true;
     string.receiveShadow = true;
     scene.add(string);
     return string;
}

function createBallMesh(){
     const geometry = new THREE.SphereGeometry(ballRadius, 30);
     const material = new THREE.MeshStandardMaterial({
          map: metalTextureColor,
          roughness: 1,
          roughnessMap: metalTextureRoughness,
          metalness: 0.2
     })
     const ball = new THREE.Mesh(geometry, material);
     ball.castShadow = true;
     ball.receiveShadow = true;
     scene.add(ball);     
     return ball;
}

class Pendulum {
     constructor(string, ball, frequency, amplitude){
          this.string = string;
          this.ball = ball;
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
     stringMesh.translateY(stringLength);
     stringMesh.geometry.translate(0, -(stringLength * 0.5), 0);

     const ballMesh = createBallMesh();
     ballMesh.position.add(origin);
     ballMesh.translateY(stringLength);
     ballMesh.geometry.translate(0, -stringLength, 0);

    
     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
     return pendulum;
};

const pendulums = [];
const pendulums2 = [];
for(let i = 0; i < maxPendulum; i++){
     const pendulum = createPendulum(new THREE.Vector3(27.56, 0, -i * 2 + 24), i * 0.0125 + 1, 1.025);
     pendulums.push(pendulum);
}; 
// second pendulum
for(let i = 0; i < maxPendulum; i++){
     const pendulum2 = createPendulum(new THREE.Vector3(-27.5, 0, -i * 2 + 24), i * 0.0125 + 1, -1.025);
     pendulums2.push(pendulum2);
}; 

///// Ground Mirror Reflector /////

function createGroundMirror(){
     const groundGeo = new THREE.PlaneGeometry(300, 200);
     const groundMat = new THREE.MeshStandardMaterial({
          color: 0x111,
          transparent: true,
          opacity: 0.9,
     })
     const screen = new THREE.Mesh(groundGeo, groundMat);
     screen.rotation.x = -Math.PI/2;
     screen.position.y = -19.5;
     scene.add(screen);
     const groundMirror = new Reflector(groundGeo, {
          clipBias: 0.003,
          textureWidth: window.innerWidth * window.devicePixelRatio,
          textureHeight: window.innerHeight * window.devicePixelRatio,
          color: 0x555555,
          //transparent: true,
          //opacity: 0.1,
          //roughness: 0.5
     })
     groundMirror.position.y = -20;
     groundMirror.rotation.x = -Math.PI/2;
     scene.add(groundMirror);

}

let startTime = null;

function animate(time){
     if(startTime == null){
          startTime = time;
     }
    
     const totalTime = time - startTime;
     update(totalTime);

     renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);// need for cameraFront
     renderer.render(scene, camera);
     window.requestAnimationFrame(animate);

     //for cameraFront
     renderer.clearDepth();
     renderer.setScissorTest(true);
     // front
     renderer.setScissor(window.innerWidth - insetWidth - 8,  insetHeight / 4 - 15,
          insetWidth, insetHeight);
     renderer.setViewport(window.innerWidth - insetWidth - 8,  insetHeight / 4 - 15, insetWidth, insetHeight + 16);
     renderer.render(scene, cameraFront);
     // top
     renderer.setScissor(16,  insetHeight / 4 - 15,
          insetWidth, insetHeight);
     renderer.setViewport(16,  insetHeight / 4 - 15, insetWidth, insetHeight + 16);
     renderer.render(scene, cameraTop);
     
     renderer.setScissorTest(false);
}

function update(totalTime){
     orbitControls.update();
     pendulums.forEach((p, index) => {
          p.update(totalTime);

          
          if(p.ball.rotation.z >= (1 + index * 0.001245)) {
               if(soundEnabled){
                    playKey(index + 12);
               }
               if(pulseEnabled){
                    gsap.to(rightCubes[index].position, {y: index/2 + 25, duration: 1, ease: 'power3'}) ;
                    gsap.to(rightCubes[index].material, {opacity: 1, duration: 0.1}) ; 
                    gsap.to(rightCubes[index].position, {y: index/4 + 12, duration: 2}) ;
                    //gsap.to(rightCubes[index].rotation, {y: 360, duration: 2}) ;
                    gsap.to(rightCubes[index].material, {opacity: 0.76, duration: 2}) ; 
               }
               
          } 
     });

     pendulums2.forEach((p, index) => {
          p.update(totalTime);
          if(p.ball.rotation.z <= -(1 + index * 0.001245)) {
               if(soundEnabled){
                    playKey2(index + 30);
                    //keys[index + 20].currentTime = 0;
                    //keys[index + 20].play();
               }
               if(pulseEnabled){
                    gsap.to(leftCubes[index].position, {y: 25 + (index/2), duration: 1, ease: 'power3'}) ;
                    gsap.to(leftCubes[index].material, {opacity: 1, duration: 0.1}) ; 
                    gsap.to(leftCubes[index].position, {y: 12 + (index * 0.25), duration: 2}) ;  
                    gsap.to(leftCubes[index].material, {opacity: 0.76, duration: 2}) ; 
               }
          } 
     })
     
};

animate();

window.addEventListener('resize', () => {
     const aspect = window.innerWidth/window.innerHeight;
     camera.aspect = aspect;
     camera.updateProjectionMatrix();
     //camera.position.z = Math.max(8/aspect, 6);
     camera.lookAt(0, 0, 0);
     renderer.setSize(window.innerWidth, window.innerHeight);

     insetWidth = window.innerHeight * 0.35;
     insetHeight = window.innerHeight * 0.35;
     cameraFront.aspect = insetWidth / insetHeight;
     cameraFront.updateProjectionMatrix();
     cameraTop.aspect = insetWidth / insetHeight;
     cameraTop.updateProjectionMatrix();
});


