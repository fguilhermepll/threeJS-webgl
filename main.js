import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true});
var sceneObjects = [];

const controls = new OrbitControls(camera, renderer.domElement);

function init(){
  camera.position.z = 5;
  controls.update();

  renderer.setClearColor("#e5e5e5");
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', () =>{
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();
  })
}

const loader = new GLTFLoader();
var carObj;

function loadingObject(){
  loader.load( 'firetruck.glb', function ( gltf ) {
    carObj = gltf.scene;
    scene.add( gltf.scene );
    render();
  
  }, undefined, function ( error ) {
  
    console.error( error );
  
  });
}

function addCube(){
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 1;
  scene.add(mesh);
  sceneObjects.push(mesh);
}

function addLight(){
  var light = new THREE.PointLight(0xFFFFFF, 1, 500);
  light.position.set(10, 0, 25);
  scene.add(light);
  sceneObjects.push(light);
}

function vertexShader() {
    return `
      varying vec3 vUv; 
  
      void main() {
        vUv = position; 
  
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
      }
    `
}

function fragmentShader() {
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
      }
  `
}

function addExperimentalCube() {
    let uniforms = {
          colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
          colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
      }
  
    let geometry = new THREE.BoxGeometry(1, 1, 1)
    let material =  new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: fragmentShader(),
      vertexShader: vertexShader(),
    })
  
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = -1;
    scene.add(mesh);
    sceneObjects.push(mesh);
}

var render = function(){
    requestAnimationFrame(render);
    
    //carObj.rotation.x += 0.01
    carObj.rotation.y += 0.01

    for(let object of sceneObjects) {
        object.rotation.x += 0.01
        object.rotation.y += 0.03
      }
    controls.update();
    renderer.render(scene, camera);
}

function main(){
  init();
  addExperimentalCube();
  addCube();
  loadingObject();
  addLight();
}

main();