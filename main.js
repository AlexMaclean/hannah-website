const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antiailias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

addLights(scene);

let loader = new THREE.TextureLoader();
loader.setCrossOrigin("");

loader.load(
  "img/wing1.png",
  function (texture) {
    setup(getMaterials(texture));
  },
  undefined,
  function () {
    setup({
      left: new THREE.MeshLambertMaterial({
        color: 0x888800,
      }),
      right: new THREE.MeshLambertMaterial({
        color: 0x880088,
      }),
    });
  }
);

const ButterflyConstants = {
  maxWingRotation: Math.PI / 3,
  minWingRotation: -Math.PI / 6,
  wingFlapSpeed: 20,
  speed: 0.04,
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
  constructor(scene, materials, size) {
    this.buildObject(scene, materials, size);
    this.frame = 0;

    this.outerObject.position.x = -3;
    // this.butterfly.rotation.z = Math.PI;
     this.innerObject.rotation.y = 0;
     this.innerObject.rotation.x = 0;
   // this.butterfly.rotation.y = 0.3;
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
    this.outerObject.add(this.innerObject)
    scene.add(this.outerObject);
  }

  animate() {
    const rotation = this.getRotation();
    this.leftWing.rotation.y = rotation;
    this.rightWing.rotation.y = -rotation;

    this.innerObject.rotation.y += Math.sin(this.frame * 0.1) * 0.02;
    this.innerObject.rotation.y += Math.sin(this.frame * 0.03) * 0.002;

    this.innerObject.rotation.x = Math.sin(this.frame * 0.1) * 0.1;

    this.outerObject.rotation.z += this.innerObject.rotation.y / 10;

    const angle = this.innerObject.rotation.x
    this.outerObject.translateY(Math.cos(angle) * ButterflyConstants.speed);
    this.outerObject.translateZ(Math.sin(angle) * ButterflyConstants.speed);


    console.log(this.outerObject.position);


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
  butterfly.animate();
  renderer.render(scene, camera);

  requestAnimationFrame(renderLoop);
}

function addLights(scene) {
  const light = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffff00, 1);
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
