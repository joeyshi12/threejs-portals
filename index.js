const { renderer, canvas } = setup();
const { scene, renderTarget, camera, shadowCam, blueCam, orangeCam, worldFrame, renderTarget2, renderTarget3, cubeRenderTarget } = createScene(canvas);

const shadowScene = new THREE.Scene();
const shadowScene2 = new THREE.Scene();
const portalScene = new THREE.Scene();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

shadowCam.position.set(200.0, 180.0, -100.0);
shadowCam.lookAt(scene.position);
shadowScene.add(shadowCam);

const lightDirection = new THREE.Vector3();
lightDirection.copy(shadowCam.position);
lightDirection.sub(scene.position);

// Load floor textures
const floorColorTexture = new THREE.TextureLoader().load('images/color.jpg');
floorColorTexture.minFilter = THREE.LinearFilter;
floorColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const floorNormalTexture = new THREE.TextureLoader().load('images/normal.jpg');
floorNormalTexture.minFilter = THREE.LinearFilter;
floorNormalTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Load pixel textures
const shayDColorTexture = new THREE.TextureLoader().load( 'images/Pixel_Model_BaseColor.jpg' );
shayDColorTexture.minFilter = THREE.LinearFilter;
shayDColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const shayDNormalTexture = new THREE.TextureLoader().load('images/Pixel_Model_Normal.jpg');
shayDNormalTexture.minFilter = THREE.LinearFilter;
shayDNormalTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const cubeColorTexture = new THREE.TextureLoader().load( 'images/Companion Cube_03.png' );
cubeColorTexture.minFilter = THREE.LinearFilter;
cubeColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const cubeMoColorTexture = new THREE.TextureLoader().load( 'images/Companion Cube_04.png' );
cubeMoColorTexture.minFilter = THREE.LinearFilter;
cubeMoColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Uniforms
const cameraPositionUniform = {type: "v3", value: camera.position};
const lightColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0)};
const ambientColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0)};
const lightDirectionUniform = {type: "v3", value: lightDirection};
const kAmbientUniform = {type: "f", value: 0.1};
const kDiffuseUniform = {type: "f", value: 0.8};
const kSpecularUniform = {type: "f", value: 0.4};
const shininessUniform = {type: "f", value: 50.0};
const lightPositionUniform = { type: "v3", value: shadowCam.position};

const lightProjMatrixUniform = {type: "m4", value: shadowCam.projectionMatrix};
const lightViewMatrixUniform = {type: "m4", value: shadowCam.matrixWorldInverse};
const textureSizeUniform = {type: "f", value: null};

const shayDPos = {type: "v3", value: new THREE.Vector3(0, 0, 0)};
const shayDPos2 = {type: "v3", value: new THREE.Vector3(2, 0, 0)};
const shayDRotation = {type: "f", value: Math.PI / 2};

// load the skybox textures
const skyboxCubemap = new THREE.CubeTextureLoader().setPath('images/');
const skyboxTexture = skyboxCubemap.load([
  "negx.png",
  "posx.png",
  "posy.png",
  "negy.png",
  "posz.png",
  "negz.png",
]);
skyboxCubemap.format = THREE.RGBFormat;
const skyboxCubeMapUniform = {type: 't', value: skyboxTexture};
scene.background = skyboxTexture;

// Materials
const floorMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightProjMatrix: lightProjMatrixUniform,
    lightViewMatrix: lightViewMatrixUniform,
    lightColor: lightColorUniform,
    ambientColor: ambientColorUniform,

    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    kSpecular: kSpecularUniform,
    shininess: shininessUniform,

    cameraPos: cameraPositionUniform,
    lightPosition: lightPositionUniform,
    lightDirection: lightDirectionUniform,

    colorMap: {type: "t", value: floorColorTexture},
    normalMap: { type: "t", value: floorNormalTexture },
    shadowMap: {type: "t", value: renderTarget.texture},
    textureSize: textureSizeUniform
  }
});

const cubeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    lightProjMatrix: lightProjMatrixUniform,
    lightViewMatrix: lightViewMatrixUniform,
    lightColor: lightColorUniform,
    ambientColor: ambientColorUniform,

    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    kSpecular: kSpecularUniform,
    shininess: shininessUniform,

    cameraPos: cameraPositionUniform,
    lightPosition: lightPositionUniform,
    lightDirection: lightDirectionUniform,

    colorMap: {type: "t", value: cubeColorTexture},
    moMap: {type: "t", value: cubeMoColorTexture},
    shadowMap: {type: "t", value: cubeRenderTarget.texture},
    textureSize: textureSizeUniform
  }
});

const shayDMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    lightColor: lightColorUniform,
    ambientColor: ambientColorUniform,

    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    kSpecular: kSpecularUniform,
    shininess: shininessUniform,

    cameraPos: cameraPositionUniform,
    lightPosition: lightPositionUniform,
    lightDirection: lightDirectionUniform,

    colorMap: {type: "t", value: shayDColorTexture},
    normalMap: {type: "t", value: shayDNormalTexture},
    worldPos: shayDPos,
    rot: shayDRotation,
  }
});

const shayDMaterial2 = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    lightColor: lightColorUniform,
    ambientColor: ambientColorUniform,

    kAmbient: kAmbientUniform,
    kDiffuse: kDiffuseUniform,
    kSpecular: kSpecularUniform,
    shininess: shininessUniform,

    cameraPos: cameraPositionUniform,
    lightPosition: lightPositionUniform,
    lightDirection: lightDirectionUniform,

    colorMap: {type: "t", value: shayDColorTexture},
    normalMap: {type: "t", value: shayDNormalTexture},
    worldPos: shayDPos2,
    rot: {type: "f", value: Math.PI / 2}
  }
});

const bluePortalMaterial = new THREE.ShaderMaterial({
  uniforms: {
    textureMap: {type: "t", value: renderTarget3.texture},
    camProjMatrix: {type: "m4", value: blueCam.projectionMatrix},
    camViewMatrix: {type: "m4", value: blueCam.matrixWorldInverse},
  }
});

const orangePortalMaterial = new THREE.ShaderMaterial({
  uniforms: {
    textureMap: {type: "t", value: renderTarget2.texture},
    camProjMatrix: {type: "m4", value: orangeCam.projectionMatrix},
    camViewMatrix: {type: "m4", value: orangeCam.matrixWorldInverse},
  }
});

const shadowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    worldPos: shayDPos,
    rot: shayDRotation
  }
});

const shadowMaterial2 = new THREE.ShaderMaterial({
  uniforms: {
    worldPos: shayDPos2,
    rot: {type: "f", value: Math.PI / 2}
  }
});

const staticShadowMaterial = new THREE.ShaderMaterial({});

// Load shaders
const shaderFiles = [
  'glsl/shay.vs.glsl',
  'glsl/shay.fs.glsl',
  'glsl/cube.vs.glsl',
  'glsl/cube.fs.glsl',
  'glsl/staticShadow.vs.glsl',
  'glsl/staticShadow.fs.glsl',
  'glsl/shadow.vs.glsl',
  'glsl/shadow.fs.glsl',
  'glsl/floor.vs.glsl',
  'glsl/floor.fs.glsl',
  'glsl/portal.vs.glsl',
  'glsl/portal.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  shayDMaterial.vertexShader = shaders['glsl/shay.vs.glsl'];
  shayDMaterial.fragmentShader = shaders['glsl/shay.fs.glsl'];

  cubeMaterial.vertexShader = shaders['glsl/cube.vs.glsl'];
  cubeMaterial.fragmentShader = shaders['glsl/cube.fs.glsl'];

  shayDMaterial2.vertexShader = shaders['glsl/shay.vs.glsl'];
  shayDMaterial2.fragmentShader = shaders['glsl/shay.fs.glsl'];

  staticShadowMaterial.vertexShader = shaders['glsl/staticShadow.vs.glsl'];
  staticShadowMaterial.fragmentShader = shaders['glsl/staticShadow.fs.glsl'];

  shadowMaterial.vertexShader = shaders['glsl/shadow.vs.glsl'];
  shadowMaterial.fragmentShader = shaders['glsl/shadow.fs.glsl'];

  shadowMaterial2.vertexShader = shaders['glsl/shadow.vs.glsl'];
  shadowMaterial2.fragmentShader = shaders['glsl/shadow.fs.glsl'];

  floorMaterial.vertexShader = shaders['glsl/floor.vs.glsl'];
  floorMaterial.fragmentShader = shaders['glsl/floor.fs.glsl'];

  orangePortalMaterial.vertexShader = shaders['glsl/portal.vs.glsl'];
  orangePortalMaterial.fragmentShader = shaders['glsl/portal.fs.glsl'];

  bluePortalMaterial.vertexShader = shaders['glsl/portal.vs.glsl'];
  bluePortalMaterial.fragmentShader = shaders['glsl/portal.fs.glsl'];
});

