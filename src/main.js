import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

const renderContextCanvas = document.getElementById('render_context')
const screenSize = { width: window.innerWidth, height: window.innerHeight }

// create Scene
const scene = new THREE.Scene()

// camera
const camera = new THREE.PerspectiveCamera(75, screenSize.width / screenSize.height)
scene.add(camera)
camera.position.set(4, 4, 4)

// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

//create a group
const threeBoxGroup = new THREE.Group()
scene.add(threeBoxGroup)

//create 3 box for the group above
const allBoxes = []

Array(3).fill(undefined).forEach((value, index) => {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  box.position.x = index * 2
  allBoxes.push(box)
  threeBoxGroup.add(box)
})

allBoxes.forEach(elem => {
  elem.position.x += -allBoxes.length + 1
})

camera.lookAt(threeBoxGroup.position)

// create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: renderContextCanvas
})
renderer.setSize(screenSize.width, screenSize.height)

const handleScreenResize = () => {
  screenSize.height = window.innerHeight
  screenSize.width = window.innerWidth
  camera.aspect = screenSize.width / screenSize.height
  camera.updateProjectionMatrix()
  renderer.setSize(screenSize.width, screenSize.height)
}

window.addEventListener('resize', handleScreenResize)

renderer.render(scene, camera)


// ANIMATION :
/**
 * Animate
 */

const clock = new THREE.Clock()

gsap.to(camera.position, {
  y: 25,
  z: 25, duration: 1, ease: 'power1.out', repeat: -1, yoyo: true })

const tick = () => {
  camera.lookAt(threeBoxGroup.position)
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
