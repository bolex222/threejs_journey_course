import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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

const mousePosition = new THREE.Vector2()

/**
 *
 * @param {MouseEvent} event
 */
const updateMousePosition = event => {
  mousePosition.x = (event.clientX / size.width) * 2 -1
  mousePosition.y = (event.clientY / size.height) * -2 +1
  // console.log(mousePosition)
}

/**
 * renderer
 * //@type {THREE.WebGLRenderer}
 */
const renderer = new THREE.WebGLRenderer({ canvas })

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
//camera.lookAt(0, 0, 0)
camera.position.z = 3


const resizeScreen = () => {
  size.width = window.innerWidth
  size.height = window.innerHeight
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
}


/**
 * Control
 */
const control = new OrbitControls(camera, canvas)
//control.addEventListener('change', () => {gui.updateDisplay()})


const geometry = new THREE.SphereGeometry(0.5, 32, 32)
const materials = [new THREE.MeshBasicMaterial({color: '#ff0000'}) ,new THREE.MeshBasicMaterial({color: '#ff0000'}), new THREE.MeshBasicMaterial({color: '#ff0000'})]
const meshes = []

for (let i = 0; i < 3; i++) {
  meshes.push(new THREE.Mesh(geometry, materials[i]))
  meshes[i].position.x = ((4 + i * 2) - 6) * -1

}
scene.add(...meshes)
meshes[0].position.y = 2

/**
 * RayCaster
 */
const rayCaster = new THREE.Raycaster()


// Ray from left to right
const rayCasterOrigin = new THREE.Vector3(-3, 0, 0)
const direction = new THREE.Vector3(3, 0, 0)
direction.normalize()
rayCaster.set(rayCasterOrigin, direction)




// System that auto change color at rayCast trigger
const blueMaterial = new THREE.MeshBasicMaterial({color: '#0000ff'})
const redMaterial = new THREE.MeshBasicMaterial({color: '#ff0000'})

const checkRayCasterForColors = () => {
  const intersect = rayCaster.intersectObjects(meshes)
  meshes.forEach(el => {
    if (el.material.color.b === 1) {
      el.material = redMaterial
    }
  })
  //console.log(intersect)
  intersect.forEach(el => {
   el.object.material = blueMaterial
  })
}



/**
 * Light
 */
//const ambientLight = new THREE.AmbientLight('#303044', 0.3)
//scene.add(ambientLight)


renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
window.addEventListener('resize', resizeScreen)
//const clock = new THREE.Clock()

window.addEventListener('dblclick', () => {
  document.body.requestFullscreen()
})

window.addEventListener('mousemove', updateMousePosition)

const clock = new THREE.Clock()
const colorBlue = new THREE.Color('blue')
const colorRed = new THREE.Color('red')

const tick = () => {
  renderer.setSize(size.width, size.height)

  meshes[1].position.y = Math.sin(clock.getElapsedTime() * 0.5) * 1.5

  const origin = new THREE.Vector3(mousePosition.x, mousePosition.y, camera.position.z)
  const dest = new THREE.Vector3(mousePosition.x, mousePosition.y,camera.position.z - 1000)
  dest.normalize()

  // checkRayCasterForColors()

  control.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
