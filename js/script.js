// initialize variables to allow for easy customization and reuse

let scene, sphere, camera, renderer, clock

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

renderer.setClearColor(0xFFFFAA)



// Lights

/**

* light reflections off surfaces are responsible for everything we see even in the real world.

* the positioning will determine how we see the object.

* I used a directional light that acts more like sunlight

* then I gave it a positioning

*/

function addLighting(scene) {

  let color = 0xFFFFAA;

  let intensity = 1;

  let light = new THREE.DirectionalLight(color, intensity);

  light.position.set(-1, 1, 1);

  light.target.position.set(-5, -2, -5);

  scene.add(light);

  scene.add(light.target);

}

addLighting(scene);



// Objects

/**

 * we create our object geometry here

 */

let geometry = new THREE.SphereGeometry(12, 32, 32);



// Materials or Textures

/**

 * I added blue color to the object.

 * material object uses this color to determine the covering.

 * When lighting hits, WebGL would calculate how much light should hit to have it reflect and be seen as the desired material.

 */

// for color mesh

let material = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0 });



// Mesh

/**

* mesh is responsible for applying our material of color to the created geometry so we have our final object.

* scene.add is a method that passes this created object to our scene. however, it won't be rendered yet, until there is light to reflect off of the material.

*/

sphere = new THREE.Mesh(geometry, material);

sphere.position.set(0, 0, 0);

scene.add(sphere);



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

function getRandomColor() {

  let letters = '0123456789ABCDEF';

  let color = '0x';

  for (let i = 0; i < 6; i++) {

    color += letters[Math.floor(Math.random() * 16)];

  }

  return parseInt(color)

}



const animate = () => {

  const elapsedTime = clock.getElapsedTime()

  /**

   * the general explanation to the movement of the ball is to go up, the right denoted by the if statements set to true.

   * I got the diagonals by anticipating the movements of the ball going first to the top and right.

   * on getting to the top and right, it got to the top first then changed direction as per the else statement, however, the ball was still headed to the right, which made the ball go right down.

   * using the above logic, the ball is able to go to any edge while still obeying the rules of the statements and without much code.

   */

  // depending on the size of your screen, the ball may move past the edge due to being hardcoded for my screen size

  if (up) {

    sphere.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 1)

    if (sphere.position.y > 70) {

      sphere.material.color.set(getRandomColor())

      up = false

    }

  } else if (!up) {

    sphere.translateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), -1)

    if (sphere.position.y < -70) {

      sphere.material.color.set(getRandomColor())

      up = true

    }

  } else {

    sphere.position.set(0, 0, 0)

  }

  if (right) {

    sphere.translateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), 1)

    if (sphere.position.x > 155) {

      sphere.material.color.set(getRandomColor())

      right = false

    }

  } else if (!right) {

    sphere.translateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), -1)

    if (sphere.position.x < -155) {

      sphere.material.color.set(getRandomColor())

      right = true

    }

  } else {

    sphere.position.set(0, 0, 0)

  }

  // Update Orbital Controls

  // controls.update()

  // I could make the circle revolve about the screen by updating the camera position for z-axis but that would be for another assignment

  // Render
  renderer.render(scene, camera)



  // Call animate again on the next frame

  window.requestAnimationFrame(animate)

}

animate()

