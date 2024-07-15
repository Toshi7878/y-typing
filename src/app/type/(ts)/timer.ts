import { RefsContextType } from "../(contexts)/refsProvider";

class TimerEvent {
  private listeners: Array<(currentTime: number) => void>;

  constructor() {
    this.listeners = [];
  }

  addListener(listener: (currentTime: number) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (currentTime: number) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  protected notifyListeners(currentTime: number) {
    this.listeners.forEach((listener) => listener(currentTime));
  }
}

class Timer extends TimerEvent {
  constructor() {
    super();
  }

  update(playerRef: RefsContextType["playerRef"]) {
    const currentTime = Number(playerRef.current.getCurrentTime());

    this.notifyListeners(currentTime);
  }
}

export const timer = new Timer();
