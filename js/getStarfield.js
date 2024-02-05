import * as THREE from "three";

export default function getStarfield({ maxStars = 500 } = {}) {
  const randomSpherePoint = () => {
    const radius = Math.random() * 25 + 20;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return  new THREE.Vector3(x, y, z);
  }

  const colors = [];
  const positions = [];

  for (let i = 0; i < maxStars; i += 1) {
    const  coordinates  = randomSpherePoint();
    const color = new THREE.Color().setHSL(0.6, 0.2, Math.random());

    positions.push(coordinates.x, coordinates.y, coordinates.z);
    colors.push(color.r, color.g, color.b);
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  starGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const starMaterial = new THREE.PointsMaterial({
    size: 0.2*Math.random() + 0.1,
    vertexColors: true,
  });

  return new THREE.Points(starGeometry, starMaterial);
}
