import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'

import './style.css'

const canvas = document.getElementById('render_context')

const gui = new GUI()


/**
 * Screen Size
 */
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

const resizeScreen = () => {
  size.width = window.innerWidth
  size.height = window.innerHeight
}

/**
 * renderer
 * //@type {THREE.WebGLRenderer}
 */
const renderer = new THREE.WebGLRenderer({canvas})
renderer.shadowMap.enabled = true


/**
 * Scene
 * @type {THREE.Scene}
 */
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper())

/**
 * Camera
 * /@type {THREE.PerspectiveCamera}
 */
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000)
camera.position.z = 2


/**
 * Control
 */
new OrbitControls(camera, canvas)


/**
 * objects
 */
const plan = new THREE.PlaneGeometry(1000, 1000)
const sphere = new THREE.SphereGeometry(0.5)

const materialWhite = new THREE.MeshStandardMaterial()
materialWhite.roughness = 0.4

const planMesh = new THREE.Mesh(plan, materialWhite)
const sphereMesh = new THREE.Mesh(sphere, materialWhite)

sphereMesh.castShadow = true
planMesh.receiveShadow = true

planMesh.position.y = -2
planMesh.rotation.x = -0.5 * Math.PI

scene.add(planMesh, sphereMesh)


/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
ambientLight.position.set(2, 2, 0)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2,2,0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 7
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2

directionalLight.shadow.radius = 20
scene.add(directionalLight)

const directionalLightShadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightShadowCameraHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000)
scene.add(directionalLightHelper)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
window.addEventListener('resize', resizeScreen)

const clock = new THREE.Clock()

const tick = () => {
  renderer.setSize(size.width, size.height)
  camera.aspect = size.width /size.height
  const timeSince = clock.getElapsedTime()

  //directionalLight.position.set(2 * Math.sin(timeSince / 2), 2, 2*Math.cos(timeSince / 2))
  directionalLightHelper.update()


  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
