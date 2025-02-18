// src/game/classes/Entity.js
export default class Entity {
  constructor(name, position = [0, 0, 0]) {
    this.name = name;
    this.position = position;
  }

  move(x, y, z) {
    this.position = [x, y, z];
  }
}
