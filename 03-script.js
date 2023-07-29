import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const toggles = {
     sound: document.getElementById('sound-toggle')
}

// 21 colors
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
     "#FEDCD1"
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

canvas.onclick = () => {
     handleSoundToggle();
}

const getFileName = (index) => {
     return `key-${index}`;
}

const getURL = (index) => {
     return `./audios/bell/${getFileName(index)}.mp3`;
}

const keys = colors.map((color, index) => {
     const audio = new Audio(getURL(index));
     audio.currentTime = 0;
     audio.volume = 0.2;
     return audio;
})

const playKey = (index) => {
     keys[index].currentTime = 0;
     keys[index].play();
}

////////// THREE 

///// variables
let scene, camera, renderer, orbitControls;
let cameraFront, insetWidth, insetHeight;

const textureLoader = new THREE.TextureLoader();
const space = textureLoader.load('./assets/galaxy1.jpg');
// stone textures   
const stoneTextureColor = textureLoader.load('./textures/wall_stone/Wall_Stone_022_basecolor.jpg');
const stoneTextureRoughness = textureLoader.load('./textures/wall_stone/Wall_Stone_022_roughness.jpg');
const stoneTextureNormal = textureLoader.load('./textures/wall_stone/Wall_Stone_022_normal.jpg'); 

//metal textures
const metalTextureColor = textureLoader.load('./textures/metal/Metal043A_1K_Color.jpg');
const metalTextureDisplacement = textureLoader.load('./textures/metal/Metal043A_1K_Displacement.jpg');
const metalTextureRoughness = textureLoader.load('./textures/metal/Metal043A_1K_Roughness.jpg');
const metalTextureNormal = textureLoader.load('./textures/metal/Metal043A_1K_NormalGL.jpg');

   //skybox
   let materialArray = [];
   let texture_ft = textureLoader.load( './textures/lightblue/front.png');
   let texture_bk = textureLoader.load( './textures/lightblue/back.png');
   let texture_up = textureLoader.load( './textures/lightblue/top.png');
   let texture_dn = textureLoader.load( './textures/lightblue/bot.png');
   let texture_rt = textureLoader.load( './textures/lightblue/right.png');
   let texture_lf = textureLoader.load( './textures/lightblue/left.png');     
        
   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
   materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));

   for (let i = 0; i < 6; i++){
        materialArray[i].side = THREE.BackSide;
   }

///// variables   

const color = new THREE.Color();
const groupRight = new THREE.Object3D();
const groupLeft = new THREE.Object3D();

let rightCubes = [];
let leftCubes = [];

initThree();
createLights();
createBar();
createSpace();
createVibraphone();
cameraMove();

function initThree(){
     scene = new THREE.Scene();
     scene.background = new THREE.Color(0x111111);
     camera = new THREE.PerspectiveCamera(
          65,
          window.innerWidth/window.innerHeight,
          0.1,
          10000
     )
     camera.position.set(0, 35, 100);
     camera.lookAt(0, 40, -15);
     
     //cameraFront
     insetWidth = window.innerHeight * 0.35;
     insetHeight = window.innerHeight * 0.35;
     
     cameraFront = new THREE.PerspectiveCamera( 65, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 30, 65);
     cameraFront.lookAt(0, 15, 0);
     cameraFront.name = 'frontCamera';     

     renderer = new THREE.WebGLRenderer({antialias: true, 
     canvas: canvas});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     renderer.shadowMap.enabled = true;

     //skybox
     let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
     let skybox = new THREE.Mesh( skyboxGeo, materialArray );
     scene.add( skybox );  


     orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.04;  
}

//camera controls
function cameraMove(){
     let tl = gsap.timeline({repeat: 4, repeatDelay: 3});
     tl.to(camera.position, {z: 50, duration:12});
     tl.to(camera.position, {z: 30, duration:6});
     tl.to(camera.position, {x: -30, duration: 8});
     tl.to(camera.position, {y: 60, duration: 8});
     tl.to(camera.position, {x: 38, duration:4});
     tl.to(camera.position, {z: 10 , duration: 12});
     tl.to(camera.position, {x: 1, duration:2});
     tl.to(camera.position, {y: 20 , duration: 6});
     tl.to(camera.position, {x: 10 * 0 , duration: 6});
     tl.to(camera.position, {z: 28, duration:6}); 
     tl.to(camera.position, {x: -10, duration:4}); 
     tl.to(camera.position, {z: 2, duration:6}); 
     tl.to(camera.position, {x: 15, duration:8});  
     tl.to(camera.position, {z: 30, duration:4});  
     tl.to(camera.position, {y: 50, duration:6});  
     tl.to(camera.position, {z: 20, duration:8});  
     tl.to(camera.position, {x: 0, duration:4});  
     tl.to(camera.position, {z: 50, duration:6});
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.51);
     scene.add(ambientLight);
     const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
     dirLight.position.set(5, 50, 15);
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

     const pointLight = new THREE.PointLight(0xffffff, 0.9);
     pointLight.position.set(0, 50, 30);
     scene.add(pointLight);
}

