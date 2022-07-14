// initialize variables to allow for easy customization and reuse
let scene, cube, cylinder, torus, torusKnot, camera, renderer, clock

// Canvas
/**
* the canvas element is selected by classname webgl so we can render graphics through it
*/
const canvas = document.querySelector('canvas.webgl')

// Scene
/**
* scene here is now passed an object value Scene
*/
scene = new THREE.Scene()

/**
* Sizes
* where we hold the values of our screen size
*/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// this event listener fires when there is a resize of the screen so that we can update our camera aspect ratio, and the graphics is still rendered nicely
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
// we use the perspective camera to make it a bit realistic and it is what is commonly used for gaming scenes
// the camera is added to the scene so that we can see our object from a specified angle and position.
// it represents our point of view
camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)

camera.position.set(0, 0, 100)
// camera.lookAt(0, 0, 0)

scene.add(camera)
// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
/**
 * Renderer
 * what the renderer does is render the final object to our canvas element by taking the canvas element we supplied earlier and drawing the graphics on it.
 * antialias being true makes the drawing of lines smooth
 */
renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas: canvas
})

// calculations made here is to draw the width and height of the canvas, but the abstraction of the actual values makes it responsive when i change the screen size. the renderer does a recalculation to render the right graphics every time
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x333333)
// Lights
/**
* light reflections off surfaces are responsible for everything we see even in the real world.
* the positioning will determine how we see the object.
* I used a directional light that acts more like sunlight
* then I gave it a positioning
*/
function addLighting(scene) {
  let color = 0xFFFFAA
  let intensity = 1
  let light = new THREE.DirectionalLight(color, intensity)

  light.position.set(-40, 40, 0)
  light.target.position.set(-5, -2, -5)
  // light.position = camera.position

  scene.add(light)
  scene.add(light.target)
}
addLighting(scene)

// Objects
/**
 * we create our object geometry here
 */
const geometryTorusKnot = new THREE.TorusKnotGeometry(10, 3, 300, 20, 1, 5)
const geometryCube = new THREE.BoxGeometry(30, 30, 30)
const geometryCylinder = new THREE.CylinderGeometry(30, 30, 30, 64)
const geometryTorus = new THREE.TorusGeometry(10, 3, 30, 200, 6)

// Materials or Textures
const textureCube = new THREE.TextureLoader().load('/assets/textures/blue_wool.png')

/**
 * I added blue color to the object.
 * material object uses this color to determine the covering.
 * When lighting hits, WebGL would calculate how much light should hit to have it reflect and be seen as the desired material.
 */
// for color mesh
const materialTorusKnot = new THREE.MeshPhongMaterial({ color: 0xB7AC44, emissive: 0x111111, shininess: 1000 })
const materialCube = new THREE.MeshBasicMaterial({ map: textureCube })
const materialCylinder = new THREE.MeshStandardMaterial({ color: 0xFF8300, opacity: .5, transparent: true })
const materialTorus = new THREE.MeshPhongMaterial({ color: 0xFF4500, emissive: 0x111, shininess: 10000, transparent: true })
// Mesh
/**
* mesh is responsible for applying our material of color to the created geometry so we have our final object.
* scene.add is a method that passes this created object to our scene. however, it won't be rendered yet, until there is light to reflect off of the material.
*/
torusKnot = new THREE.Mesh(geometryTorusKnot, materialTorusKnot)
cube = new THREE.Mesh(geometryCube, materialCube)
cylinder = new THREE.Mesh(geometryCylinder, materialCylinder)
torus = new THREE.Mesh(geometryTorus, materialTorus)

torusKnot.position.set(-25, 25, 0)
cube.position.set(25, -25, 0)
cylinder.position.set(10, -25, 0)
// cylinder.position.set(-25, -25, 0)
torus.position.set(25, 25, 0)

scene.add(torusKnot)
scene.add(cube)
scene.add(cylinder)
scene.add(torus)
/**
 * Animate
 */

// the clock is used to time the animation.
// this is what I use to animate my circle.
// using the animate function which is recursive, the renderer renders the scene over and over at every elapsed timed

clock = new THREE.Clock()
let up = true, right = true
/**
 *  I use this function to generate a random color
 * When the ball hits any edge
 */

const animate = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  // this objects are updated every time the function calls itself. it's the reason the circle spins as renderer below updated the scene
  // the rotation of the circle goes about the x & y axes.
  torusKnot.rotation.z = -1 * elapsedTime
  cylinder.rotation.z = 1 * elapsedTime
  cube.rotation.z = -1 * elapsedTime
  torus.rotation.z = 1 * elapsedTime

  /**
   * the general explanation to the movement of the ball is to go up, the right denoted by the if statements set to true.
   * I got the diagonals by anticipating the movements of the ball going first to the top and right.
   * on getting to the top and right, it got to the top first then changed direction as per the else statement, however, the ball was still headed to the right, which made the ball go right down.
   * using the above logic, the ball is able to go to any edge while still obeying the rules of the statements and without much code.
   */
  // depending on the size of your screen, the ball may move past the edge due to being hardcoded for my screen size
  if (up) {
    cylinder.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 1)
    if (cylinder.position.y > 40) {
      up = false
    }
  } else if (!up) {
    cylinder.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), -1)
    if (cylinder.position.y < -40) {
      up = true
    }
  } else {
    cylinder.position.set(0, 0, 0)
  }

  if (right) {
    cube.translateOnAxis(new THREE.Vector3(1, 0, 1).normalize(), 1)
    if (cube.position.x > 5) {
      cube.rotation.z = 1 * elapsedTime
      right = false
    }
  } else if (!right) {
    cube.translateOnAxis(new THREE.Vector3(1, 0, 1).normalize(), -1)
    if (cube.position.x < -5) {
      cube.rotation.z = -paired1 * elapsedTime
      right = true
    }
  } else {
    cube.position.set(0, 0, 0)
  }

  // Render
  renderer.render(scene, camera)

  // Call animate again on the next frame
  window.requestAnimationFrame(animate)
}
animate()

