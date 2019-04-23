class EventQueue {
  constructor() {
    this.queue = [];
  }

  suscribe(callback) {
    this.queue.push(callback);
  }

  unsuscribe(callback) {
    const index = this.queue.indexOf(callback);
    if (index === -1) {
      return;
    }
    this.queue.splice(index, 1);
  }

  broadcast() {
    this.queue.forEach(callback => callback());
  }
}

export default EventQueue;
