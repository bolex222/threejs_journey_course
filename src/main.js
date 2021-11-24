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

const lookAtCenter = () => {
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
}


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


const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./img/textures/particles/4.png')


/**
 * galaxy
 */

const parameter = {
  galaxySize: 100,
  starSize: 1,
  numberOfStars: 10000,
  numberOfBranch: 7,
  torsion: 1,
  starColor: '#ffffff',
  amplitude: 0.3,
  reverse: true,
  flat: true
}

const galaxyGeometry = new THREE.BufferGeometry()
const galaxyMaterial = new THREE.PointsMaterial({
  transparent: true,
  alphaMap: texture,
  depthWrite: false,
  vertexColors: true
})
const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
//galaxy.rotation.z = Math.PI / 8
scene.add(galaxy)

function randn_bm () {
  let u = 0, v = 0
  while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

const generateGalaxy = () => {
  galaxyMaterial.dispose()
  galaxyGeometry.dispose()
  const arrayOfVertices = []
  const arrayOfVerticesColor = []
  const arrayOfVerticesSize = []
  const colors = [
    [191, 190, 125],
    [5, 3, 255],
    []
  ]
  for (let i = 0; i < 3; i++) {
    colors[2].push((colors[0][i] - colors[1][i]) / parameter.galaxySize)
  }
  const angle = (2 * Math.PI) / parameter.numberOfBranch
  for (let i = 0; i < parameter.numberOfBranch; i++) {
    for (let j = 0; j < parameter.numberOfStars / parameter.numberOfBranch; j++) {
      const rand = Math.random() * parameter.galaxySize
      const point = [
        Math.sin(angle * (1 + i + rand * (parameter.reverse ? -1 : 1) * (parameter.torsion / 100))) * rand + (randn_bm() * parameter.amplitude * (parameter.galaxySize / 10)),
        parameter.flat ? 0 : (randn_bm() * parameter.amplitude * (parameter.galaxySize / 10)),
        Math.cos(angle * (1 + i + rand * (parameter.reverse ? -1 : 1) * (parameter.torsion / 100))) * rand + (randn_bm() * parameter.amplitude * (parameter.galaxySize / 10)) * 3
      ]
      arrayOfVertices.push(...point)
      let distanceToCenter = Math.ceil(Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2) + Math.pow(point[2], 2)))
      if (distanceToCenter > parameter.galaxySize) {distanceToCenter = parameter.galaxySize}
      for (let i = 0; i < 3; i++) {
        arrayOfVerticesColor.push((colors[0][i] - (distanceToCenter * colors[2][i]))/255)
      }
      // if (i % 10 === 0) {
      //   console.log('//////////////')
      //   console.log(distanceToCenter)
      //   console.log(arrayOfVerticesColor[arrayOfVerticesColor.length -1], arrayOfVerticesColor[arrayOfVerticesColor.length -2], arrayOfVerticesColor[arrayOfVerticesColor.length -3])
      // }
      arrayOfVerticesSize.push(Math.random() * 100)
    }
  }
  const buffer = new Float32Array(arrayOfVertices)
  const sizeBuffer = new Float32Array(arrayOfVerticesSize)
  const colorBuffer = new Float32Array(arrayOfVerticesColor)
  console.log(arrayOfVerticesColor)
  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
  // galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizeBuffer, 1))
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colorBuffer, 3))
  //galaxyMaterial.size = parameter.starSize
  //galaxyMaterial.color = new THREE.Color(parameter.starColor)
}

gui.add(parameter, 'numberOfStars').onChange(generateGalaxy)
gui.add(parameter, 'galaxySize').onChange(generateGalaxy)
gui.add(parameter, 'starSize').onChange(generateGalaxy)
gui.add(parameter, 'numberOfBranch').min(1).max(10).onChange(generateGalaxy)
gui.add(parameter, 'reverse').onChange(generateGalaxy)
gui.add(parameter, 'flat').onChange(generateGalaxy)
gui.add(parameter, 'torsion').min(0).max(10).onChange(generateGalaxy)
gui.add(parameter, 'amplitude').min(0).max(10).onChange(generateGalaxy)
gui.addColor(parameter, 'starColor').onChange(generateGalaxy)
gui.add({ generateGalaxy }, 'generateGalaxy')
gui.add({ lookAtCenter }, 'lookAtCenter').onChange(generateGalaxy)


/**
 * Light
 */
const ambientLight = new THREE.AmbientLight('#303044', 0.3)
//scene.add(ambientLight)


renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
window.addEventListener('resize', resizeScreen)
//const clock = new THREE.Clock()

window.addEventListener('dblclick', () => {
  document.body.requestFullscreen()
})

const clock = new THREE.Clock()

const tick = () => {
  //console.log('la')
  renderer.setSize(size.width, size.height)
  // const timeSince = clock.getElapsedTime()
  // galaxy.rotation.y = timeSince

  //ghost.position.set(Math.sin(timeSince) * 2, Math.sin(timeSince * 2) + 1, Math.cos(timeSince) * 2)
  control.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
