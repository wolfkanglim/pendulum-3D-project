import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//toggle  to sound on/off
const toggles = {
     sound: document.getElementById('sound-toggle'),
}

///// Color 61
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
     "#FDDFD5",
     
];

let soundEnabled = false;
let pulseEnabled = true;

const handleSoundToggle = (enabled = !soundEnabled ) => {
     soundEnabled = enabled;
     toggles.sound.dataset.toggled = enabled;
}

document.onvisibilitychange = () => {
     handleSoundToggle(false);
}

document.onclick = () => {
     handleSoundToggle();
}

///// Get Audio files /////
const getFileName = index => {
     return `key-${index}`;
}

const getURL = index => `./audios/bell/${getFileName(index)}.mp3`;

const keys = colors.map((color, index) => {
     const audio = new Audio(getURL(index));
     audio.volume = 0.2;
     audio.currentTime = 0;
     return audio;
});

const playKey = index => {
     keys[index].currentTime = 0;
     keys[index].play();
}
///////////////////////////////

//variables
let scene, camera, renderer, orbitControls;
let cameraFront, cameraTop, insetWidth, insetHeight;
const textureLoader = new THREE.TextureLoader();
const space = textureLoader.load('./assets/galaxy1.jpg');
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
frontCameraMove();

function initThree(){
     scene = new THREE.Scene();
     scene.background = space;
     scene.fog = new THREE.Fog(0x555555, 1, 580);

     camera = new THREE.PerspectiveCamera(
          65,
          window.innerWidth/window.innerHeight,
          0.1,
          10000
     )
     camera.position.set(0, 5, 75);
     camera.lookAt(0, 5, 0);

     ///// camera front
     insetWidth = window.innerHeight * 0.35;
     insetHeight = window.innerHeight * 0.35;
     
     cameraFront = new THREE.PerspectiveCamera( 60, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 0, 75);
     cameraFront.lookAt(0, 15, 0);
     cameraFront.name = 'frontCamera';

     // camera top //
     cameraTop = new THREE.PerspectiveCamera(70, insetWidth/insetHeight, 1, 500);
     cameraTop.position.set(0, 100, 0);
     cameraTop.lookAt(0, 0, 0);
     cameraTop.name = 'cameraTop';

     renderer = new THREE.WebGLRenderer({antialias: true, 
     canvas: canvas});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     //document.body.appendChild(renderer.domElement);
     renderer.shadowMap.enabled = true;

      orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.04; 
    }

     //camera controls
function cameraMove(){
     let tl = gsap.timeline({repeat: 4, repeatDelay: 4});
     tl.to(camera.position, {z: 50, duration:12});
     tl.to(camera.position, {z: 30, duration:8});
     tl.to(camera.position, {x: -30, duration: 8});
     tl.to(camera.position, {y: 60, duration: 8});
     tl.to(camera.position, {x: 38, duration:4});
     tl.to(camera.position, {x: 1, duration:4});
     tl.to(camera.position, {y: 0 , duration: 6});
     tl.to(camera.position, {y: -30 , duration: 12});
     tl.to(camera.position, {y: 18 * 0 , duration: 6});
     tl.to(camera.position, {z: 28, duration:6}); 
     tl.to(camera.position, {x: 10, duration:4}); 
     tl.to(camera.position, {z:  20, duration:6}); 
     tl.to(camera.position, {x: 15, duration:8});  
     tl.to(camera.position, {z: 50, duration:4});  
     tl.to(camera.position, {y: 40, duration:6});  
     tl.to(camera.position, {x: 0, duration:8});  
     tl.to(camera.position, {y: 0, duration:4});  
     tl.to(camera.position, {z: 100, duration:6});
}

