import StateManager from "./classes/stateManager"
import initButtons from "./bottons";
import { TICK_RATE } from "./constants"

async function init() {
  const stateManager = new StateManager();

  initButtons(stateManager)

  let nextTimeToTick = Date.now();
  function nextAnimationFrame() {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      stateManager.tick();
      nextTimeToTick = now + TICK_RATE;
    }
    requestAnimationFrame(nextAnimationFrame);
  }

  nextAnimationFrame();
}

init();
