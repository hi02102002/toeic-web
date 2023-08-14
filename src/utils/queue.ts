export class Queue<T> {
   private _store: T[] = [];

   constructor(init: T[] = []) {
      this._store = [...init];
   }

   enqueue(val: T) {
      this._store.push(val);
   }

   dequeue() {
      return this._store.shift();
   }

   peek() {
      return this._store[0];
   }

   getLength(): number {
      return this._store.length;
   }

   isEmpty(): boolean {
      return this._store.length === 0;
   }

   getStore(): T[] {
      return this._store;
   }

   setStore(val: T[]) {
      this._store = [...val];
   }
}
