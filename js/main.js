import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as THREE from 'three';
import '../css/style.css'

const canvas = document.querySelector('canvas.webgl')

const textureLoader = new THREE.TextureLoader()
//const normalTexture = textureLoader.load('/assets/textures/NormalMap.png')

const clock = new THREE.Clock();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  return renderer
}

const createSphere = () => {
  const geometry = new THREE.SphereGeometry(1, 64, 64 );
  const material = new THREE.MeshStandardMaterial()
  material.metalness = 0.7
  material.roughness = 0.5
  material.color = new THREE.Color(0x222222)

  return new THREE.Mesh(geometry,material)
}

const createLights = () => {
  const redLight = new THREE.PointLight(0xff2222, 2)
  redLight.position.set(-2,1,0)

  const blueLight = new THREE.PointLight( 0x1111ff, 2)
  blueLight.position.set(2,1,0)

  const whiteLight = new THREE.AmbientLight(0xffffff,0.5)

  return {blueLight, redLight, whiteLight}
}

const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 2

  return camera
}

const scene = new THREE.Scene()
const renderer = createRenderer()

const sphere = createSphere()
scene.add(sphere)

const {blueLight, redLight, whiteLight} = createLights()
scene.add(redLight, blueLight, whiteLight)

const camera = createCamera()
scene.add(camera)

function update() {
  const elapsedTime = clock.getElapsedTime()
 	sphere.rotation.x = .01 * elapsedTime

  renderer.render(scene, camera)

	requestAnimationFrame( update );

}

update();

window.addEventListener('resize', () =>{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('wheel', (event) => {
  camera.position.z += event.deltaY/500 ;
})
