type IdleCallbackHandle = number;

type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback) => IdleCallbackHandle;
  cancelIdleCallback?: (handle: IdleCallbackHandle) => void;
};

export function scheduleIdleTask(task: () => void): number {
  const idleWindow = window as IdleWindow;

  if (idleWindow.requestIdleCallback) {
    return idleWindow.requestIdleCallback(task);
  }

  return window.setTimeout(task, 0);
}

export function cancelIdleTask(id: number): void {
  const idleWindow = window as IdleWindow;

  if (idleWindow.cancelIdleCallback) {
    idleWindow.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
}
