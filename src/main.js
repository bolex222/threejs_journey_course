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
const cube = new THREE.BoxGeometry()
const torus = new THREE.TorusGeometry(0.35, 0.15, 16, 32)
const sphere = new THREE.SphereGeometry(0.5)

const materialRed = new THREE.MeshStandardMaterial({color: 'red', roughness: 0.4})
const materialGreen = new THREE.MeshStandardMaterial({color: 'green', roughness: 0.4})
const materialWhite = new THREE.MeshStandardMaterial()
materialWhite.roughness = 0.4
materialGreen.side = THREE.DoubleSide

const planMesh = new THREE.Mesh(plan, materialWhite)
const cubeMesh = new THREE.Mesh(cube, materialWhite)
const torusMesh = new THREE.Mesh(torus, materialWhite)
const sphereMesh = new THREE.Mesh(sphere, materialWhite)

planMesh.position.y = -2
planMesh.rotation.x = -0.5 * Math.PI
cubeMesh.position.x = 2
sphereMesh.position.x = -2

scene.add(planMesh, cubeMesh, torusMesh, sphereMesh)


/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
//scene.add(directionalLight)
const light = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
//scene.add(light)
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
//pointLight.position.y = -1
pointLight.position.set(0, - 1, 0)
//scene.add(pointLight)
light.position.set(1, 0.25, 0)

const rectLight = new THREE.RectAreaLight(0xff0000, 0.5, 0.5, 0.5)
rectLight.position.set(sphereMesh.position.x, -0.5, sphereMesh.position.z)
rectLight.lookAt(sphereMesh.position)
scene.add(rectLight)

const spotLight = new THREE.SpotLight(0xff00ff, 0.5)
scene.add(spotLight)
spotLight.position.x = 5

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

//spotLight.position.x = 5
//spotLight.target.position.set(3, 3, 3)
scene.add(spotLight.target)

gui.add(light, 'intensity').min(0).max(1).step(0.001)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
window.addEventListener('resize', resizeScreen)

const clock = new THREE.Clock()

const tick = () => {
  renderer.setSize(size.width, size.height)
  camera.aspect = size.width /size.height
  const timeSince = clock.getElapsedTime()
  //light.position.set(Math.sin(timeSince) * 2, 3, Math.cos(timeSince) * 2)


  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
