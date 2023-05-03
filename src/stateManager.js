import UITools from "./UITools";
import { RAIN_CHANCE, SCENES, DAY_LENGTH, NIGHT_LENGTH, getNextDieTime, getNextHungerTime, getNextPoopTime } from "./constants"

class StateManager {

  constructor() {
    this.current = "INIT";
    this.clock = 1;
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
    this.poopTime = -1;
  }

  tick() {
    console.log(this.current, "clock ", this.clock)
    this.clock++;
    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep()
    } else if (this.clock === this.hungryTime) {
      this.getHungry()
    } else if (this.clock === this.dieTime) {
      this.die()
    } else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating()
    } else if (this.clock === this.timeToEndCelebrating) {
      this.endCelebrating()
    } else if (this.clock === this.poopTime) {
      this.poop()
    }

    return this.clock;
  }

  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    UITools.modFox("egg");
    UITools.modScene("day");
    UITools.writeModal();
  }

  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1
    UITools.modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  }

  sleep() {
    this.current = "SLEEP";
    UITools.modFox("sleep");
    UITools.modScene("night");
    this.clearTimes()
    this.wakeTime = this.clock + NIGHT_LENGTH
  }

  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    UITools.modFox("hungry");
  }

  die() {
    this.current = "DEAD";
    UITools.modFox("dead");
    UITools.modScene("dead")
    this.clearTimes();
    UITools.writeModal("He IS DEAAAAAD <br/> PRess the middle button to start again");
  }

  clearTimes() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
    this.poopTime = -1;
  }

  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    UITools.modFox("pooping")
  }

  startCelebrating() {
    this.current = "CELEBRATING";
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 3
    UITools.modFox("celebrate")
  }

  endCelebrating() {
    this.timeToEndCelebrating = -1;
    this.current = "IDLING";
    this.determineFoxState();
    UITools.togglePoopBag(false)
  }

  determineFoxState() {
    if (["IDLING",].includes(this.current)) {
      if (SCENES[this.scene] === "rain") {
        UITools.modFox("rain")
      } else {
        UITools.modFox("idling")
      }
    };
  }

  handleUserAction(icon) {
    console.log(icon)
    if (["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)) {
      return
    }

    if (["INIT", "DEAD"].includes(this.current)) {
      this.startGame();
      return
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;

    }
  }

  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length
    UITools.modScene(SCENES[this.scene]);
    this.determineFoxState();
  }

  cleanUpPoop() {
    if (this.current === "POOPING") {
      this.dieTime = -1;
      UITools.togglePoopBag(true);
      this.startCelebrating();
      this.hungryTime = getNextHungerTime(this.clock);
    }
  }

  feed() {
    // can only feed when hungry
    if (!["HUNGRY"].includes(this.current)) {
      return;
    }

    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    console.log(this.poopTime)
    UITools.modFox("eating")
    this.timeToStartCelebrating = this.clock + 2;
  }
}

export default StateManager
