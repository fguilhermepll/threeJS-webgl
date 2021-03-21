var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
var renderer = new THREE.WebGLRenderer({antialias: true});
var sceneObjects = [];

camera.position.z = 5;

renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () =>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})

addExperimentalCube();

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
sceneObjects.push(mesh);

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10, 0, 25);
scene.add(light);
sceneObjects.push(light);

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
    mesh.position.x = 2;
    scene.add(mesh);
    sceneObjects.push(mesh);
}

// movement - please calibrate these values
var render = function(){
    requestAnimationFrame(render);
    
    for(let object of sceneObjects) {
        object.rotation.x += 0.01
        object.rotation.y += 0.03
      }

    renderer.render(scene, camera);
}

render();