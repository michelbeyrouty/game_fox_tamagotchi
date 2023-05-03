import { ICONS } from "./constants";

const toggleHighlighted = (icon, show) => {
  document
    .querySelector(`.${ICONS[icon]}-icon`)
    .classList.toggle("highlighted", show);
}

export default function initButtons(stateManager) {
  let selectedIcon = 0;
  document.querySelector(".buttons").addEventListener("click", buttonClick);

  function buttonClick({ target }) {
    if (target.classList.contains("left-btn")) {
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (2 + selectedIcon) % ICONS.length;
      toggleHighlighted(selectedIcon, true);
    } else if (target.classList.contains("right-btn")) {
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (1 + selectedIcon) % ICONS.length;
      toggleHighlighted(selectedIcon, true);
    } else {
      stateManager.handleUserAction(ICONS[selectedIcon]);
    }
  }
}
