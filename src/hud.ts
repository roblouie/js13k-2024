class Hud {
  private keyNumberElement: HTMLDivElement
  private healthElement: HTMLDivElement;
  private bottomHudElement: HTMLDivElement;

  constructor() {
    this.keyNumberElement = document.querySelector<HTMLDivElement>('#roomNumber')!;
    this.healthElement = document.querySelector<HTMLDivElement>('#health')!;
    this.bottomHudElement = document.querySelector<HTMLDivElement>('#bottomHud')!;
  }

  setKeyNumber(keyNumber: number) {
    this.keyNumberElement.textContent = `🗝️ #${keyNumber}`;
  }

  setHealth(health: number) {
    this.healthElement.style.width = `${health * 2}px`;
  }

  clearFreeBottomText() {
    this.bottomHudElement.textContent = '';
  }

  setFreeBottomText(text: string) {
    this.bottomHudElement.textContent = text;
  }
}

export const hud = new Hud();