import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createStencilOutline } from "./createStencilOutline";

function App() {
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const objectsRef = useRef([]);
  const selectedGroupRef = useRef(null);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      stencil: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Ground plane
    const planeGeo = new THREE.PlaneGeometry(50, 50);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Add objects
    const geometries = [
      new THREE.BoxGeometry(),
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.ConeGeometry(0.5, 1, 32),
      new THREE.TorusGeometry(0.5, 0.2, 16, 100),
      new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    ];

    geometries.forEach((geo, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${i * 60}, 100%, 50%)`),
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(i * 2 - 4, 0.5, 0);
      scene.add(mesh);
      objectsRef.current.push(mesh);
    });

    // Handle click
    function onClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objectsRef.current, false);
      if (intersects.length > 0) {
        if (selectedGroupRef.current) {
          scene.remove(selectedGroupRef.current);
          selectedGroupRef.current = null;
        }
        const selected = intersects[0].object;
        const outlineGroup = createStencilOutline(selected);
        scene.add(outlineGroup);
        selectedGroupRef.current = outlineGroup;
      }
    }

    window.addEventListener("click", onClick);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.clear(true, true, true);

      renderer.render(scene, camera);
    }
    animate();

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}

export default App;
