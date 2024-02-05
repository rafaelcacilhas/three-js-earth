import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import '../css/style.css'
import getStarField from './getStarfield'

const canvas = document.querySelector('canvas.webgl')

const textureLoader = new THREE.TextureLoader()
const earthMap = textureLoader.load('/assets/textures/earthmap1k.jpg')
const lightsMap = textureLoader.load('/assets/textures/03_earthlights1k.jpg')
const cloudsMap = textureLoader.load('/assets/textures/05_earthcloudmaptrans.jpg')
const heightsMap = textureLoader.load('/assets/textures/01_earthbump1k.jpg')

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

const createLights = () => {
  const whiteLight = new THREE.DirectionalLight(0xffffff,3)
  whiteLight.position.set(-4,1,3)
  return {whiteLight}
}

const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 2

  return camera
}

const createSphere = (celestialBody) => {
  const geometry = new THREE.IcosahedronGeometry(1, 6 );
  let material = new THREE.MeshStandardMaterial()
  const celestialBodyGroup = new THREE.Group

  if(celestialBody == "earth"){
     material.map = earthMap

     const lightMaterial = new THREE.MeshStandardMaterial({
       map: lightsMap,
       blending:THREE.MultiplyBlending,
       opacity: 1
     })
     const earthLights = new THREE.Mesh(geometry, lightMaterial)
     celestialBodyGroup.add(earthLights)

     const cloudsMaterial = new THREE.MeshStandardMaterial({
       map: cloudsMap,
       blending:THREE.AdditiveBlending,
       opacity: 0.1
     })
     const clouds = new THREE.Mesh(geometry, cloudsMaterial)
     celestialBodyGroup.add(clouds)

     const heightsMaterial = new THREE.MeshStandardMaterial({
       map: heightsMap,
       blending:THREE.AdditiveBlending,
       opacity: 0.2
     })
     const heights = new THREE.Mesh(geometry, heightsMaterial)
     celestialBodyGroup.add(heights)
  }

  if(celestialBody =="sun"){
    material = new THREE.MeshBasicMaterial()
  }

  celestialBodyGroup.add(new THREE.Mesh(geometry,material))
  return celestialBodyGroup
}

const scene = new THREE.Scene()
const renderer = createRenderer()

const { whiteLight} = createLights()
scene.add( whiteLight)

const camera = createCamera()
scene.add(camera)

new OrbitControls(camera, renderer.domElement)

const sphere = createSphere("earth")
const earthGroup = new THREE.Group()
earthGroup.add(sphere)
earthGroup.rotation.z = -23.4*Math.PI / 180
scene.add(earthGroup)

const stars = getStarField()
scene.add(stars)

const sun = createSphere("sun")
sun.position.set(-4,1,3)
scene.add(sun)

function update() {
  const elapsedTime = clock.getElapsedTime()
 	sphere.rotation.y = .2 * elapsedTime

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
