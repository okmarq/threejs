import { Scene, Clock, PointLight } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new Scene()

// Objects
const geometry = new BoxGeometry()

// Materials
const material = new MeshBasicMaterial({ color: 0x00ff00 })

// Mesh
const cube = new Mesh(geometry, material)
scene.add(cube)

// Lights
const pointLight = new PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 2
pointLight.position.z = 2
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
// camera.position.x = 0
// camera.position.y = 0
// camera.position.z = 5

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
// Renderer
const renderer = new WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
// Clock
const clock = new Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update objects
	// cube.rotation.x += .5 * elapsedTime
	// cube.rotation.y += .5 * elapsedTime

	// Update Orbital Controls
	// controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()



scene.add(camera)

const cameraControls = new OrbitControls(camera, renderer.domElement)

cameraControls.addEventListener('mousemove',
	renderer)
cameraControls.autoRotate = true

document.body.appendChild(renderer.domElement)