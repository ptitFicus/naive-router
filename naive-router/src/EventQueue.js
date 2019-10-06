class EventQueue {
  constructor() {
    this.notFound = true;
    this.queue = [];
    this.notFoundQueue = [];
    this.callbackScheduled = false;
  }

  suscribe(callback) {
    this.queue.push(callback);
    if (!this.callbackScheduled) {
      this.callbackScheduled = true;
      this.scheduleBroadcast();
    }
  }

  suscribeNotFound(callback) {
    this.notFoundQueue.push(callback);

    if (!this.callbackScheduled) {
      this.callbackScheduled = true;
      this.scheduleBroadcast();
    }
  }

  scheduleBroadcast() {
    Promise.resolve().then(() => {
      this.broadcast();
      this.callbackScheduled = false;
    });
  }

  unsuscribe(callback) {
    this._unsuscribe(callback, this.queue);
    this._unsuscribe(callback, this.notFoundQueue);
  }

  _unsuscribe(callback, queue) {
    const index = queue.indexOf(callback);
    if (index === -1) {
      return;
    }
    queue.splice(index, 1);
  }

  broadcast() {
    const routeMatched = this.queue.reduce(
      (acc, nextCallback) => nextCallback() || acc,
      false
    );

    if (!routeMatched) {
      this.notFound = true;
      this.displayNotFoundRoutes();
    } else if (this.notFound) {
      this.notFound = false;
      this.hideNotFoundRoutes();
    }
  }

  hideNotFoundRoutes() {
    this.notFoundQueue.forEach(callback => callback(true));
  }

  displayNotFoundRoutes() {
    this.notFoundQueue.forEach(callback => callback(false));
  }
}

const proxify = callback => name => {
  const callbackSymbol = Symbol();
  window.history[callbackSymbol] = window.history[name];
  window.history[name] = (...args) => {
    window.history[callbackSymbol](...args);
    callback();
  };
};

const queue = new EventQueue();

const doProxify = proxify(() => queue.broadcast());

doProxify("pushState");
doProxify("back");
doProxify("forward");
doProxify("go");
doProxify("replaceState");

window.addEventListener("popstate", () => queue.broadcast());

export default queue;
