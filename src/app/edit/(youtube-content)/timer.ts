import { RefObject } from "react";
import ReactPlayer from "react-player";

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
  public constantTime: number;

  constructor() {
    super();
    this.currentTime = "0";
    this.constantTime = 0;
  }

  update(playerRef: RefObject<ReactPlayer>) {
    const currentTime = Number(playerRef?.current?.getCurrentTime()).toFixed(3);
    this.currentTime = currentTime;
    this.notifyListeners();
  }
}

export const timer = new Timer();