// Loaders for object geometry
// Load the pixel gltf
const gltfFileName = 'gltf/pixel_v4.glb';
let object;
{
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = shayDMaterial;
      }

    } );
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);
    object.rotation.set(0.0, Math.PI, 0.0);
    scene.add( object );
  });
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = shadowMaterial;
      }

    } );
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);
    object.rotation.set(0.0, Math.PI, 0.0);
    shadowScene.add( object );
  });
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = shadowMaterial2;
      }

    } );
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);
    object.rotation.set(0.0, Math.PI, 0.0);
    shadowScene.add( object );
  });
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = shayDMaterial2;
      }

    } );
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);
    object.rotation.set(0.0, Math.PI, 0.0);
    scene.add( object );
  });
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = shayDMaterial;
      }

    } );
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);
    object.rotation.set(0.0, Math.PI, 0.0);
    portalScene.add( object );
  });
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = shayDMaterial2;
      }

    } );
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);
    object.rotation.set(0.0, Math.PI, 0.0);
    portalScene.add( object );
  });
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = shadowMaterial;
      }

    } );
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);
    object.rotation.set(0.0, Math.PI, 0.0);
    shadowScene2.add( object );
  });
}

const cubePos = new THREE.Vector3(-12, 2.5, 4);
const cubeGltf = 'gltf/CompanionCube.glb';
let cube;
{
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load(cubeGltf, (gltf) => {
    cube = gltf.scene;
    cube.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = cubeMaterial;
      }

    } );
    cube.scale.set(2.0, 2.0, 2.0);
    cube.position.set(...cubePos);
    cube.rotation.set(0.0, 2, 0.0);
    scene.add( cube );
  });
  gltfLoader.load(cubeGltf, (gltf) => {
    cube = gltf.scene;
    cube.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = cubeMaterial;
      }

    } );
    cube.scale.set(2.0, 2.0, 2.0);
    cube.position.set(...cubePos);
    cube.rotation.set(0.0, 2, 0.0);
    portalScene.add( cube );
  });
  gltfLoader.load(cubeGltf, (gltf) => {
    cube = gltf.scene;
    cube.traverse( function ( child ) {

      if (child instanceof THREE.Mesh)
      {
        child.material = staticShadowMaterial;
      }

    } );
    cube.scale.set(2.0, 2.0, 2.0);
    cube.position.set(...cubePos);
    cube.rotation.set(0.0, 2, 0.0);
    shadowScene.add( cube );
  });
}

const terrainGeometry = new THREE.BoxGeometry(50, 50, 5);
const terrain = new THREE.Mesh(terrainGeometry, floorMaterial);
terrain.position.y = -2.4;
terrain.rotation.set(- Math.PI / 2, 0, 0);
scene.add(terrain);

const portalFrameGeometry = new THREE.BoxGeometry(10, 20, 2);
const bluePortalFrame = new THREE.Mesh(portalFrameGeometry);

const portalTerrain = new THREE.Mesh(terrainGeometry, floorMaterial);
portalTerrain.position.y = -2.4;
portalTerrain.rotation.set(- Math.PI / 2, 0, 0);
portalScene.add(portalTerrain);

const planeGeometry = new THREE.PlaneGeometry(10, 12, 8, 8);
const bluePlane = new THREE.Mesh(planeGeometry, bluePortalMaterial);
bluePlane.position.set(0, 6, -18);
scene.add(bluePlane);

const orangePlane = new THREE.Mesh(planeGeometry, orangePortalMaterial);
orangePlane.position.set(18, 6, 0);
orangePlane.rotation.set(0, -Math.PI / 2, 0);
scene.add(orangePlane);

