const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

addLights(scene);

let loader = new THREE.TextureLoader();
loader.setCrossOrigin("");

loader.load(
  "metal003.png",
  function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    const material = new THREE.MeshLambertMaterial({
      map: texture,
      flatShading: THREE.FlatShading,
    });
    setup(material);
  },
  undefined,
  function () {
    const material = new THREE.MeshLambertMaterial({
      color: 0x888888,
    });
    setup(material);
  }
);

const ButterflyConstants = {
  maxWingRotation: Math.PI / 3,
  minWingRotation: -Math.PI / 6,
  wingFlapSpeed: 30,
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
  constructor(scene, material, size) {
    this.scene = scene;
    this.buildObject(material, size);
    this.frame = 0;
  }

  buildObject(material, size) {
    this.butterfly = new THREE.Object3D();
    this.leftWing = new THREE.Object3D();
    this.rightWing = new THREE.Object3D();

    const wingGeometry = new THREE.PlaneGeometry(size, size);
    const leftWingMesh = new THREE.Mesh(wingGeometry, material);
    leftWingMesh.position.x = -size / 2;
    this.leftWing.add(leftWingMesh);

    const rightWingMesh = new THREE.Mesh(wingGeometry, material);
    rightWingMesh.position.x = size / 2;
    this.rightWing.add(rightWingMesh);

    this.butterfly.add(this.leftWing);
    this.butterfly.add(this.rightWing);
    this.scene.add(this.butterfly);
  }

  animate() {
    const rotation = this.getRotation();
    this.leftWing.rotation.y = rotation;
    this.rightWing.rotation.y = -rotation;

    this.butterfly.rotation.z += 0.01;
    this.butterfly.rotation.x += 0.01;

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

let butterfly;

function setup(material) {
  butterfly = new Butterfly(scene, material, 1);
  renderLoop();
}

function renderLoop() {
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  butterfly.animate();
  renderer.render(scene, camera);

  requestAnimationFrame(renderLoop);
}

function addLights(scene) {
  const light = new THREE.AmbientLight("rgb(0, 0, 255)");
  scene.add(light);

  const spotLight = new THREE.SpotLight("rgb(255, 255, 0)");
  spotLight.position.set(100, 1000, 1000);
  spotLight.castShadow = true;
  scene.add(spotLight);
}
