import * as THREE from 'three';

export function buildCityBlock(): THREE.Group {
  const group = new THREE.Group();

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 220),
    new THREE.MeshStandardMaterial({ color: '#b9c6ae', roughness: 1, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  const roadMat = new THREE.MeshStandardMaterial({ color: '#40414a', roughness: 0.92, metalness: 0.1 });
  const road = new THREE.Mesh(new THREE.BoxGeometry(40, 0.1, 12), roadMat);
  road.position.set(0, 0.03, 0);
  road.receiveShadow = true;
  group.add(road);

  const crossRoad = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 40), roadMat);
  crossRoad.position.set(0, 0.03, 0);
  group.add(crossRoad);

  const sidewalkMat = new THREE.MeshStandardMaterial({ color: '#95a2aa', roughness: 0.95 });
  const sidewalkLarge = new THREE.Mesh(new THREE.BoxGeometry(44, 0.12, 3.2), sidewalkMat);
  sidewalkLarge.position.set(0, 0.07, 7.5);
  group.add(sidewalkLarge);

  const sidewalkLarge2 = new THREE.Mesh(new THREE.BoxGeometry(44, 0.12, 3.2), sidewalkMat);
  sidewalkLarge2.position.set(0, 0.07, -7.5);
  group.add(sidewalkLarge2);

  const sidewalkTall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 44), sidewalkMat);
  sidewalkTall.position.set(7.5, 0.07, 0);
  group.add(sidewalkTall);

  const sidewalkTall2 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 44), sidewalkMat);
  sidewalkTall2.position.set(-7.5, 0.07, 0);
  group.add(sidewalkTall2);

  const buildingMat = new THREE.MeshStandardMaterial({ color: '#d4d7db', roughness: 0.92 });
  const buildingPositions = [
    [-16, 6, -15],
    [16, 6, -15],
    [-16, 6, 15],
    [16, 6, 15],
    [-30, 4, 0],
    [30, 4, 0],
  ];

  for (const [x, h, z] of buildingPositions) {
    const building = new THREE.Mesh(new THREE.BoxGeometry(8, h, 10), buildingMat);
    building.position.set(x, h / 2, z);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);
  }

  const lampGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.2, 10);
  const lampMat = new THREE.MeshStandardMaterial({ color: '#4a4a4a' });

  for (const x of [-12, -4, 4, 12]) {
    const pole = new THREE.Mesh(lampGeo, lampMat);
    pole.position.set(x, 2.1, 10);
    group.add(pole);

    const lamp = new THREE.PointLight('#ffdcb2', 0.8, 18, 2);
    lamp.position.set(x, 4.6, 10);
    group.add(lamp);

    const pole2 = pole.clone();
    pole2.position.z = -10;
    group.add(pole2);

    const lamp2 = lamp.clone();
    lamp2.position.z = -10;
    group.add(lamp2);
  }

  const parking = new THREE.Mesh(new THREE.BoxGeometry(10, 0.08, 8), new THREE.MeshStandardMaterial({ color: '#6d7279' }));
  parking.position.set(20, 0.05, 11);
  group.add(parking);

  return group;
}
