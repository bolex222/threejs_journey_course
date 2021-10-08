import './style.css'
import * as THREE from 'three'

const renderContextCanvas = document.getElementById('render_context')
const screenSize = { width: window.innerWidth, height: window.innerHeight }


// create Scene
const scene = new THREE.Scene()

// create BOX
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
// mesh.rotation.x = 2
// mesh.rotation.y = 2

// camera
const camera = new THREE.PerspectiveCamera(75, screenSize.width / screenSize.height)
scene.add(camera)
camera.position.z = 2


// create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: renderContextCanvas
})
renderer.setSize(screenSize.width, screenSize.height)

const interval = setInterval(() => {
  mesh.rotation.y += .02
  renderer.render(scene, camera)
}, 2.5)


const handleScreenResize = () => {
  screenSize.height = window.innerHeight
  screenSize.width = window.innerWidth
  camera.aspect = screenSize.width / screenSize.height
  camera.updateProjectionMatrix()
  renderer.setSize(screenSize.width, screenSize.height)
}

window.addEventListener('resize', handleScreenResize)
