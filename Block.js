class Block {
  constructor(index, prevHash, ts, data, hash) {
    this.index = index;
    this.prevHash = prevHash;
    this.ts = ts;
    this.data = data;
    this.hash = hash;
  }
}
