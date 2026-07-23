// Loot system: rarities, item types, drop chances, inventory persistence
// and the daily shop stock. Items are {t: typeIndex, r: rarityIndex}.

const RARITIES = [
  { key: 'common',   name: 'COMMON',   color: '#9e9e9e', tint: 0x9e9e9e, weight: 50, salvage: 0.25, price: 15 },
  { key: 'uncommon', name: 'UNCOMMON', color: '#4caf50', tint: 0x4caf50, weight: 25, salvage: 1,    price: 30 },
  { key: 'rare',     name: 'RARE',     color: '#2196f3', tint: 0x2196f3, weight: 15, salvage: 5,    price: 55 },
  { key: 'epic',     name: 'EPIC',     color: '#9c27b0', tint: 0x9c27b0, weight: 7,  salvage: 15,   price: 80 },
  { key: 'unique',   name: 'UNIQUE',   color: '#ff9800', tint: 0xff9800, weight: 3,  salvage: 50,   price: 120 }
];

const ITEM_TYPES = [
  { key: 'sword', label: 'SWORD', tex: 'it_sword',
    mult: r => (r >= 3 ? 2 : 1.5), multWords: [8, 12, 16, 22, 30],
    desc: r => 'credits ×' + (r >= 3 ? 2 : 1.5) + ' for ' + [8, 12, 16, 22, 30][r] + ' words' },
  { key: 'armor', label: 'ARMOR', tex: 'it_armor',
    save: [5, 8, 12, 16, 20],
    desc: r => 'death save — revive with ' + [5, 8, 12, 16, 20][r] + 's' },
  { key: 'potion', label: 'POTION', tex: 'it_potion',
    time: [10, 20, 30, 45, 60],
    desc: r => '+' + [10, 20, 30, 45, 60][r] + 's time, instantly' },
  { key: 'scroll', label: 'SCROLL', tex: 'it_scroll',
    hints: [1, 1, 2, 2, 3],
    desc: r => [1, 1, 2, 2, 3][r] + ' free hint(s)' },
  { key: 'treasure', label: 'TREASURE', tex: 'it_treasure',
    credits: [5, 10, 20, 35, 50],
    desc: r => '+' + [5, 10, 20, 35, 50][r] + ' credits, instantly' }
];

const INV_MAX = 12;

const Items = {
  makeTextures(scene) {
    const g = scene.add.graphics();
    const mk = (key, draw) => {
      if (scene.textures.exists(key)) return;
      g.clear();
      draw();
      g.generateTexture(key, 22, 22);
    };
    mk('it_sword', () => {
      g.fillStyle(0xdfe7ec).fillTriangle(4, 18, 15, 3, 18, 7);
      g.fillStyle(0x5d4037).fillRect(2, 15, 7, 3);
      g.fillStyle(0xc9a227).fillRect(6, 13, 3, 7);
    });
    mk('it_armor', () => {
      g.fillStyle(0x90a4ae).fillRect(5, 5, 12, 13);
      g.fillStyle(0xb0bec5).fillRect(5, 5, 12, 3);
      g.fillStyle(0x78909c).fillRect(3, 5, 3, 6).fillRect(16, 5, 3, 6);
      g.fillStyle(0x546e7a).fillRect(10, 8, 2, 8);
    });
    mk('it_potion', () => {
      g.fillStyle(0x8d6e63).fillRect(8, 2, 6, 3);
      g.fillStyle(0xcfd8dc).fillRect(9, 5, 4, 3);
      g.fillStyle(0xd32f2f).fillRect(6, 8, 10, 11);
      g.fillStyle(0xef5350).fillRect(6, 8, 4, 4);
    });
    mk('it_scroll', () => {
      g.fillStyle(0xd7ccc8).fillRect(4, 6, 14, 11);
      g.fillStyle(0xa1887f).fillRect(3, 5, 3, 13).fillRect(16, 5, 3, 13);
      g.fillStyle(0x8d6e63).fillRect(7, 9, 8, 1).fillRect(7, 12, 8, 1);
    });
    mk('it_treasure', () => {
      g.fillStyle(0x4dd0e1).fillTriangle(4, 9, 18, 9, 11, 20);
      g.fillStyle(0x80deea).fillRect(6, 5, 10, 4);
      g.fillStyle(0xb2ebf2).fillRect(6, 5, 4, 4);
    });
    g.destroy();
    ['it_sword', 'it_armor', 'it_potion', 'it_scroll', 'it_treasure'].forEach(k =>
      scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST));
  },

  rollRarity(rnd = Math.random) {
    let roll = rnd() * RARITIES.reduce((s, r) => s + r.weight, 0);
    for (let i = 0; i < RARITIES.length; i++) {
      roll -= RARITIES[i].weight;
      if (roll < 0) return i;
    }
    return 0;
  },

  roll(rnd = Math.random) {
    return { t: Math.floor(rnd() * ITEM_TYPES.length), r: this.rollRarity(rnd) };
  },

  name(it) {
    return RARITIES[it.r].name + ' ' + ITEM_TYPES[it.t].label;
  },

  desc(it) {
    return ITEM_TYPES[it.t].desc(it.r);
  },

  // base 8%, +6% per stage (max +30% at survival), +20% during festivals
  dropChance(stageIndex, inFestival) {
    return 0.08 + Math.min(stageIndex, 5) * 0.06 + (inFestival ? 0.20 : 0);
  },

  load() {
    try { return JSON.parse(localStorage.getItem('los_inv') || '[]'); }
    catch (e) { return []; }
  },

  save(inv) {
    try { localStorage.setItem('los_inv', JSON.stringify(inv)); } catch (e) {}
  },

  // date-seeded daily stock of 4 items; purchases are remembered per day
  shopStock() {
    const day = new Date().toISOString().slice(0, 10);
    let s = 0;
    for (const ch of day) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const items = [];
    for (let i = 0; i < 4; i++) items.push(this.roll(rnd));
    const soldKey = 'los_shop_' + day;
    let sold;
    try { sold = JSON.parse(localStorage.getItem(soldKey) || '[]'); }
    catch (e) { sold = []; }
    return { day, items, sold, soldKey };
  },

  markSold(stock, index) {
    stock.sold.push(index);
    try { localStorage.setItem(stock.soldKey, JSON.stringify(stock.sold)); } catch (e) {}
  },

  // Prune per-day keys older than ~7 days. Left unchecked, los_daily_<date> and
  // los_shop_<date> accrete one pair per calendar day across the multi-week GMTK
  // voting window — harmless in size but exactly the slow drift that eventually
  // trips a QuotaExceededError. ISO dates sort lexicographically = chronologically.
  pruneOld(keepDays = 7) {
    try {
      const cutoff = new Date(Date.now() - keepDays * 86400000)
        .toISOString().slice(0, 10);
      const stale = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const m = k && k.match(/^los_(?:daily|shop)_(\d{4}-\d{2}-\d{2})$/);
        if (m && m[1] < cutoff) stale.push(k);
      }
      stale.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }
};
