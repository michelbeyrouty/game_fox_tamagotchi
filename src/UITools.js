export default class UITools {

  constructor() {

  }

  static writeModal(text = "") {
    document.querySelector(".modal").innerHTML = `<div class="modal-inner">${text}</div>`;
  };

  static togglePoopBag(show) {
    document.querySelector(".poop-bag").classList.toggle("hidden", !show);
  };

  static modScene(state) {
    document.querySelector(".game").className = `game ${state}`;
  };

  static modFox(state) {
    document.querySelector(".fox").className = `fox fox-${state}`;
  };

}
