import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'

import './style.css'
import { BoxGeometry, MeshStandardMaterial } from 'three'

const canvas = document.getElementById('render_context')

const gui = new GUI()

/**
 * Colors
 */
const bgColor = '#1d202d'
const floorColor = '#3d3f32'


/**
 * Screen Size
 */
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * renderer
 * //@type {THREE.WebGLRenderer}
 */
const renderer = new THREE.WebGLRenderer({canvas})
renderer.shadowMap.enabled = true
renderer.setClearColor(bgColor)


/**
 * Scene
 * @type {THREE.Scene}
 */
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper())

/**
 * Camera
 * /@type {THREE.Camera}
 */
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000)
camera.position.x = 0.4307483315251566
camera.position.y = 0.9248873680385761
camera.position.z = 1.3667393607577953

/**
 *
 * @type {dat.gui.GUI}
 */
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x').color = 0xff000
cameraFolder.add(camera.position, 'y').color = '#ff000'
cameraFolder.add(camera.position, 'z').color = '#ff000'


const resizeScreen = () => {
  console.log('resize')
  size.width = window.innerWidth
  size.height = window.innerHeight
  camera.aspect = size.width /size.height
}

/**
 * Control
 */
const control = new OrbitControls(camera, canvas)
control.addEventListener('change', () => {gui.updateDisplay()})

/**
 * Fog
 */

const fog = new THREE.Fog(bgColor, 1, 10)
scene.fog = fog


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const textureDoorAlpha = textureLoader.load('/img/textures/door/alpha.jpg')
const textureDoorAmbientOcclusion = textureLoader.load('/img/textures/door/ambientOcclusion.jpg')
const textureDoorColor = textureLoader.load('/img/textures/door/color.jpg')
const textureDoorHeight = textureLoader.load('/img/textures/door/height.jpg')
const textureDoorMetalness = textureLoader.load('/img/textures/door/metalness.jpg')
const textureDoorNormal = textureLoader.load('/img/textures/door/normal.jpg')
const textureDoorRoughness = textureLoader.load('/img/textures/door/roughness.jpg')

const textureBrickColor = textureLoader.load('/img/textures/bricks/color.jpg')
const textureBrickNormal = textureLoader.load('/img/textures/bricks/normal.jpg')
const textureBrickRoughness = textureLoader.load('/img/textures/bricks/roughness.jpg')
const textureBrickAmbient = textureLoader.load('/img/textures/bricks/ambientOcclusion.jpg')

const textureGrassColor = textureLoader.load('/img/textures/grass/color.jpg')
const textureGrassNormal = textureLoader.load('/img/textures/grass/normal.jpg')
const textureGrassRoughness = textureLoader.load('/img/textures/grass/roughness.jpg')
const textureGrassAmbient = textureLoader.load('/img/textures/grass/ambientOcclusion.jpg')

textureGrassColor.repeat.set(32,32)
textureGrassNormal.repeat.set(32,32)
textureGrassRoughness.repeat.set(32,32)
textureGrassAmbient.repeat.set(32,32)

textureGrassColor.wrapS = textureGrassColor.wrapT = true
textureGrassNormal.wrapS = textureGrassNormal.wrapT = true
textureGrassRoughness.wrapS = textureGrassRoughness.wrapT = true
textureGrassAmbient.wrapS = textureGrassAmbient.wrapT = true


/**
 * Ghost
 */
const ghost = new THREE.PointLight(0xff00ff, 1, 3)
ghost.position.set(2, 2, 2)
ghost.castShadow = true
scene.add(ghost)

const ghostHelper = new THREE.PointLightHelper(ghost)
//scene.add(ghostHelper)



/**
 * objects
 */
const greyBasicMaterial = new THREE.MeshStandardMaterial({
  color: '#7B8491',
  wireframe: false})
gui.add(greyBasicMaterial, 'wireframe')
const house = new THREE.Group()

