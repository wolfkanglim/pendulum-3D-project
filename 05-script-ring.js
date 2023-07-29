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

document.onclick = () => {
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
     audio.volume = 0.4;
     return audio;
})

const playKey = (index) => {
     keys[index].currentTime = 0;
     keys[index].play();
}

////////// THREE 

///// variables
let scene, camera, renderer, orbitControls;
let cameraFront, cameraTop, insetWidth, insetHeight;

const textureLoader = new THREE.TextureLoader();
const space = textureLoader.load('./assets/galaxy1.jpg');

const metalTextureColor = textureLoader.load('./textures/metal/Metal043A_1K_Color.jpg');
const metalTextureRoughness = textureLoader.load('./textures/metal/Metal043A_1K_Roughness.jpg');

const color = new THREE.Color();
const groupOuter = new THREE.Object3D();
const groupLeft = new THREE.Object3D();
let rightCubes = [];//outer vibraphone hidden
let leftCubes = [];//inner vibraphone
let ring;
const groupRing = new THREE.Object3D();

let ballRadius = 1.75;
let stringLength = 32;
let stringWidth = 0.25;
const maxPendulum = 21;

///// init functions /////

initThree();
createLights();
createTorus();
createVibraphone();
cameraFrontMove();
//cameraMove();

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
     camera.position.set(15, 35, 110);
     camera.lookAt(0, 0, 0);

     insetWidth = window.innerHeight * 0.350;
     insetHeight = window.innerHeight * 0.35;

     // camera top //
     cameraTop = new THREE.PerspectiveCamera(70, insetWidth/insetHeight, 1, 500);
     cameraTop.position.set(0, 115, 0);
     cameraTop.lookAt(0, 0, -4);
     cameraTop.name = 'cameraTop';
     
     //cameraFront
     
     cameraFront = new THREE.PerspectiveCamera( 60, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 5, 50);
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
     tl.to(cameraFront.position, {z: 20, delay: 5, duration:12});
     tl.to(cameraFront.position, {z: 30, duration:6});
     tl.to(cameraFront.position, {z: 50, duration:6});
     tl.to(cameraFront.position, {x: -30, duration: 8});
     tl.to(cameraFront.position, {y: 20, duration: 8});
     tl.to(cameraFront.position, {x: 28, duration:4});
     tl.to(cameraFront.position, {x: 0, duration:2});
     tl.to(cameraFront.position, {z: 20 , duration: 6});
     tl.to(cameraFront.position, {y: 10 , duration: 12});
     tl.to(cameraFront.position, {x: 30  , duration: 6});
     tl.to(cameraFront.position, {z: 18, duration:6}); 
     tl.to(cameraFront.position, {y: 25, duration:4}); 
     tl.to(cameraFront.position, {x: 30, duration:4}); 
     tl.to(cameraFront.position, {x: -30, duration:6}); 
     tl.to(cameraFront.position, {x: 1, duration:8});  
     tl.to(cameraFront.position, {z: 20, duration:4});  
     tl.to(cameraFront.position, {y: 20, duration:6});  
     tl.to(cameraFront.position, {z: 10, duration:8});  
     tl.to(cameraFront.position, {y: 20, duration:4});  
     tl.to(cameraFront.position, {z: 20, duration:6});
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.51);
     scene.add(ambientLight);
     const dirLight = new THREE.DirectionalLight(0xffffff, 1);
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

     const pointLight = new THREE.PointLight(0xffffff, 0.8);
     pointLight.position.set(0, 20, 25);
     scene.add(pointLight);
}

function createCube(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          color: 0x555555,
          transparent: true,
          opacity: 1
     })
     const cubeMesh = new THREE.Mesh(geometry, material);
     cubeMesh.castShadow = true;
     cubeMesh.receiveShadow = true;
     scene.add(cubeMesh);
     return cubeMesh;
}

///// create Ring Torus //////
function createTorus(){
     const ringGeo = new THREE.TorusGeometry(32, 1, 16, 100);
     const ringMat = new THREE.MeshPhongMaterial({
          color: 0xeeeeee,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5


     })
     ring = new THREE.Mesh(ringGeo, ringMat);
     ring.rotation.x = -Math.PI / 2;
     ring.position.y = 33.25;
     ring.castShadow = true;
     ring.receiveShadow = true;
     groupRing.add(ring);
     //scene.add(ring);

     //Top ring
     const topRingGeo = new THREE.TorusGeometry(32.5, 1, 16, 100);
     const topRing = new THREE.Mesh(topRingGeo, ringMat);
     topRing.rotation.x = -Math.PI/2 + Math.PI / 18;
     topRing.position.y = 41;
     topRing.castShadow = true;
     topRing.receiveShadow = true;
     groupRing.add(topRing);
     //scene.add(topRing);
     scene.add(groupRing);

     // inner ring
     const innerRingGeo = new THREE.TorusGeometry(3, 1, 16, 100);
     const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
     innerRing.rotation.x = -Math.PI/2;
     innerRing.position.y = 15;
     innerRing.castShadow = true;
     innerRing.receiveShadow = true;
     scene.add(innerRing);

     //outerRing --hidden
     const outerRingGeo = new THREE.TorusGeometry(62, 0.1, 16, 100);
     const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
     outerRing.position.y = 14;
     outerRing.rotation.x = -Math.PI/2;
     outerRing.castShadow = true;
     outerRing.receiveShadow = true;
     scene.add(outerRing);

}