///// Front Camera controls
function frontCameraMove(){
     let tl = gsap.timeline({repeat: 4, repeatDelay: 4});
     tl.to(cameraFront.position, {z: 50, duration:12});
     tl.to(cameraFront.position, {z: 30, duration:8});
     tl.to(cameraFront.position, {x: -30, duration: 8});
     tl.to(cameraFront.position, {y: 30, duration: 8});
     tl.to(cameraFront.position, {x: 38, duration:4});
     tl.to(cameraFront.position, {x: 1, duration:4});
     tl.to(cameraFront.position, {y: 0 , duration: 6});
     tl.to(cameraFront.position, {y: -30 , duration: 12});
     tl.to(cameraFront.position, {y: 20 , duration: 6});
     tl.to(cameraFront.position, {z: 38, duration:6}); 
     tl.to(cameraFront.position, {x: 20, duration:4}); 
     tl.to(cameraFront.position, {z:  10, duration:6}); 
     tl.to(cameraFront.position, {x: 15, duration:8});  
     tl.to(cameraFront.position, {z: 50, duration:4});  
     tl.to(cameraFront.position, {y: 20, duration:6});  
     tl.to(cameraFront.position, {x: 0, duration:8});  
     tl.to(cameraFront.position, {y: 0, duration:4});  
     tl.to(cameraFront.position, {z: 100, duration:6});
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0xdddddd, 0.5);
     scene.add(ambientLight);
     const dirLight = new THREE.DirectionalLight(0xffffff, 0.65);
     dirLight.position.set(5, 50, 50);
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
     pointLight.position.set(0, 50, 50);
     scene.add(pointLight);
}

//create background sphere
function createSpace(){
     const geometry = new THREE.SphereGeometry(500, 50, 50);
     const material = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          side: THREE.DoubleSide,
          wireframe: true,          
     })
     const sphereSpace = new THREE.Mesh(geometry, material);
     sphereSpace.rotation.x = -Math.PI/2;
     scene.add(sphereSpace);
}

function createGround(){
     const stoneTextureColor = textureLoader.load('./textures/wall_stone/Wall_Stone_022_basecolor.jpg');
     const stoneTextureRoughness = textureLoader.load('./textures/wall_stone/Wall_Stone_022_roughness.jpg');
     const stoneTextureNormal = textureLoader.load('./textures/wall_stone/Wall_Stone_022_normal.jpg'); 

     const metalTextureColor = textureLoader.load('./textures/metal/Metal043A_1K_Color.jpg');
     const metalTextureDisplacement = textureLoader.load('./textures/metal/Metal043A_1K_Displacement.jpg');
     const metalTextureRoughness = textureLoader.load('./textures/metal/Metal043A_1K_Roughness.jpg');
     const metalTextureNormal = textureLoader.load('./textures/metal/Metal043A_1K_NormalGL.jpg');

     const planeGeometry = new THREE.PlaneGeometry(150, 150);
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
     mesh.position.set(0, -21, -10);
     scene.add(mesh);
}

///// instruments /////

function createCubeMesh(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          color: 0x999999,
          transparent: true,
          opacity:0.75
     })
     const cubeMesh = new THREE.Mesh(geometry, material);
     cubeMesh.castShadow = true;
     cubeMesh.receiveShadow = true;
     scene.add(cubeMesh);
     return cubeMesh;
}

function createVibraphone(){
     for(let i = 0; i < 21; i++){
          const cube = createCubeMesh();
          cube.material.color = new THREE.Color(`hsla(${i*18}, 100%, 50%, 1)`);
          cube.scale.set(1.8, i * 1.0125 + 2, 0.75);
          cube.position.set(2*i + 9.5, 18 + (i * 1.0125)/2 + 0.9, 0);
          rightCubes.push(cube);
          groupRight.add(cube);  
     } 
     
     for(let i = 0; i < 21; i++){
          const cube = createCubeMesh();
          cube.material.color = new THREE.Color(`hsla(${ i*18}, 100%, 50%, 1)`);
          cube.scale.set(1.8, i * 1.0125 + 2, 0.4);
          cube.position.set(-(2*i + 9.5), 18 + (i * 1.0125) / 2 + 0.9, 0);
          leftCubes.push(cube);
          groupLeft.add(cube);  
     } 
     scene.add(groupRight);
     scene.add(groupLeft);
};

function createBar(){
     const bar = createCubeMesh();
     bar.position.set(0, 18.5, -8);
     bar.scale.set(1, 1, 20);
     scene.add(bar);

     const beam = createCubeMesh();
     beam.position.set(0, 0, -17.5);
     beam.scale.set(2, 37, 2);
     scene.add(beam);

     const stone = createCubeMesh();
     stone.position.set(0, -18, -18);
     stone.scale.set(18, 8, 8);
     stone.material.color = new THREE.Color(0xeee);
     stone.material.map = space;
     scene.add(stone);
};

 ///////////////////
let radius = 1.1;
let stringLength = 9;
let stringWidth = 0.1;

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
};

