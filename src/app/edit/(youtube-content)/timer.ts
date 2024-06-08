import { RefObject } from "react";

class TimerEvent {
  private listeners: Array<() => void>;

  constructor() {
    this.listeners = [];
  }

  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: () => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  protected notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

class Timer extends TimerEvent {
  public currentTime: string;

  constructor() {
    super();
    this.currentTime = "0";
  }

  update(playerRef: RefObject<any>) {
    const currentTime = Number(playerRef?.current?.getCurrentTime()).toFixed(3);
    this.currentTime = currentTime;
    this.notifyListeners();
  }
}

export const timer = new Timer();
