import * as THREE from 'three';


// Création du terrain
export const createTerrain = () => {
  const geometry = new THREE.PlaneGeometry(200, 200, 30, 30);
  geometry.rotateX(-Math.PI / 2);
  
  // Manipuler les vertices pour créer un terrain plus naturel
  for (let i = 0; i < geometry.attributes.position.array.length; i += 3) {
    const x = geometry.attributes.position.array[i];
    const z = geometry.attributes.position.array[i + 2];
    
    // Crée des collines douces
    geometry.attributes.position.array[i + 1] = Math.sin(x/10) * Math.cos(z/10) * 5;
  }
  
  // Matériau pour l'herbe
  const material = new THREE.MeshStandardMaterial({
    color: 0x4CAF50,
    side: THREE.DoubleSide,
    flatShading: true
  });
  
  const terrain = new THREE.Mesh(geometry, material);
  terrain.receiveShadow = true;
  
  return terrain;
};

const createTree = (x, z) => {
  // Tronc
  const trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 5, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(0, 2.5, 0);  // Le tronc est à l'origine du groupe (0, 0, 0)

  // Feuillage
  const leavesGroup = new THREE.Group();

  const leavesGeo1 = new THREE.ConeGeometry(3, 4, 8);
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const leaves1 = new THREE.Mesh(leavesGeo1, leavesMat);
  leaves1.position.set(0, 5, 0);  // Feuillage commence à 5 (2.5 + 4)
  leavesGroup.add(leaves1);

  const leavesGeo2 = new THREE.ConeGeometry(2.2, 3, 8);
  const leaves2 = new THREE.Mesh(leavesGeo2, leavesMat);
  leaves2.position.set(0, 7, 0);  // Feuillage à 7
  leavesGroup.add(leaves2);

  const leavesGeo3 = new THREE.ConeGeometry(1.5, 2, 8);
  const leaves3 = new THREE.Mesh(leavesGeo3, leavesMat);
  leaves3.position.set(0, 8.5, 0);  // Feuillage à 8.5
  leavesGroup.add(leaves3);

  // Groupe de l'arbre
  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leavesGroup);

  // Positionner l'arbre entier (tronc + feuillage) à la position globale (x, 0, z)
  tree.position.set(x, 0, z);

  return tree;
};

// Création de plusieurs arbres
export const createTrees = (numTrees) => {
  const trees = [];
  
  for (let i = 0; i < numTrees; i++) {
    const x = Math.random() * 150 - 75;
    const z = Math.random() * 150 - 75;
    const tree = createTree(x, z);
    trees.push(tree);
  }
  
  return trees;
};