const planeGeometry = new THREE.PlaneGeometry(100, 100)
const floorMAterial = new MeshStandardMaterial({
  map: textureGrassColor,
  normalMap: textureGrassNormal,
  roughnessMap: textureGrassRoughness,
  aoMap: textureGrassAmbient
})
const plane = new THREE.Mesh(planeGeometry, floorMAterial)
plane.receiveShadow = true
plane.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2))
plane.rotation.x = - Math.PI / 2
scene.add(plane)

const houseBlockGeometry = new THREE.BoxGeometry(2, 1, 2)
const houseBlock = new THREE.Mesh(houseBlockGeometry,
  new THREE.MeshStandardMaterial({
    map: textureBrickColor,
    normalMap: textureBrickNormal,
    aoMap: textureBrickAmbient,
    roughnessMap: textureBrickRoughness
  }))
houseBlock.receiveShadow = true
houseBlock.castShadow = true
houseBlock.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(houseBlock.geometry.attributes.uv.array, 2))
houseBlock.position.y = houseBlock.geometry.parameters.height / 2
house.add(houseBlock)

const roofGeometry = new THREE.ConeGeometry(1.7, 0.5, 4)
const roof = new THREE.Mesh(roofGeometry,
  new THREE.MeshStandardMaterial({color: '#b4843b'}))
roof.position.y = 1 + roofGeometry.parameters.height / 2
roof.rotation.y = Math.PI / 4
roof.receiveShadow = true
roof.castShadow = true
house.add(roof)

const doorGeometry = new THREE.PlaneGeometry(0.8, 0.8, 100, 100)
const door = new THREE.Mesh(doorGeometry,
  new THREE.MeshStandardMaterial({
    map: textureDoorColor,
    transparent: true,
    alphaMap: textureDoorAlpha,
    displacementMap: textureDoorHeight,
    displacementScale: 0.05,
    metalnessMap: textureDoorMetalness,
    roughnessMap: textureDoorRoughness,
    aoMap: textureDoorAmbientOcclusion,
    normalMap: textureDoorNormal
  }))
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.z = 0.99
door.position.y = 0.36
house.add(door)

scene.add(house)


/**
 * Light
 */
const ambientLight = new THREE.AmbientLight('#303044', 0.3)
ambientLight.position.y = 4
scene.add(ambientLight)
gui.add(ambientLight, 'intensity', 0, 10)

const pointLight = new THREE.PointLight('#7e6c32')
pointLight.position.set(0, 0.85, 1.1)
scene.add(pointLight)
pointLight.castShadow = true
gui.add(pointLight, 'intensity', 0, 5)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1, 0xff0000)
// scene.add(pointLightHelper)


/**
 * grave stone
 */
const graveMaterial = new MeshStandardMaterial({
  color: '#78787c'
})

const coordList = []
const graveGeometry = new BoxGeometry(0.3, 0.6, 0.1)
for (let i = 0; i < 50; i++){
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  const rand1 = Math.random() * Math.PI * 2
  const rand2 = Math.random() * 5 + 2.5
  const temp = {x: Math.ceil(Math.sin(rand1) * rand2), z: Math.ceil(Math.cos(rand1) * rand2)}
  const test = coordList.find(e => e.x === temp.x && e.z === temp.z)
  if (!test) {
    coordList.push(temp)
    grave.position.x = temp.x
    grave.position.z = temp.z
    grave.rotation.y = Math.random() * 2 * Math.PI
    grave.rotation.z = Math.random() *  - 0.5
    grave.receiveShadow = true
    grave.castShadow = true
    scene.add(grave)
  }
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
window.addEventListener('resize', resizeScreen)
const clock = new THREE.Clock()

const tick = () => {
  renderer.setSize(size.width, size.height)
  const timeSince = clock.getElapsedTime()

  ghost.position.set(Math.sin(timeSince) * 2, Math.sin(timeSince * 2) + 1, Math.cos(timeSince) * 2)


  control.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
