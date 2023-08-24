import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {RoomEnvironment} from './js/RoomEnvironment.js';

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
     return `./audios/bell/${getFileName(index)}.mp3`;
}

const keys = colors.map((color, index) => {
     const audio = new Audio(getURL(index));
     //audio.currentTime = 0;
     audio.volume = 0.4;
     return audio;
})

const playKey = (index) => {
     //keys[index].currentTime = 0;
     keys[index].play();
}

////////// THREE 

///// variables
let scene, camera, renderer, orbitControls;
let cameraFront, cameraTop, insetWidth, insetHeight;

const textureLoader = new THREE.TextureLoader();
//const space = textureLoader.load('./assets/galaxy1.jpg');

const metalTextureColor = textureLoader.load('./textures/metal/Metal043A_1K_Color.jpg');
const metalTextureRoughness = textureLoader.load('./textures/metal/Metal043A_1K_Roughness.jpg');

const color = new THREE.Color();
const groupOuter = new THREE.Object3D();
const groupLeft = new THREE.Object3D();
let rightCubes = [];//outer vibraphone hidden
let leftCubes = [];//inner vibraphone
let ring;
const groupRing = new THREE.Object3D();

let ballRadius = 10;
let stringLength = 167;
let stringWidth = 0.35;
//const maxPendulum = 21;
let pendulum;
let count = 0;


///// init functions /////

initThree();
createLights();
createTorus();
createVibraphone();
cameraFrontMove();
//cameraMove();
createSphere();
createCompass();
createSky();

function initThree(){
     scene = new THREE.Scene();
     //scene.background = new THREE.Color(0x111111);
     //scene.background = space;
     //scene.background = textureLoader.load('./textures/Panorama_sphere.jpg');
     //scene.fog = new THREE.Fog(0x555555, 1, 580);
     camera = new THREE.PerspectiveCamera(
          65,
          window.innerWidth/window.innerHeight,
          0.1,
          20000
     )
     camera.position.set(0, 60, 160);
     camera.lookAt(0, 0, 0);

     insetWidth = window.innerHeight * 0.35;
     insetHeight = window.innerHeight * 0.35;

     // camera top //
     cameraTop = new THREE.PerspectiveCamera(65, insetWidth/insetHeight, 1, 500);
     cameraTop.position.set(0, 170.5, 0);
     cameraTop.lookAt(0, 0, 0);
     cameraTop.name = 'cameraTop';
     
     //cameraFront
     
     cameraFront = new THREE.PerspectiveCamera( 60, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 25, 195);
     cameraFront.name = 'frontCamera';     

     renderer = new THREE.WebGLRenderer({antialias: true, 
     canvas: canvas});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     renderer.shadowMap.enabled = true;
     renderer.toneMapping = THREE.ACESFilmicToneMapping;
     renderer.toneMappingExposure = 1;

     const environment = new RoomEnvironment(renderer);
     const pmremGenerator = new THREE.PMREMGenerator(renderer);
     scene.environment = pmremGenerator.fromScene(environment).texture;

     orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.04;  
}

