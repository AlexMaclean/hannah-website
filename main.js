const frame = document.getElementById("frame");
const width = frame.offsetWidth;
const height = frame.offsetHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ alpha: true, antiailias: true, canvas: canvas });
renderer.setSize(width, height);

addLights(scene);

const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
loader.setCrossOrigin("");

loadManager.onLoad = setup;

const wingMaterials = ["img/wing1.png", "img/wing2.png", "img/wing3.png"].map(
  (path) => loader.load(path)
);

const ButterflyConstants = {
  maxWingRotation: Math.PI / 3,
  minWingRotation: -Math.PI / 6,
  wingFlapSpeed: 20,
  speed: 0.06,
};

const ComputedButterflyConstants = {
  period: (1 / ButterflyConstants.wingFlapSpeed) * 2 * Math.PI,
  meanPosition:
    (ButterflyConstants.maxWingRotation + ButterflyConstants.minWingRotation) /
    2,
  amplitude:
    (ButterflyConstants.maxWingRotation - ButterflyConstants.minWingRotation) /
    2,
};

class Butterfly {
  constructor(scene, materials, location, size) {
    this.buildObject(scene, materials, size);
    this.frame = Math.floor(Math.random() * 1000);

    this.outerObject.rotation.z = Math.random() * Math.PI * 2;
    this.outerObject.position.set(...location);
    console.log(this.outerObject.position);
  }

  buildObject(scene, materials, size) {
    const wingGeometry = new THREE.PlaneGeometry(size, size);

    const leftWingMesh = new THREE.Mesh(wingGeometry, materials.left);
    leftWingMesh.position.x = -size / 2;
    this.leftWing = new THREE.Object3D();
    this.leftWing.add(leftWingMesh);

    const rightWingMesh = new THREE.Mesh(wingGeometry, materials.right);
    rightWingMesh.position.x = size / 2;
    this.rightWing = new THREE.Object3D();
    this.rightWing.add(rightWingMesh);

    this.innerObject = new THREE.Object3D();
    this.outerObject = new THREE.Object3D();
    this.innerObject.add(this.leftWing);
    this.innerObject.add(this.rightWing);
    this.outerObject.add(this.innerObject);
    scene.add(this.outerObject);
  }

  animate() {
    const rotation = this.getRotation();
    this.leftWing.rotation.y = rotation;
    this.rightWing.rotation.y = -rotation;

    this.innerObject.rotation.y =
      Math.sin(this.frame * 0.02) * 0.3 * (Math.random() + 1);

    this.outerObject.rotation.z += this.innerObject.rotation.y / 8;

    const angle = this.innerObject.rotation.x;
    this.outerObject.translateY(Math.cos(angle) * ButterflyConstants.speed);
    this.outerObject.translateZ(Math.sin(angle) * ButterflyConstants.speed);

    this.outerObject.position.x *= 0.99;
    this.outerObject.position.y *= 0.99;

    this.frame++;
  }

  getRotation() {
    return (
      Math.sin(this.frame * ComputedButterflyConstants.period) *
        ComputedButterflyConstants.amplitude +
      ComputedButterflyConstants.meanPosition
    );
  }
}

const butterflies = [];

function setup() {
    const materials = wingMaterials.map(getMaterials);
    for (let i = 0; i < 5; i++) {
        const material = materials[Math.floor(Math.random() * wingMaterials.length)]
        const location = new THREE.Vector3( 0, 0, i*0.8 - 1);
        butterflies.push(new Butterfly(scene, material, location, 1));
    }
  renderLoop();
}

function renderLoop() {
  for (let i = 0; i < butterflies.length; i++) {
    butterflies[i].animate();
  }
  renderer.render(scene, camera);

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  requestAnimationFrame(renderLoop);
}

function addLights(scene) {
  const light = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xcccc88, 1);
  spotLight.position.set(100, 1000, 1000);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function getMaterials(texture) {
  const textureCopy = texture.clone();
  textureCopy.needsUpdate = true;
  textureCopy.offset.set(1, 0);
  textureCopy.wrapS = THREE.MirroredRepeatWrapping;

  return {
    left: material(texture),
    right: material(textureCopy),
  };
}

function material(texture) {
  return new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
}
