// createStencilOutline.js
import * as THREE from "three";

export function createStencilOutline(targetMesh) {
  const baseMaterial = targetMesh.material.clone();
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // side: THREE.BackSide,
    depthTest: true,
    depthWrite: false,
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilFail: THREE.ReplaceStencilOp,
    stencilZFail: THREE.ReplaceStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });

  baseMaterial.stencilWrite = true;
  baseMaterial.stencilRef = 1;
  baseMaterial.stencilFunc = THREE.AlwaysStencilFunc;
  baseMaterial.stencilZPass = THREE.ReplaceStencilOp;

  const outlineMesh = new THREE.Mesh(targetMesh.geometry, outlineMaterial);
  outlineMesh.position.copy(targetMesh.position);
  outlineMesh.rotation.copy(targetMesh.rotation);
  outlineMesh.scale.copy(targetMesh.scale).multiplyScalar(1.05);

  const mainMesh = new THREE.Mesh(targetMesh.geometry, baseMaterial);
  mainMesh.position.copy(targetMesh.position);
  mainMesh.rotation.copy(targetMesh.rotation);
  mainMesh.scale.copy(targetMesh.scale);

  const group = new THREE.Group();
  group.add(mainMesh);
  group.add(outlineMesh);

  return group;
}
