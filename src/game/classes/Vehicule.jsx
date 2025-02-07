// src/game/classes/Vehicle.js
export default class Vehicle {
  constructor(name, speed, fuel) {
    this.name = name;
    this.speed = speed; // en km/h
    this.fuel = fuel; // en %
  }

  move() {
    if (this.fuel > 0) {
      console.log(`${this.name} se déplace à ${this.speed} km/h.`);
      this.fuel -= 10;
    } else {
      console.log(`${this.name} n'a plus de carburant !`);
    }
  }
}
