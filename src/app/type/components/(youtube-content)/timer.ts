import { RefsContextType } from "../../(contexts)/refsProvider";

class TimerEvent {
  private listeners: Array<(currentTime: string) => void>;

  constructor() {
    this.listeners = [];
  }

  addListener(listener: (currentTime: string) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (currentTime: string) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  protected notifyListeners(currentTime: string) {
    this.listeners.forEach((listener) => listener(currentTime));
  }
}

class Timer extends TimerEvent {
  public currentTime: string;

  constructor() {
    super();
    this.currentTime = "0";
  }

  update(playerRef: RefsContextType["playerRef"]) {
    const currentTime = Number(playerRef.current.getCurrentTime()).toFixed(3);
    this.currentTime = currentTime;
    console.log(this.currentTime);
    this.notifyListeners(currentTime);
  }
}

export const timer = new Timer();