//create background sphere
function createSpace(){
     const geometry = new THREE.SphereGeometry(500, 100, 100);
     const material = new THREE.MeshStandardMaterial({
          color: 'black',
          side: THREE.DoubleSide,
          wireframe: true,          
     })
     const sphereSpace = new THREE.Mesh(geometry, material);
     sphereSpace.rotation.x = -Math.PI/2;
     scene.add(sphereSpace);
}



function createCube(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          color: 0xcccccc,
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
     bar.position.set(0, 31.55, 0);
     bar.scale.set(1, 1, 54);
     scene.add(bar);

     const beam = createCube();
     beam.position.set(0, 10, -18);
     beam.scale.set(2, 54, 2);
     scene.add(beam);

     const stone = createCube();
     stone.position.set(0, -18, -18);
     stone.scale.set(18, 8, 10);
     stone.material.color = 0x333333;
     stone.material.map = stoneTextureColor;
     scene.add(stone);
}

///// Vibraphone right/left
function createVibraphone(){
     for(let i = 0; i < 21; i++){
          const cube = createCube();
          cube.material.color = new THREE.Color(colors[i]);
          cube.scale.set(1.75, i * 0.5 + 5, 0.7);
          //cube.position.set(6 + i * 2 , 16 + (i * 0.5), i * 0.18);
          cube.position.set(6 + i * 2 , 16 + (i * 0.98), -i * 0.75);
          cube.rotation.y = Math.PI * 0.05;
          rightCubes.push(cube);
          groupRight.add(cube);
          groupRight.rotation.y = Math.PI / 2;
          groupRight.position.set(26, 0, 30);
     }
     scene.add(groupRight);

     for(let i = 0; i < 21; i++){
          const cube = createCube();
          cube.material.color = new THREE.Color(colors[i]);
          cube.scale.set(1.75, i * 0.5 + 5, 0.7);
          cube.position.set(-6 - (i * 2.02), 16 + (i * 0.98), -i * 0.75);
          cube.rotation.y = -Math.PI * 0.05;
          leftCubes.push(cube);
          groupLeft.add(cube);
          groupLeft.rotation.y = -Math.PI / 2;
          groupLeft.position.set(-26, 0, 30);
     }
     scene.add(groupLeft);
}

///// pendulum string mesh / ball mesh

let ballRadius = 1;
//let stringLength = 31;
let stringWidth = 0.06;
const maxPendulum = 21;

function createStringMesh(stringLength){
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

function createPendulum(origin, frequency, amplitude, stringLength){
     const stringMesh = createStringMesh(stringLength);
     stringMesh.position.add(origin);
     stringMesh.translateY(31);
     stringMesh.geometry.translate(0, -(stringLength * 0.5), 0);

     const ballMesh = createBallMesh();
     ballMesh.position.add(origin);
     ballMesh.translateY(31);
     ballMesh.geometry.translate(0, -stringLength, 0);

    
     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
     return pendulum;
};

const pendulums = [];
for(let i = 0; i < maxPendulum; i++){
     //stringLength = 31 - i;
     const pendulum = createPendulum(new THREE.Vector3(0, 0, -i * 2 + 24), 1 + i * 0.0125, 1 + i * 0.0125, 31 - i);
     pendulums.push(pendulum);
}; 




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
     renderer.setScissor(window.innerWidth - insetWidth - 8,  insetHeight / 4 ,
          insetWidth, insetHeight);
     renderer.setViewport(window.innerWidth - insetWidth - 8,  insetHeight / 4, insetWidth, insetHeight + 16);
     renderer.render(scene, cameraFront);
     
     renderer.setScissorTest(false);
}

function update(totalTime){
     orbitControls.update();
     //console.log(pendulums[20].ball.rotation.z);
     pendulums.forEach((p, index) => {
          p.update(totalTime);

          //if(p.ball.rotation.z >= 1) {
          if(p.ball.rotation.z >= (0.999 + index * 0.01245)) {
               if(soundEnabled){
                    playKey(index);
               }
               if(pulseEnabled){
                    gsap.to(rightCubes[index].material, {opacity: 1, duration: 0.5}) ; 
                    gsap.to(rightCubes[index].position, {y: 16 + (index * 0.98) + 36, duration: 1, ease: "power2.out"}) ;
                    gsap.to(rightCubes[index].position, {y: index * 0.98 + 16, duration: 2}) ;
                    //gsap.to(rightCubes[index].rotation, {y: 360, duration: 2}) ;
                    gsap.to(rightCubes[index].material, {opacity: 0.75, duration: 0.5}) ; 
               }
               
          }  else if(p.ball.rotation.z <= -(0.999 + index * 0.01245)) {
               if(soundEnabled){
                    playKey(index);
               }
               if(pulseEnabled){
                    gsap.to(leftCubes[index].material, {opacity: 1, duration: 0.5}) ; 
                    gsap.to(leftCubes[index].position, {y: 16 + (index * 0.98) + 36, duration: 1, ease: "power2.out"}) ;
                    gsap.to(leftCubes[index].position, {y: 16 + (index * 0.98), duration: 2}) ;  
                    gsap.to(leftCubes[index].material, {opacity: 0.75, duration: 0.5}) ; 
               }
               
          } 
     });
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
});


