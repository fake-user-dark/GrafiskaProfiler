//  en planet js, gjort med threejs

import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./js/getStarfield.js";
import { getFresnelMat } from "./js/getFresnelMat.js";

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
console.log(renderer  )
if (width > 680) {
  renderer.setSize(width*0.97, height);
} else {
  renderer.setSize(width*0.8, height*0.8 );
}

function clickLogo(){

  window.location.href = "./index.html"

}


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  const width = window.innerWidth;
const height = window.innerHeight;
if (width > 680) {
  renderer.setSize(width*0.95, height );
} else {
  renderer.setSize(width*0.8, height*0.8 );
}
console.log("1")

})

document.getElementById("planetView").appendChild(renderer.domElement)


window.addEventListener("scroll", () => {
  console.log(window.scrollY)
  if (window.innerHeight > 80) {

    const windowPlanet = document.getElementById("planetView")
      const observer = new IntersectionObserver((entries) => {

          console.log(entries[0])
          const intersecting = entries[0].isIntersecting;
          if (intersecting) {

            document.querySelector("header").style.color = "white"
            document.querySelector("#logo").setAttribute("src", "./src/Namnlöst-1.png")
            document.querySelector("#logo").style.height = "150px"
          } else {
            document.querySelector("header").style.color = "black"
            document.querySelector("#logo").setAttribute("src", "./src/logo (1).png")
            document.querySelector("#logo").style.height = "80px"

          }
          
        },
        {
          root: null, // viewport
          threshold: 0,
          rootMargin: "-5% 0px -105% 0px"
        }
      )
      observer.observe(windowPlanet)





  } else if (window.innerWidth > 500  || window.innerHeight > 1000) {
    if (window.innerHeight+920 < window.scrollY) {
      document.querySelector("header").style.color = "white"
    } else {
      document.querySelector("header").style.color = "black"
    } 
  }else {
    document.querySelector("header").style.color = "black"
  }
})

THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.zoomSpeed = 1.2;

// Override zoom to only affect the earthGroup
controls.addEventListener("change", () => {
  // Calculate zoom factor from camera distance
  const zoomFactor = camera.position.z; 
  // Keep stars fixed at origin
  stars.position.set(0, 0, 0);
  // Scale earthGroup based on zoom

});


const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 14);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./images/earthmap.jpg"),
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./images/earth_lights.png"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./images/cloud_combined.jpg"),
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 5000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2.2, 0.7, 1.6);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.0019;
  lightsMesh.rotation.y += 0.0019;
  cloudsMesh.rotation.y += 0.0026;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}

animate();



