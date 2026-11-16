// Lightweight ES2025/ES2026 polyfills required by pdfjs-dist in Safari / older WebKit browsers

(() => {
  const g = globalThis as Record<string, unknown>;

  // 1. Iterator & %IteratorPrototype% helpers (.join, .filter, .map, .toArray)
  const nativeIterProto = Object.getPrototypeOf(Object.getPrototypeOf([].values()));

  if (typeof g.Iterator === 'undefined') {
    const IteratorCtor = function Iterator(this: unknown) {
      if (new.target === IteratorCtor) {
        throw new TypeError('Abstract class Iterator not directly constructable');
      }
    };
    IteratorCtor.prototype = nativeIterProto;
    g.Iterator = IteratorCtor;
  }

  const iterProto = (g.Iterator as { prototype: Record<string, unknown> }).prototype;

  if (typeof iterProto.join !== 'function') {
    iterProto.join = function join(this: Iterable<unknown>, separator?: string): string {
      return [...this].join(separator);
    };
  }

  if (typeof iterProto.toArray !== 'function') {
    iterProto.toArray = function toArray(this: Iterable<unknown>): unknown[] {
      return [...this];
    };
  }

  if (typeof iterProto.filter !== 'function') {
    iterProto.filter = function* filter(
      this: Iterable<unknown>,
      predicate: (value: unknown, index: number) => boolean
    ) {
      let i = 0;
      for (const item of this) {
        if (predicate(item, i++)) yield item;
      }
    };
  }

  if (typeof iterProto.map !== 'function') {
    iterProto.map = function* map(
      this: Iterable<unknown>,
      mapper: (value: unknown, index: number) => unknown
    ) {
      let i = 0;
      for (const item of this) {
        yield mapper(item, i++);
      }
    };
  }

  // 2. Promise.withResolvers
  const promiseCtor = Promise as unknown as Record<string, unknown>;
  if (typeof promiseCtor.withResolvers !== 'function') {
    promiseCtor.withResolvers = function withResolvers<T>() {
      let resolve!: (value: T | PromiseLike<T>) => void;
      let reject!: (reason?: unknown) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
  if (typeof promiseCtor.try !== 'function') {
    promiseCtor.try = function promiseTry<T, A extends unknown[]>(
      fn: (...args: A) => T | PromiseLike<T>,
      ...args: A
    ): Promise<T> {
      return new Promise<T>((resolve) => {
        resolve(fn(...args));
      });
    };
  }

  // 3. Map & WeakMap getOrInsert / getOrInsertComputed
  const mapProto = Map.prototype as unknown as Record<string, unknown>;
  if (typeof mapProto.getOrInsert !== 'function') {
    mapProto.getOrInsert = function getOrInsert<K, V>(this: Map<K, V>, key: K, defaultValue: V): V {
      if (this.has(key)) return this.get(key) as V;
      this.set(key, defaultValue);
      return defaultValue;
    };
  }
  if (typeof mapProto.getOrInsertComputed !== 'function') {
    mapProto.getOrInsertComputed = function getOrInsertComputed<K, V>(
      this: Map<K, V>,
      key: K,
      callback: (key: K) => V
    ): V {
      if (this.has(key)) return this.get(key) as V;
      const value = callback(key);
      this.set(key, value);
      return value;
    };
  }

  const weakMapProto = WeakMap.prototype as unknown as Record<string, unknown>;
  if (typeof weakMapProto.getOrInsert !== 'function') {
    weakMapProto.getOrInsert = function getOrInsert<K extends object, V>(
      this: WeakMap<K, V>,
      key: K,
      defaultValue: V
    ): V {
      if (this.has(key)) return this.get(key) as V;
      this.set(key, defaultValue);
      return defaultValue;
    };
  }
  if (typeof weakMapProto.getOrInsertComputed !== 'function') {
    weakMapProto.getOrInsertComputed = function getOrInsertComputed<K extends object, V>(
      this: WeakMap<K, V>,
      key: K,
      callback: (key: K) => V
    ): V {
      if (this.has(key)) return this.get(key) as V;
      const value = callback(key);
      this.set(key, value);
      return value;
    };
  }

  // 4. Math.sumPrecise
  const mathObj = Math as unknown as Record<string, unknown>;
  if (typeof mathObj.sumPrecise !== 'function') {
    mathObj.sumPrecise = function sumPrecise(items: Iterable<number>): number {
      let sum = 0;
      for (const n of items) {
        sum += Number(n);
      }
      return sum;
    };
  }

  // 5. Uint8Array.fromBase64 & Uint8Array.prototype.toBase64
  const u8Ctor = Uint8Array as unknown as Record<string, unknown>;
  if (typeof u8Ctor.fromBase64 !== 'function') {
    u8Ctor.fromBase64 = function fromBase64(b64: string): Uint8Array {
      const bin = atob(b64);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        out[i] = bin.charCodeAt(i);
      }
      return out;
    };
  }

  const u8Proto = Uint8Array.prototype as unknown as Record<string, unknown>;
  if (typeof u8Proto.toBase64 !== 'function') {
    u8Proto.toBase64 = function toBase64(this: Uint8Array): string {
      let bin = '';
      for (let i = 0; i < this.length; i++) {
        bin += String.fromCharCode(this[i]);
      }
      return btoa(bin);
    };
  }

  // 6. URL.parse & URL.canParse
  if (typeof URL !== 'undefined') {
    const urlCtor = URL as unknown as Record<string, unknown>;
    if (typeof urlCtor.parse !== 'function') {
      urlCtor.parse = function parse(input: unknown, base?: unknown): URL | null {
        try {
          return base !== undefined && base !== null
            ? new URL(String(input), String(base))
            : new URL(String(input));
        } catch {
          return null;
        }
      };
    }
    if (typeof urlCtor.canParse !== 'function') {
      urlCtor.canParse = function canParse(input: unknown, base?: unknown): boolean {
        try {
          if (base !== undefined && base !== null) {
            new URL(String(input), String(base));
          } else {
            new URL(String(input));
          }
          return true;
        } catch {
          return false;
        }
      };
    }
  }

  // 7. Array.prototype.findLast
  const arrProto = Array.prototype as unknown as Record<string, unknown>;
  if (typeof arrProto.findLast !== 'function') {
    arrProto.findLast = function findLast<T>(
      this: T[],
      predicate: (value: T, index: number, array: T[]) => boolean,
      thisArg?: unknown
    ): T | undefined {
      for (let i = this.length - 1; i >= 0; i--) {
        if (predicate.call(thisArg, this[i], i, this)) {
          return this[i];
        }
      }
      return undefined;
    };
  }

  // 8. Set.prototype.union / intersection / difference
  const setProto = Set.prototype as unknown as Record<string, unknown>;
  if (typeof setProto.union !== 'function') {
    setProto.union = function union<T>(this: Set<T>, other: Iterable<T>): Set<T> {
      const out = new Set<T>(this);
      for (const item of other) out.add(item);
      return out;
    };
  }
  if (typeof setProto.intersection !== 'function') {
    setProto.intersection = function intersection<T>(this: Set<T>, other: Set<T>): Set<T> {
      const out = new Set<T>();
      for (const item of this) {
        if (other.has(item)) out.add(item);
      }
      return out;
    };
  }
  if (typeof setProto.difference !== 'function') {
    setProto.difference = function difference<T>(this: Set<T>, other: Set<T>): Set<T> {
      const out = new Set<T>();
      for (const item of this) {
        if (!other.has(item)) out.add(item);
      }
      return out;
    };
  }
})();

export {};