//camera controls
function cameraMove(){
     let tl = gsap.timeline({repeat: 4, repeatDelay: 5});
     tl.to(camera.position, {z: 50, delay: 5, duration:12});
     tl.to(camera.position, {z: 30, duration:16});
     tl.to(camera.position, {z: 100, duration:16});
     tl.to(camera.position, {x: -100, duration: 18});
     tl.to(camera.position, {y: 60, duration: 18});
     tl.to(camera.position, {x: 100, duration: 14});
     tl.to(camera.position, {x: 1, duration: 12});
     tl.to(camera.position, {z: 0 , duration: 16});
     tl.to(camera.position, {y: 80 , duration: 12});
     tl.to(camera.position, {x: 100 * 0 , duration: 16});
     tl.to(camera.position, {z: 58, duration:16}); 
     tl.to(camera.position, {x: 60, duration: 14}); 
     tl.to(camera.position, {x: -100, duration: 16}); 
     tl.to(camera.position, {x: 1, duration: 18});  
     tl.to(camera.position, {z: 100, duration: 14});  
     tl.to(camera.position, {y: 30, duration: 16});  
     tl.to(camera.position, {z: 0, duration: 18});  
     tl.to(camera.position, {y: 20, duration: 14});  
     tl.to(camera.position, {z: 150, duration: 16});
}
//cameraFront controls
function cameraFrontMove(){
     let tl = gsap.timeline({repeat: 43, repeatDelay: 5});
     tl.to(cameraFront.position, {y: 30, delay: 5, duration:12});
     tl.to(cameraFront.position, {z: 30, duration: 16});
     tl.to(cameraFront.position, {z: 100, duration: 16});
     tl.to(cameraFront.position, {x: -30, duration: 18});
     tl.to(cameraFront.position, {y: 20, duration: 18});
     tl.to(cameraFront.position, {x: 98, duration: 14});
     tl.to(cameraFront.position, {x: 0, duration: 12});
     tl.to(cameraFront.position, {x: -90, duration: 12});
     tl.to(cameraFront.position, {z: 50 , duration: 16});
     tl.to(cameraFront.position, {y: 40 , duration: 12});
     tl.to(cameraFront.position, {x: 30  , duration: 16});
     tl.to(cameraFront.position, {z: 78, duration: 16}); 
     tl.to(cameraFront.position, {y: 25, duration: 14}); 
     tl.to(cameraFront.position, {x: 30, duration: 14}); 
     tl.to(cameraFront.position, {x: -30, duration: 16}); 
     tl.to(cameraFront.position, {x: 1, duration: 18});  
     tl.to(cameraFront.position, {z: 50, duration: 14});  
     tl.to(cameraFront.position, {y: 20, duration: 16});  
     tl.to(cameraFront.position, {z: 90, duration: 18});  
     tl.to(cameraFront.position, {y: 0, duration: 14});  
     tl.to(cameraFront.position, {z: 170, duration: 16});
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.75);
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

     const pointLight = new THREE.PointLight(0xdddddd, 0.5);
     pointLight.position.set(0, 60, 2);
     scene.add(pointLight);
}

function createSky(){
     let materialArray = [];
     let texture_up = textureLoader.load( './textures/panorama_sphere/py.png');
     let texture_dn = textureLoader.load( './textures/panorama_sphere/ny.png');
     let texture_ft = textureLoader.load( './textures/panorama_sphere/pz.png');
     let texture_bk = textureLoader.load( './textures/panorama_sphere/nz.png');
     let texture_rt = textureLoader.load( './textures/panorama_sphere/px.png');
     let texture_lf = textureLoader.load( './textures/panorama_sphere/nx.png');     
          
     materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
     materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
     materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
     materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
     materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
     materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));

     for (let i = 0; i < 6; i++){
          materialArray[i].side = THREE.BackSide;
     }

     let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
     let skybox = new THREE.Mesh( skyboxGeo, materialArray );
     
     scene.add( skybox );  
};

function createSphere(){
     const geo = new THREE.SphereGeometry(94, 30, 30, 0, Math.PI);
     const mat = new THREE.MeshPhongMaterial({
          //color: 0x3366ff,
          map: textureLoader.load('./textures/planet_earth.jpg'),
          side: THREE.DoubleSide,
     })
     const sphere = new THREE.Mesh(geo, mat);
     sphere.rotation.x = Math.PI/2;
     scene.add(sphere);
     
}

