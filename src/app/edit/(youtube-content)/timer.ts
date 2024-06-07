import { RefObject } from "react";
import { UseFormSetValue } from "react-hook-form";

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

  update(playerRef: RefObject<any>) {
    const currentTime = Number(playerRef?.current?.getCurrentTime()).toFixed(3);
    this.currentTime = currentTime;
    this.notifyListeners();
  }

  render(setValue: UseFormSetValue<any>) {
    setValue("EditorTab.time", timer.currentTime);
  }
}

export const timer = new Timer();
