// src/game/classes/Rocket.js
import Vehicule from "./Vehicule.jsx";

export default class Fusée extends Vehicule {
  constructor(name, speed, fuel, thrust) {
    super(name, speed, fuel);
    this.thrust = thrust; // en Newton (N)
  }

  launch() {
    if (this.fuel > 20) {
      console.log(
        `🚀 ${this.name} décolle avec une poussée de ${this.thrust} N !`
      );
      this.fuel -= 20;
    } else {
      console.log(`⛽ Pas assez de carburant pour décoller !`);
    }
  }
}
