import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

const getFileName = (index) => {
     return `key-${index}`;
}

const getURL = (index) => {
     return `./audios/vibraphone/${getFileName(index)}.mp3`;
}

const keys = colors.map((color, index) => {
     const audio = new Audio(getURL(index));
     //audio.currentTime = 0;
     audio.volume = 0.2;
     return audio;
})

const playKey = (index) => {
     keys[index].currentTime = 0;
     keys[index].play();
}


///// three variables
let scene, camera, renderer, orbitControls;
let cameraFront, cameraTop, insetWidth, insetHeight;

///// textures
const textureLoader = new THREE.TextureLoader();
const space = textureLoader.load('./assets/galaxy1.jpg');
const metalTextureColor = textureLoader.load('./textures/metal/Metal043A_1K_Color.jpg'); 
const metalTextureRoughness = textureLoader.load('./textures/metal/Metal043A_1K_Roughness.jpg');

///// init functions /////

initThree();
createLights();
createPole();
cameraFrontMove();

///// init three /////

function initThree(){
     scene = new THREE.Scene();
     scene.background = new THREE.Color(0x111111);
     scene.background = space;
     //scene.fog = new THREE.Fog(0x555555, 1, 580);
     camera = new THREE.PerspectiveCamera(
         65,
          window.innerWidth/window.innerHeight,
          0.1,
          10000
     )
     camera.position.set(0, 32, 62);
     camera.lookAt(0, 0, 0);
     
     //cameraFront
     insetWidth = window.innerHeight * 0.40;
     insetHeight = window.innerHeight * 0.40;
     
     cameraFront = new THREE.PerspectiveCamera( 65, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 10, 35);
     cameraFront.lookAt(0, 5, 0);
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
     renderer.shadowMap.enabled = true;

   
     orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.03;  
}

//camera controls
function cameraFrontMove(){
     let tl = gsap.timeline({repeat: 20, repeatDelay: 3});
     tl.to(cameraFront.position, {y: 10, duration:8});
     tl.to(cameraFront.position, {z: 20, duration:6});
     tl.to(cameraFront.position, {x: 0, duration: 8});
     tl.to(cameraFront.position, {y: 0, duration: 8});
     tl.to(cameraFront.position, {x: 18, duration:6});
     tl.to(cameraFront.position, {x: 1, duration:6});
     tl.to(cameraFront.position, {z: 30 , duration: 6});
     tl.to(cameraFront.position, {y: 20 , duration: 8});
     tl.to(cameraFront.positoin, {y: 10 * 0 , duration: 6});
     tl.to(cameraFront.position, {z: 18, duration:6}); 
     tl.to(cameraFront.position, {x: 10, duration:8}); 
     tl.to(cameraFront.position, {y: 2, duration:6}); 
     tl.to(cameraFront.position, {x: 5, duration:8});  
     tl.to(cameraFront.position, {z: 20, duration:6});  
     tl.to(cameraFront.position, {y: 10, duration:6});  
     tl.to(cameraFront.position, {z: 20, duration:8});  
     tl.to(cameraFront.position, {x: 0, duration:6});  
     tl.to(cameraFront.position, {z: 10, duration:6});
     tl.to(cameraFront.position, {y: -5, duration:6});
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

     const pointLight = new THREE.PointLight(0xffffff, 0.8);
     pointLight.position.set(0, 50, 30);
     scene.add(pointLight);
}

function createPole(){
     const geo = new THREE.CylinderGeometry(0.2, 0.2, 60, 20, 20);
     const mat = new THREE.MeshPhongMaterial({
          color: 0xfffff,
     })
     const pole = new THREE.Mesh(geo, mat);
     pole.position.set(0, 32, 12);
     pole.rotation.x = -Math.PI / 2;
     scene.add(pole);
}

///// pendulum string mesh / ball mesh

let radius = 1;
let maxLength = 42;
let stringWidth = 0.1;
const maxPendulum = 21;
let pendulums = [];

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

function createBallMesh(ballRadius){
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

/////create pendulums

class Pendulum {
     constructor(string, ball, frequency, amplitude){
          this.string = string;
          this.ball = ball;
          this.frequency = frequency;
          this.amplitude = amplitude;
     }
     update(totalTime){
         

          
        /*   this.string.rotation.y = this.amplitude * Math.cos((totalTime * this.frequency)/1000);
          this.ball.rotation.y = this.amplitude * Math.cos((totalTime * this.frequency)/1000); */
          
          this.string.rotation.x = this.amplitude * Math.cos((totalTime * this.frequency)/1000);
          this.ball.rotation.x = this.amplitude * Math.cos((totalTime * this.frequency)/1000); 
          
          this.string.rotation.z = this.amplitude * Math.cos((totalTime * this.frequency)/1000);
          this.ball.rotation.z = this.amplitude * Math.cos((totalTime * this.frequency)/1000);
     }
}

function createPendulum(origin, frequency, amplitude, stringLength, ballRadius){
     const stringMesh = createStringMesh(stringLength);
     stringMesh.position.add(origin);
     stringMesh.translateY(maxLength);
     stringMesh.geometry.translate(0, -stringLength/2, 0);
     const ballMesh = createBallMesh(ballRadius);
     ballMesh.position.add(origin);
     ballMesh.translateY(maxLength);
     ballMesh.geometry.translate(0, -stringLength, 0);

     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
     return pendulum;
}

for(let i = 0; i < maxPendulum; i++){
     let amplitude = Math.PI * 1 ;
     let frequency =  0.25 + i * 0.0025;
     let ballRadius = radius * 2 - (i * 0.06);
     let length = maxLength - ballRadius - (i*1.5);

       
     const pendulum = createPendulum((new THREE.Vector3(0, -10, i * 2 + ballRadius * i - 13)), frequency, amplitude, length, ballRadius);
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
     renderer.setScissor(window.innerWidth - insetWidth - 8,  insetHeight / 4 - 26,
          insetWidth, insetHeight);
     renderer.setViewport(window.innerWidth - insetWidth - 8,  insetHeight / 4 - 26, insetWidth, insetHeight + 8);
     renderer.render(scene, cameraFront);

    // top
    renderer.setScissor(8,  insetHeight / 4 - 26,
    insetWidth, insetHeight);
     renderer.setViewport(8,  insetHeight / 4 - 26, insetWidth, insetHeight +  8);
     renderer.render(scene, cameraTop); 
     
     renderer.setScissorTest(false);
}
animate();

function update(totalTime){
     orbitControls.update();
     pendulums.forEach((p, index) => {
          p.update(totalTime);
          if(p.ball.rotation.z >= 1.57 || p.ball.rotation.z <= -1.57){
               playKey(index);
          } 
     });
}

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