///// Vibraphone right(outer-hidden/left(inner)
function createVibraphone(){
     for(let i = 0; i < 21; i++){
          const cube = createCube();
          cube.material.color = new THREE.Color(colors[i]);
          cube.scale.set(2, 16 - (i * 0.5), 5);
          let angle = Math.PI * 2 / 21;
          let radius = 61.5;
          cube.position.x = radius * Math.cos(angle * i);
          cube.position.z = radius * Math.sin(angle * i);
          rightCubes.push(cube);
          cube.rotation.y = -angle * i;
          groupOuter.add(cube);
          groupOuter.position.set(0, 14, 0);
     }
     scene.add(groupOuter);

     for(let i = 0; i < 21; i++){
          const cube = createCube();
          cube.material.color = new THREE.Color(colors[i]);
          //cube.scale.set(1.5, i * 0.5 + 5, 0.5);

          cube.scale.set(0.9, 10 - (i * 0.3), 1.8);
          let angle = Math.PI * 2 / 21;
          let radius = 6;
          cube.position.x = radius * Math.cos(angle * i);
          cube.position.z = radius * Math.sin(angle * i);
          cube.rotation.y = -angle * i;

          leftCubes.push(cube);
          groupLeft.add(cube);
          groupLeft.rotation.y = Math.PI / 2;
          groupLeft.position.set(0, 31, 0);
     }
     //scene.add(groupLeft);
}

///// pendulum string mesh / ball mesh

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
     constructor(string, ball, frequency, amplitude, a){
          this.string = string;
          this.ball = ball;
          this.frequency = frequency;
          this.amplitude = amplitude;
          this.a = a;
     }
     update(totalTime){
          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);
          
        
          //rotation by angle    
          this.string.rotation.y = this.a;       
          this.ball.rotation.y = this.a;
     }
};

function createPendulum(origin, frequency, amplitude, a){
     const stringMesh = createStringMesh();
     stringMesh.position.add(origin);
     stringMesh.translateY(stringLength);
     stringMesh.geometry.translate(0, -(stringLength * 0.5), 0);

     const ballMesh = createBallMesh();
     ballMesh.position.add(origin);
     ballMesh.translateY(stringLength);
     ballMesh.geometry.translate(0, -stringLength, 0);

     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude, a);
     return pendulum; //a is for angle positions
};

const pendulums = [];

///// create pendulums make ring circle

for(let i = 0; i < maxPendulum; i++){
     let radius = 32;
     
     let angle = Math.PI * 2 / maxPendulum;
     let posX = radius * Math.cos(angle * i);
     let posZ = radius * Math.sin(angle * i);

     const pendulum = createPendulum(new THREE.Vector3(posX, 0, posZ), i * 0.0125 + 1.2,  Math.PI / 3, -angle * i);
     pendulums.push(pendulum);
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
     renderer.setScissor(8,  insetHeight / 4 - 15,
          insetWidth, insetHeight);
     renderer.setViewport(8,  insetHeight / 4 - 15, insetWidth, insetHeight + 16);
     renderer.render(scene, cameraTop);
     
     renderer.setScissorTest(false);
}

function update(totalTime){
     orbitControls.update();
     groupRing.rotation.y += 0.02;
     pendulums.forEach((p, index) => {
          p.update(totalTime);
          if(p.ball.rotation.z <= -1.01237) {              
               if(pulseEnabled){                    
                    gsap.to(ring.material, {opacity: 1, duration: 0.5}) ; 
                    gsap.to(ring.material, {opacity: 0.5, duration: 0.5}) ; 
               }
          } 
          else if(p.ball.rotation.z >= 1.01237) {
               if(soundEnabled){
                    playKey(index);
               }
               if(pulseEnabled){
                    
                    gsap.to(rightCubes[index].position, {y: 8 + (index * 1.0125)/2, duration: 0.51, ease: 'power3'}) ;
                    gsap.to(rightCubes[index].material, {opacity: 1, duration: 0.5}) ; 
                    gsap.to(rightCubes[index].position, {y: 0, duration: 1.5}) ;  
                    gsap.to(rightCubes[index].material, {opacity: 0.8, duration: 1}) ; 
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
     cameraTop.aspect = insetWidth / insetHeight;
     cameraTop.updateProjectionMatrix();
});