function createCompass(){
     const geo = new THREE.CircleGeometry(65);
     const mat = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          map: textureLoader.load('./textures/Compass-Rose-drawing.png'),
     })
     const compass = new THREE.Mesh(geo, mat);
     compass.rotation.x = -Math.PI/2;
     compass.castShadow = true;
     compass.receiveShadow = true;
     compass.position.y = -50;
     scene.add(compass);
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
     const ringGeo = new THREE.TorusGeometry(12, 1, 16, 100);
     const ringMat = new THREE.MeshPhongMaterial({
          color: 0xeeeeee,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5


     })
     ring = new THREE.Mesh(ringGeo, ringMat);
     ring.rotation.x = -Math.PI / 2;
     ring.position.y = 178.4;
     ring.castShadow = true;
     ring.receiveShadow = true;
     groupRing.add(ring);
     //scene.add(ring);

     //Top ring
     const topRingGeo = new THREE.TorusGeometry(12.5, 1, 16, 100);
     const topRing = new THREE.Mesh(topRingGeo, ringMat);
     topRing.rotation.x = -Math.PI/2 + Math.PI / 18;
     topRing.position.y = 174;
     topRing.castShadow = true;
     topRing.receiveShadow = true;
     groupRing.add(topRing);
     //scene.add(topRing);
     scene.add(groupRing);

     // inner ring
     const innerRingGeo = new THREE.TorusGeometry(2, 1, 16, 10);
     const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
     innerRing.rotation.x = -Math.PI/2;
     innerRing.position.y = 169.5;
     innerRing.castShadow = true;
     innerRing.receiveShadow = true;
     scene.add(innerRing);

     //outerRing
     const outerRingGeo = new THREE.TorusGeometry(92.75, 0.5, 16, 100);
     const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
     outerRing.position.y = 0;
     outerRing.rotation.x = -Math.PI/2;
     outerRing.castShadow = true;
     outerRing.receiveShadow = true;
     scene.add(outerRing);

}

///// Vibraphone right(outer-hidden/left(inner)
function createVibraphone(){
     for(let i = 0; i < 720; i++){
          const cube = createCube();
          cube.material.color = new THREE.Color(colors[i % 21]);
          cube.scale.set(0.5, 10, 0.625);
          let angle = Math.PI * 2 / 720;
          let radius = 92.5;
          cube.position.x = radius * Math.cos(angle * i);
          cube.position.z = radius * Math.sin(angle * i);
          rightCubes.push(cube);
          cube.rotation.y = -angle * i;
          rightCubes.push(cube);
          groupOuter.add(cube);
          groupOuter.position.set(0, 0, 0);
     }
     scene.add(groupOuter);

     /* for(let i = 0; i < 21; i++){
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
     } */
     //scene.add(groupLeft);
}

///// pendulum string mesh / ball mesh

function createStringMesh(){
     const geometry = new THREE.CylinderGeometry(0.7 * stringWidth, stringWidth, stringLength);
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
          roughnessMap: metalTextureRoughness,
          roughness: 0.5,
          metalness: 1,
          //envMap: envMap
     })
     const ball = new THREE.Mesh(geometry, material);
     ball.castShadow = true;
     ball.receiveShadow = true;
     scene.add(ball);
     return ball;
}

function createHookMesh(){
      //ball cylinder cube
     const cylGeo = new THREE.CylinderGeometry(3, 0.1, 12);
     const material = new THREE.MeshStandardMaterial({
          //color: 0xaaaaaa,
          map: metalTextureColor,
          roughnessMap: metalTextureRoughness,
          roughness: 0.5,
          metalness: 1,
          //envMap: envMap
     })
     const hook = new THREE.Mesh(cylGeo, material);
     hook.castShadow = true;
     hook.receiveShadow = true;
     scene.add(hook);     
     return hook;
}
    


