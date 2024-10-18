import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AddObject from './components/AddObject';
import ObjectProperties from './components/ObjectProperties';
import { Paper, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';


class Trail extends THREE.Group {
  constructor(color, maxLength) {
    super();
    this.color = color;
    this.maxLength = maxLength;
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.LineBasicMaterial({ color: this.color });
    this.line = new THREE.Line(this.geometry, this.material);
    this.add(this.line);
    this.points = [];
  }

  update(position) {
    this.points.push(position.clone());
    if (this.points.length > this.maxLength) {
      this.points.shift();
    }
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.points.flatMap(p => [p.x, p.y, p.z]), 3));
  }
}


const App = () => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);

  const simulationRef = useRef(false); // Use ref to manage simulation state
  const [isRunning, setIsRunning] = useState(false); // State for simulation button

  const [objectProps, setObjectProps] = useState({
    type: 'planet',
    color: '#ff0000',
    radius: 1,
    mass: 100,
    name: '',
    position: { x: 0, y: 0, z: 0 }, // Initial position
    velocity: { vx: 0, vy: 0, vz: 0 }, // Initial velocity
  });
  const [objects, setObjects] = useState([]);
  const objectsRef = useRef(objects);

  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  useEffect(() => {
    const newScene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) mountRef.current.appendChild(newRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1).normalize();
    newScene.add(directionalLight);

    newCamera.position.set(0, 5, 15);
    newCamera.lookAt(0, 0, 0);

    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.25;
    newControls.enableZoom = true;
    newControls.enablePan = true;
    newControls.maxDistance = 100;
    newControls.minDistance = 5;

    setControls(newControls);

    const animate = () => {
      requestAnimationFrame(animate);
      newControls.update();

      if (simulationRef.current) {
      const G = 1; // Gravitational constant
      const timeStep = 1 / 60; // Simulation time step

      // Iterate over all objects and calculate gravitational force
      objectsRef.current.forEach((obj, i) => {
        const acceleration = new THREE.Vector3(0, 0, 0); // Reset acceleration

        // Calculate forces from all other objects
        objectsRef.current.forEach((otherObj, j) => {
          if (i !== j) {
            const distanceVector = new THREE.Vector3().subVectors(
              otherObj.mesh.position,
              obj.mesh.position
            );
            const distance = distanceVector.length();

            if (distance > 0) {
              const forceMagnitude = (G * obj.mass * otherObj.mass) / (distance * distance);
              const force = distanceVector.normalize().multiplyScalar(forceMagnitude);

              // Calculate acceleration from force (a = F/m)
              const accel = force.clone().multiplyScalar(1 / obj.mass);
              acceleration.add(accel); // Sum accelerations from other objects
            }
          }
        });

        // Update velocity (v = v + a * dt)
        obj.velocity.add(acceleration.multiplyScalar(timeStep));

        // Update position (x = x + v * dt)
        obj.mesh.position.add(obj.velocity.clone().multiplyScalar(timeStep));

        // Update object properties in Three.js
        obj.mesh.position.copy(obj.mesh.position);

        // Update trail
        if (obj.trail) {
          obj.trail.update(obj.mesh.position);
        }
      });

    }
      newRenderer.render(newScene, newCamera);
    };

    animate();

    const handleResize = () => {
      newRenderer.setSize(window.innerWidth, window.innerHeight);
      newCamera.aspect = window.innerWidth / window.innerHeight;
      newCamera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);

    return () => {
      if (mountRef.current && newRenderer.domElement) {
        mountRef.current.removeChild(newRenderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const addObject = () => {
    if (!scene) {
      console.error("Scene not initialized yet.");
      return;
    }

    const { type, color, radius, mass, name, position, velocity } = objectProps;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position.x, position.y, position.z);
    mesh.userData = { type, color, radius, name };

    const object = {
      mesh,
      velocity: new THREE.Vector3(velocity.vx, velocity.vy, velocity.vz),
      mass: mass,
      radius: radius,
      name: name,
      trail: new Trail(color, 1000), // Create a new trail
    };

    scene.add(mesh);
    scene.add(object.trail); // Add the trail to the scene
    setObjects(prevObjects => [...prevObjects, object]);
    console.log(`${type} named "${name}" added to scene!`);
  };

  const updateObject = (index, key, value) => {
    const updatedObjects = [...objects];  // Create a copy of the objects array
    const selectedObject = updatedObjects[index];  // Get the selected object

    if (selectedObject) {
      // Handle different properties
      switch (key) {
        case 'color':
          selectedObject.color = value;
          selectedObject.mesh.material.color.set(value);  // Update color in Three.js
          selectedObject.trail.material.color.set(value); //update trail color
          break;

        case 'radius':
          selectedObject.radius = value;
          selectedObject.mesh.geometry.dispose();
          selectedObject.mesh.geometry = new THREE.SphereGeometry(value, 32, 32);  // Update radius in Three.js
          break;

        case 'name':
          selectedObject.name = value;
          break;

        case 'mass':
          selectedObject.mass = value;
          break;

        case 'positionX':
          selectedObject.mesh.position.x = value;  // Update position X in Three.js
          break;

        case 'positionY':
          selectedObject.mesh.position.y = value;  // Update position Y in Three.js
          break;

        case 'positionZ':
          selectedObject.mesh.position.z = value;  // Update position Z in Three.js
          break;

        case 'velocityX':
          selectedObject.velocity.x = value;  // Update velocity X
          break;

        case 'velocityY':
          selectedObject.velocity.y = value;  // Update velocity Y
          break;

        case 'velocityZ':
          selectedObject.velocity.z = value;  // Update velocity Z
          break;

        default:
          break;
      }

      setObjects(updatedObjects);  // Update state with modified objects array
    } else {
      console.error("Selected object not found:", index);
    }
  };

  const removeObject = (index) => {
    const updatedObjects = [...objects];  // Create a copy of the objects array
    const selectedObject = updatedObjects[index];  // Get the selected object

    if (selectedObject) {
      // Remove the object from Three.js scene
      scene.remove(selectedObject.mesh);

      updatedObjects.splice(index, 1);  // Remove the object from the array
      setObjects(updatedObjects);  // Update state with the modified array
    } else {
      console.error("Selected object not found for removal:", index);
    }
  };
  const toggleSimulation = () => {
    simulationRef.current = !simulationRef.current; // Toggle the ref value
    setIsRunning(prev => !prev); // Update the state for button rendering
  };
  return (
    <div style={{ display: 'flex' }}>

      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', borderRadius: 10 }}>
        <IconButton onClick={toggleSimulation} color="primary">
          {isRunning  ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </div>

      <Paper style={{ width: '300px' }}>
        <AddObject objectProps={objectProps} setObjectProps={setObjectProps} addObject={addObject} />
      </Paper>
      <Paper style={{ width: '300px' }}>
        <ObjectProperties
          objects={objects}
          updateObject={updateObject}
          removeObject={removeObject}
        />
      </Paper>
      <div ref={mountRef} style={{ flex: 1 }} />
    </div>
  );
};

export default App;