const p0 = new THREE.Vector3(250, 0, -80);
const p1 = new THREE.Vector3(150, 0 , -80);
const p2 = new THREE.Vector3(0, 0, -80);
const p3 = new THREE.Vector3(0, 0, 200);

const r0 = Math.PI / 2;
const r1 = 0;

const sphereGeometry = new THREE.SphereGeometry(1);
const blueCamSphere = new THREE.Mesh(sphereGeometry, cubeMaterial);
scene.add(blueCamSphere);
const orangeCamSphere = new THREE.Mesh(sphereGeometry, cubeMaterial);
scene.add(orangeCamSphere);

blueCam.position.set(bluePlane.position.x, bluePlane.position.y, bluePlane.position.z - 1);
blueCam.lookAt(0, 5, -1);
orangeCam.position.set(orangePlane.position.x + 1, orangePlane.position.y, orangePlane.position.z);
orangeCam.lookAt(0, 5, -1);

const state = {
  timer: 100,
  totalTime: 100,
  movementMode: 0 // 0: orange to mid, 1: rotate, 2: mid to back of blue
}

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("A"))
  shadowCam.position.x -= 0.5;
  if (keyboard.pressed("D"))
  shadowCam.position.x += 0.5;
  if (keyboard.pressed("W"))
  shadowCam.position.z -= 0.5;
  if (keyboard.pressed("S"))
  shadowCam.position.z += 0.5;
  if (keyboard.pressed("Q"))
  shadowCam.position.y += 0.5;
  if (keyboard.pressed("E"))
  shadowCam.position.y -= 0.5;

  // For debugging
  blueCamSphere.position.set(...blueCam.position);
  orangeCamSphere.position.set(...orangeCam.position);

  shadowCam.lookAt(scene.position);
  lightDirection.copy(shadowCam.position);
  lightDirection.sub(scene.position);
}

// Setup update callback
function update() {
  checkKeyboard();
  shayDMaterial.needsUpdate = true;
  shayDMaterial2.needsUpdate = true;
  staticShadowMaterial.needsUpdate = true;
  shadowMaterial.needsUpdate = true;
  shadowMaterial2.needsUpdate = true;
  floorMaterial.needsUpdate = true;
  bluePortalMaterial.needsUpdate = true;
  orangePortalMaterial.needsUpdate = true;
  cubeMaterial.needsUpdate = true;
  cameraPositionUniform.value = camera.position;

  const t = state.timer / state.totalTime;
  switch (state.movementMode) {
    case 0:
      shayDPos2.value.set(p0);
      shayDPos.value.set(
        p1.x * t + p2.x * (1 - t),
        p1.y * t + p2.y * (1 - t),
        p1.z * t + p2.z * (1 - t),
      );
      shayDRotation.value = Math.PI / 2;
      break;
    case 1:
      shayDPos2.value.set(p0);
      shayDRotation.value = Math.PI * t  / 2;
      break;
    default:
      shayDPos.value.set(
        p2.x * t + p3.x * (1 - t),
        p2.y * t + p3.y * (1 - t),
        p2.z * t + p3.z * (1 - t),
      );
      shayDPos2.value.set(
        p0.x * t + p1.x * (1 - t),
        p0.y * t + p1.y * (1 - t),
        p0.z * t + p1.z * (1 - t),
      );
      shayDRotation.value = 0;
      break;
  }
  state.timer -= 1.5;
  if (state.timer <= 0) {
    state.movementMode = (state.movementMode + 1) % 3;
    state.timer = 100;
  }

  requestAnimationFrame(update);
  renderer.getSize(screenSize);
  renderer.setRenderTarget( null );
  renderer.clear();

  renderer.setRenderTarget(cubeRenderTarget);
  renderer.render(shadowScene2, shadowCam);

  renderer.setRenderTarget(renderTarget);
  renderer.render(shadowScene, shadowCam);

  renderer.setRenderTarget(null);
  renderer.render(scene, camera);

  renderer.setRenderTarget(renderTarget2);
  renderer.render(portalScene, blueCam);

  renderer.setRenderTarget(renderTarget3);
  renderer.render(portalScene, orangeCam);
}

var screenSize = new THREE.Vector2();
renderer.getSize(screenSize);
textureSizeUniform.value = screenSize.width;

// Start the animation loop.
update();