class Pendulum {
     constructor(string, ball, hook, frequency, amplitude){
          this.string = string;
          this.ball = ball;
          this.hook = hook;
          this.frequency = frequency;
          this.amplitude = amplitude;
          //this.a = a;
     }
     update(totalTime){
          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);
          this.hook.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/1000);
          
          //23hrs 56min 1sec = 86161 seconds, 360/86161 = 0.00417822448 deg
          //rotation by angle    
          this.string.rotation.y += -Math.PI * 0.432 / 86161;       
          this.ball.rotation.y += -Math.PI * 0.432 / 86161;  
          this.hook.rotation.y += -Math.PI * 0.432 / 86161;    

         /* this.string.rotation.y = -0.005 * totalTime / 10000;       
          this.ball.rotation.y = -0.005* totalTime / 10000;
          this.hook.rotation.y = -0.005  * totalTime / 10000;  */

        /*  this.string.rotation.y = -Math.PI * 1/360 * totalTime / 10000;       
          this.ball.rotation.y = -Math.PI * 1/360 * totalTime / 10000;
          this.hook.rotation.y = -Math.PI * 1/360 * totalTime / 10000;  */
     }
};
//console.log(Math.sin(45.47 * Math.PI/180) * 67);
function createPendulum(origin, frequency, amplitude, a){
     const stringMesh = createStringMesh();
     stringMesh.position.add(origin);
     stringMesh.rotation.y = a;
     stringMesh.translateY(stringLength);
     stringMesh.geometry.translate(0, -(stringLength * 0.5), 0);

     const ballMesh = createBallMesh();
     ballMesh.position.add(origin);
     ballMesh.rotation.y = a;
     ballMesh.translateY(stringLength);
     ballMesh.geometry.translate(0, -stringLength, 0);

     const hookMesh = createHookMesh();
     hookMesh.position.add(origin);
     hookMesh.rotation.y = a;
     hookMesh.translateY(stringLength);
     hookMesh.geometry.translate(0, -stringLength - 14, 0);

     const p = new Pendulum(stringMesh, ballMesh, hookMesh, frequency, amplitude, a);
     
     return p; //a is for angle positions
};

//const pendulums = [];

//for(let i = 0; i < maxPendulum; i++){
     let radius = 32;
     
     //let angle = Math.PI * 2 / 21;
     let posX = radius * Math.cos(Math.PI/180);
     let posZ = radius * Math.sin(Math.PI/180);

     pendulum = createPendulum(new THREE.Vector3(0, 0, 0), 0.0125 + 0.51,  Math.PI / 6 + 0.0001, 0);
  //   pendulums.push(pendulum);
//}

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
     renderer.setScissor(window.innerWidth - insetWidth - 8,  insetHeight / 5 - 16,
          insetWidth, insetHeight);
     renderer.setViewport(window.innerWidth - insetWidth - 8,  insetHeight / 5 - 32, insetWidth, insetHeight);
     renderer.render(scene, cameraFront);

     // top
     renderer.setScissor(8,  insetHeight / 4 - 32,
          insetWidth, insetHeight);
     renderer.setViewport(8,  insetHeight / 4 - 32, insetWidth, insetHeight);
     renderer.render(scene, cameraTop);
     
     renderer.setScissorTest(false);
}

function update(totalTime){
     orbitControls.update();
     groupRing.rotation.y += 0.02;
     
     pendulum.update(totalTime);

     
     
          if(pendulum.ball.rotation.z <= -0.52315) {   
              if(soundEnabled){

                   playKey(Math.floor(count) % 61);           
              }
                if(pulseEnabled){  
                    gsap.to(rightCubes[Math.floor(count) + 720].rotation, {z: -Math.PI/2, duration: 0.751, ease: 'power3'}) ;                  
                    //gsap.to(ring.material, {opacity: 1, duration: 0.5}) ; 
                    gsap.to(rightCubes[Math.floor(count) + 720].rotation, {z: 0, delay: 1500, duration: 500}) ;  
                    //gsap.to(ring.material, {opacity: 0.5, duration: 0.5}) ; 
               } 
          } 
          else if(pendulum.ball.rotation.z >= 0.52315) {
              
               if(soundEnabled){
                    playKey(Math.floor(count + 1) % 61);
               }
                if(pulseEnabled){
                    
                    gsap.to(rightCubes[Math.floor(count)].rotation, {z: -Math.PI/2, duration: 0.751, ease: 'power3'}) ;
                    gsap.to(rightCubes[Math.floor(count)].material, {opacity: 1, duration: 0.5}) ; 
                    gsap.to(rightCubes[Math.floor(count)].rotation, {z: 0, delay: 1500, duration: 500}) ;  
                    gsap.to(rightCubes[Math.floor(count)].material, {opacity: 0.8, duration: 1}) ; 
                    count += 1/4;
               }
          } 
         // console.log(pendulum.ball.rotation.y);

         
      
   
     
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
