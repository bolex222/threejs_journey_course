import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

import SHCCLogo from '../img/img.png'

const renderContextCanvas = document.getElementById('render_context')
const screenSize = { width: window.innerWidth, height: window.innerHeight }

/**
 * GUI declaration
 * @type {GUI}
 */
const gui = new dat.GUI()


/**
 * Scene declaration
 */
const scene = new THREE.Scene()

/**
 * Camera declaration
 */
const aspectRatio = screenSize.width / screenSize.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio)
scene.add(camera)
camera.position.set(0, 0, 4)


/**
 * add control to the camera
 */
const controls = new OrbitControls(camera, renderContextCanvas)
controls.enableDamping = true


/**
 * add some AxesHelper
 */
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)


/**
 * create the mesh
 * and add it to the camera
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// debug
gui.add(mesh.rotation, 'x', -3, 3, 0.1)
gui.add(mesh.rotation, 'y', -3, 3, 0.1)
gui.add(mesh.rotation, 'z', -3, 3, 0.1)
gui.add(material, 'wireframe')
gui.addColor({color: 0xffffff}, 'color')
  .onChange((value) => {
    material.color.set(value)
})


/**
 * createTexture
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(SHCCLogo)
const img = new Image()
img.src = SHCCLogo
material.map = texture


img.onload = () => {
  texture.repeat.x = img.height / img.width
  texture.offset.x = 0.315
  texture.repeat.y = 1

  gui.add(texture.offset, 'x', 0, 1, 0.01)
}
console.log(img)




/**
 * Render the Scene
 */
const renderer = new THREE.WebGLRenderer({
  canvas: renderContextCanvas
})
renderer.setSize(screenSize.width, screenSize.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Resize and adapt Scene at screen resizing
 */
const handleScreenResize = () => {
  screenSize.height = window.innerHeight
  screenSize.width = window.innerWidth
  camera.aspect = screenSize.width / screenSize.height
  camera.updateProjectionMatrix()
  renderer.setSize(screenSize.width, screenSize.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}


/**
 * full screen at dbl click
 */
const handleDblClick = () => {
  const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (fullScreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().then()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  } else {
    if(renderContextCanvas.requestFullscreen) {
      renderContextCanvas.requestFullscreen()
    } else if (renderContextCanvas.webkitRequestFullscreen) {
      renderContextCanvas.webkitRequestFullscreen()
    }
  }
}

/**
 * Event Listeners
 */
window.addEventListener('dblclick', handleDblClick)
window.addEventListener('resize', handleScreenResize)

/**
 * rendering
 */
renderer.render(scene, camera)


/**
 * Animate
 */
const tick = () => {
  controls.update()
  renderer.render(scene, camera)
  //threeBoxGroup.rotation.y += 0.01
  window.requestAnimationFrame(tick)
}
tick()



// Move cube from mouse
