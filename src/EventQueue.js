class EventQueue {
  constructor() {
    this.notFound = false;
    this.queue = [];
    this.notFoundQueue = [];
  }

  suscribe(callback) {
    this.queue.push(callback);
  }

  suscribeNotFound(callback) {
    this.notFoundQueue.push(callback);
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

export default EventQueue;
