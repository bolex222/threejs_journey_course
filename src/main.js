import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
// import { T } from 'three/examples/jsm/geometries/To'
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
gui.add(controls, 'enableDamping')


/**
 * add some AxesHelper
 */
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)


/**
 * Create Meshes
 */
//const material = new THREE.MeshBasicMaterial({wireframe: false})
// const material = new THREE.MeshNormalMaterial({wireframe: false})
// const material = new THREE.MeshMatcapMaterial()
//
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
// const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
// const torus = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.15, 16, 32), material)
// scene.add(sphere, plane, torus)
//
// sphere.position.x = -1.5
// torus.position.x = 1.5
// const clock = new THREE.Clock()
//
// const meshAnimation = () => {
//   const elapsedTime = clock.getElapsedTime()
//
//   // Update objects
//   sphere.rotation.y = 0.1 * elapsedTime
//   plane.rotation.y = 0.1 * elapsedTime
//   torus.rotation.y = 0.1 * elapsedTime
//
//   sphere.rotation.x = 0.15 * elapsedTime
//   plane.rotation.x = 0.15 * elapsedTime
//   torus.rotation.x = 0.15 * elapsedTime
// }

// debug
// gui.add(material, 'wireframe')


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
//
// const doorColorTexture = textureLoader.load('../img/textures/door/color.jpg')
// const doorAlphaTexture = textureLoader.load('../img/textures/door/alpha.jpg')
// const doorAmbientOcclusionTexture = textureLoader.load('../img/textures/door/ambientOcclusion.jpg')
// const doorHeightTexture = textureLoader.load('../img/textures/door/height.jpg')
// const doorNormalTexture = textureLoader.load('../img/textures/door/normal.jpg')
// const doorMetalnessTexture = textureLoader.load('../img/textures/door/metalness.jpg')
// const doorRoughnessTexture = textureLoader.load('../img/textures/door/roughness.jpg')
// const gradientTexture = textureLoader.load('../img/textures/gradients/3.jpg')
// //const matcapTexture = textureLoader.load('../img/textures/matcaps/1.png')
// //const matcapTexture = textureLoader.load('../img/textures/matcaps/2.png')
// //const matcapTexture = textureLoader.load('../img/textures/matcaps/3.png')
// //const matcapTexture = textureLoader.load('../img/textures/matcaps/4.png')
//const matcapTexture = textureLoader.load('../img/textures/matcaps/5.png')
// //const matcapTexture = textureLoader.load('../img/textures/matcaps/6.png')
// const matcapTexture = textureLoader.load('../img/textures/matcaps/7.png')
const matcapTexture = textureLoader.load('../img/textures/matcaps/8.png')
//


// material.map = doorColorTexture
//material.color = new THREE.Color('#f00')
// material.transparent = true
//material.opacity = 0.5
// material.side = THREE.DoubleSide
//
// material.matcap = matcapTexture

/**
 * Text 3d
 */

const fontLoader = new FontLoader()
//
fontLoader.load('../fonts/NuitoSans_Bold.typeface.json', (font) => {
  const textGeometry  = new TextGeometry('Three.js', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4
  })
  textGeometry.computeBoundingBox()
  console.log(textGeometry.boundingBox)
  const { max, min } = textGeometry.boundingBox
  // const width = max.x - min.x
  // const depth = max.z - min.z
  const textMaterial = new THREE.MeshMatcapMaterial()
  const text = new THREE.Mesh(textGeometry, textMaterial)
  textMaterial.matcap = matcapTexture
  textMaterial.side = THREE.DoubleSide
  // textGeometry.translate(
  //   -width/2 + 2*textGeometry.parameters.options.bevelSize,
  //   textGeometry.parameters.options.bevelSize,
  //   -depth/2 + textGeometry.parameters.options.bevelSize
  // )
  textGeometry.center()
  textGeometry.computeBoundingBox()
  //gui.add(textMaterial, 'wireframe')
  scene.add(text)
  console.log(textGeometry.boundingBox)

  const torusGeometry = new THREE.TorusGeometry(0.35, 0.15, 16, 32)
  for (let i = 0; i < 200; i++) {
    console.log('here')
    const torus = new THREE.Mesh(torusGeometry, textMaterial)

    const haha = Math.random() * 25
    const hihi = Math.random() * 25
    const x = Math.sin(haha) * hihi
    const z = Math.cos(haha) * hihi
    torus.position.set(
      x,
      Math.sin(Math.random() * 25) * Math.sqrt(-((x*x) + (z*z) - (25*25))),
      z
    )

    const a = Math.random() * 360
    torus.rotation.set(
      a,a,a
    )

    const size = Math.random() * 2
    torus.scale.set(size, size, size)
    scene.add(torus)
  }

})


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
  //meshAnimation()
  window.requestAnimationFrame(tick)
}
tick()



// Move cube from mouse