function createBallMesh(){
     const ballTextureColor = textureLoader.load('./textures/metal/Metal043A_1K_Color.jpg');
     const ballTextureRoughness = textureLoader.load('./textures/metal/Metal043A_1K_Roughness.jpg');
     const geometry = new THREE.SphereGeometry(radius);
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

//////////////////////////////
class Pendulum {
     constructor(stringMesh, ballMesh, frequency, amplitude){          
          this.string = stringMesh;
          this.ball = ballMesh;
          this.frequency = frequency;
          this.amplitude = amplitude;
     }
     update(deltaTime){
          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * deltaTime)/1000);
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * deltaTime)/1000);

     }
};

function createPendulum(origin, frequency, amplitude, stringLength){
     const stringMesh = createStringMesh();
     stringMesh.position.add(origin);
     stringMesh.translateY(stringLength);
     stringMesh.geometry.translate(0, -stringLength/2, 0);

     const ballMesh = createBallMesh();
     ballMesh.position.add(origin);
     ballMesh.translateY(stringLength);
     ballMesh.geometry.translate(0, -(stringLength + 0.5), 0);

     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
     return pendulum;
};

let startTime = null;
const maxPendulum = 21;
const pendulums = [];

 for(let i = 0; i < maxPendulum; i++){
     stringLength = 9 + (i*2);
     //let frequency = 0.6 + i * 0.0125;
     //let frequency = 0.6 + (i * 0.02);
     let frequency = 1 - (i * 0.02);
     const pendulum = createPendulum(new THREE.Vector3(0, -i*2 + 9, 0), frequency, Math.PI/2, stringLength);
     pendulums.push(pendulum);
};  

function animate(time){
     if(startTime == null){
          startTime = time;
     }
    
     const deltaTime = (time - startTime);
     update(deltaTime);

     renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
     renderer.render(scene, camera);
     window.requestAnimationFrame(animate);

     renderer.clearDepth();
     renderer.setScissorTest(true);
     renderer.setScissor(window.innerWidth - insetWidth - 8,  window.innerHeight/2 - insetHeight - 36,
          insetWidth, insetHeight);
     renderer.setViewport(window.innerWidth - insetWidth - 8, window.innerHeight/2 - insetHeight - 36, insetWidth, insetHeight);
     renderer.render(scene, cameraFront);

     // top
    renderer.setScissor(8,  insetHeight / 4 ,
    insetWidth, insetHeight);
renderer.setViewport(8,  insetHeight / 4, insetWidth, insetHeight + 16);
renderer.render(scene, cameraTop); 
     
     renderer.setScissorTest(false);
}

function update(deltaTime){
     orbitControls.update();
     //flyCamera.update(deltaTime);
     pendulums.forEach((p, index) => {
          p.update(deltaTime);
          if(p.ball.rotation.z >= 1.57) {
               if(soundEnabled){
                    playKey(index);
               }
               if(pulseEnabled){
                    gsap.to(rightCubes[index].position, {y: 18 + (index * 1.0125)/2 + 0.9 + 20, duration: 0.5}) ;
                    gsap.to(rightCubes[index].material, {opacity: 1, duration: 0.1}) ; 
                    gsap.to(rightCubes[index].position, {y: 18 + (index * 1.0125)/2 + 0.9, duration: 2}) ;
                    //gsap.to(rightCubes[index].rotation, {y: 360, duration: 2}) ;
                    gsap.to(rightCubes[index].material, {opacity: 0.6, duration: 2}) ; 
               }
              
          }  else if(p.ball.rotation.z < -1.5707) {
               if(soundEnabled){
                    playKey(index + 24);
               }
               if(pulseEnabled){
                    gsap.to(leftCubes[index].material, {opacity: 1, duration: 0.1}) ; 
                    gsap.to(leftCubes[index].position, {y: 20 +  index + 50, duration: 1, ease: "power2"}) ;
                    gsap.to(leftCubes[index].position, {y: 19 + (index * 1.0125)/2, duration: 2}) ;  
                    gsap.to(leftCubes[index].material, {opacity: 0.7, duration: 2}) ; 
               }
               
          } 
     });          
};

animate();

window.addEventListener('resize', () => {
     const aspect = window.innerWidth/window.innerHeight;
     camera.aspect = aspect;
     camera.updateProjectionMatrix();
     camera.lookAt(0, 0, 0);
     renderer.setSize(window.innerWidth, window.innerHeight);

     insetWidth = window.innerHeight * 0.35;
     insetHeight = window.innerHeight * 0.35;
     cameraFront.aspect = insetWidth / insetHeight;
     cameraFront.updateProjectionMatrix();
});
