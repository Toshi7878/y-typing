import { RefObject } from "react";
import ReactPlayer from "react-player";

class Timer {
  public currentTime: number;
  public constantTime: number;
  private listeners: Array<() => void>;

  constructor() {
    this.currentTime = 0;
    this.constantTime = 0;
    this.listeners = [];
  }

  update(playerRef: RefObject<ReactPlayer>) {
    const currentTime = playerRef?.current?.getCurrentTime();
    if (currentTime !== undefined) {
      this.currentTime = currentTime;
      this.notifyListeners();
    }
  }

  roundByDigit(num: number, digit: number): number {
    const multiplier = Math.pow(10, digit);
    return Math.round(num * multiplier) / multiplier;
  }

  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: () => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const timer = new Timer();
