import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const renderContextCanvas = document.getElementById('render_context')
const screenSize = { width: window.innerWidth, height: window.innerHeight }

// create Scene
const scene = new THREE.Scene()

// camera
const aspectRatio = screenSize.width / screenSize.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio)
// const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1)
scene.add(camera)
camera.position.set(0, 0, 4)

// Controls

const controls = new OrbitControls(camera, renderContextCanvas)
controls.enableDamping = true
// controls.target.y = 1
// controls.update()



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

const tick = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()



// Move cube from mouse

/**
 *
 * @param {MouseEvent}event
 */

const cursor = {
  x: 0,
  y: 0
}
const onMouseMove = event => {
  cursor.x = event.clientX / screenSize.width - 0.5
  cursor.y = event.clientY / screenSize.height - 0.5

  camera.position.x = Math.sin(-cursor.x * 2 * Math.PI) * 4
  camera.position.z = Math.cos(-cursor.x * 2 * Math.PI) * 4
  camera.position.y = cursor.y * 10

  //camera.position.set(-cursor.x * (2*Math.PI*camera.position.z), cursor.y * (2*Math.PI*camera.position.z))
  camera.lookAt(threeBoxGroup.position)
}

//renderContextCanvas.addEventListener('mousemove', onMouseMove)
