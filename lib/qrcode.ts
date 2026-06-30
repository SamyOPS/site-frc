/**
 * Générateur de QR code minimal (mode octet / byte), sans dépendance.
 * Portage TypeScript condensé de la bibliothèque « QR Code generator »
 * de Project Nayuki (licence MIT). Suffisant pour encoder une URL courte.
 *
 * Usage : `QrCode.encodeText(url, "M").getModules()` → boolean[][]
 * (true = module noir). Le quiet zone n'est PAS inclus, à ajouter au rendu.
 */

export type Ecc = "L" | "M" | "Q" | "H";

const ECC_FORMAT_BITS: Record<Ecc, number> = { L: 1, M: 0, Q: 3, H: 2 };
const ECC_CODEWORDS_PER_BLOCK: Record<Ecc, number[]> = {
  // Indexé par numéro de version (1..40), l'index 0 est un remplissage.
  L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
};
const NUM_ERROR_CORRECTION_BLOCKS: Record<Ecc, number[]> = {
  L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
};

class GF {
  // Multiplication dans GF(2^8) avec le polynôme primitif 0x11D.
  static mul(x: number, z: number): number {
    let r = 0;
    for (let i = 7; i >= 0; i--) {
      r = (r << 1) ^ ((r >>> 7) * 0x11d);
      r ^= ((z >>> i) & 1) * x;
    }
    return r & 0xff;
  }
}

function reedSolomonDivisor(degree: number): number[] {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = GF.mul(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = GF.mul(root, 0x02);
  }
  return result;
}

function reedSolomonRemainder(data: number[], divisor: number[]): number[] {
  const result = new Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ result.shift()!;
    result.push(0);
    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= GF.mul(divisor[i], factor);
    }
  }
  return result;
}

export class QrCode {
  static encodeText(text: string, ecl: Ecc = "M", forcedMask = -1): QrCode {
    const data = utf8Bytes(text);
    // Choix de la plus petite version (1..40) qui contient les données.
    for (let version = 1; version <= 40; version++) {
      const capacityBits = QrCode.dataCapacityBits(version, ecl);
      // En-tête byte mode : 4 bits (mode) + bits du compteur de longueur.
      const ccBits = version <= 9 ? 8 : version <= 26 ? 16 : 16;
      const usedBits = 4 + ccBits + data.length * 8;
      if (usedBits <= capacityBits) {
        return new QrCode(version, ecl, data, ccBits, forcedMask);
      }
    }
    throw new Error("Données trop longues pour un QR code");
  }

  readonly size: number;
  private modules: boolean[][];
  private isFunction: boolean[][];

  private constructor(
    readonly version: number,
    readonly ecl: Ecc,
    data: number[],
    ccBits: number,
    forcedMask = -1
  ) {
    this.size = version * 4 + 17;
    this.modules = Array.from({ length: this.size }, () =>
      new Array(this.size).fill(false)
    );
    this.isFunction = Array.from({ length: this.size }, () =>
      new Array(this.size).fill(false)
    );

    const bits = this.buildDataBits(data, ccBits);
    const codewords = this.addEccAndInterleave(bits);

    this.drawFunctionPatterns();
    this.drawCodewords(codewords);

    // Choix du masque minimisant la pénalité (conformité scanners).
    let bestMask = forcedMask;
    let minPenalty = Infinity;
    if (forcedMask < 0)
    for (let mask = 0; mask < 8; mask++) {
      this.applyMask(mask);
      this.drawFormatBits(mask);
      const penalty = this.penaltyScore();
      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestMask = mask;
      }
      this.applyMask(mask); // annule (XOR involutif)
    }
    this.applyMask(bestMask);
    this.drawFormatBits(bestMask);
  }

  getModules(): boolean[][] {
    return this.modules.map((row) => row.slice());
  }

  // --- Construction des bits de données ---

  private buildDataBits(data: number[], ccBits: number): number[] {
    const bits: number[] = [];
    const append = (val: number, len: number) => {
      for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    };
    append(0b0100, 4); // mode byte
    append(data.length, ccBits);
    for (const b of data) append(b, 8);

    const capacityBits = QrCode.dataCapacityBits(this.version, this.ecl);
    // Terminateur + alignement octet.
    append(0, Math.min(4, capacityBits - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);
    // Octets de bourrage alternés.
    for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) {
      append(pad, 8);
    }
    return bits;
  }

  private addEccAndInterleave(bits: number[]): number[] {
    const ver = this.version;
    const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[this.ecl][ver];
    const blockEccLen = ECC_CODEWORDS_PER_BLOCK[this.ecl][ver];
    const rawCodewords = Math.floor(QrCode.numRawDataModules(ver) / 8);
    const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);

    const dataBytes: number[] = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      dataBytes.push(b);
    }

    const divisor = reedSolomonDivisor(blockEccLen);
    const blocks: number[][] = [];
    let k = 0;
    for (let i = 0; i < numBlocks; i++) {
      const datLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
      const dat = dataBytes.slice(k, k + datLen);
      k += datLen;
      const ecc = reedSolomonRemainder(dat, divisor);
      // Les blocs courts reçoivent un 0 de padding pour aligner toutes les
      // longueurs ; cette cellule est ensuite ignorée à l'entrelacement.
      if (i < numShortBlocks) dat.push(0);
      blocks.push(dat.concat(ecc));
    }

    // Entrelacement des blocs (colonne par colonne).
    const result: number[] = [];
    for (let i = 0; i < blocks[0].length; i++) {
      for (let j = 0; j < blocks.length; j++) {
        // Saute la cellule de padding des blocs courts.
        if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
          result.push(blocks[j][i]);
        }
      }
    }
    return result;
  }

  // --- Patterns fonctionnels ---

  private setFunctionModule(x: number, y: number, isDark: boolean) {
    this.modules[y][x] = isDark;
    this.isFunction[y][x] = true;
  }

  private drawFunctionPatterns() {
    const size = this.size;
    // Timing patterns.
    for (let i = 0; i < size; i++) {
      this.setFunctionModule(6, i, i % 2 === 0);
      this.setFunctionModule(i, 6, i % 2 === 0);
    }
    // Finder patterns (3 coins).
    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(size - 4, 3);
    this.drawFinderPattern(3, size - 4);
    // Alignment patterns.
    const positions = this.alignmentPatternPositions();
    const n = positions.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // Évite les coins occupés par les finders.
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === n - 1) ||
          (i === n - 1 && j === 0)
        )
          continue;
        this.drawAlignmentPattern(positions[i], positions[j]);
      }
    }
    // Réserve la zone des format bits (remplie plus tard).
    this.drawFormatBits(0);
    this.drawVersion();
  }

  private drawFinderPattern(cx: number, cy: number) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
          this.setFunctionModule(x, y, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  private drawAlignmentPattern(cx: number, cy: number) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.setFunctionModule(
          cx + dx,
          cy + dy,
          Math.max(Math.abs(dx), Math.abs(dy)) !== 1
        );
      }
    }
  }

  private alignmentPatternPositions(): number[] {
    const ver = this.version;
    if (ver === 1) return [];
    const numAlign = Math.floor(ver / 7) + 2;
    const step =
      ver === 32
        ? 26
        : Math.ceil((ver * 4 + 4) / (numAlign * 2 - 2)) * 2;
    const result = [6];
    for (let pos = this.size - 7; result.length < numAlign; pos -= step) {
      result.splice(1, 0, pos);
    }
    return result;
  }

  private drawFormatBits(mask: number) {
    const data = (ECC_FORMAT_BITS[this.ecl] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;

    // Copie 1 (autour du finder haut-gauche).
    for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, getBit(bits, i));
    this.setFunctionModule(8, 7, getBit(bits, 6));
    this.setFunctionModule(8, 8, getBit(bits, 7));
    this.setFunctionModule(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++)
      this.setFunctionModule(14 - i, 8, getBit(bits, i));

    // Copie 2 (répartie sur les deux autres finders).
    const size = this.size;
    for (let i = 0; i < 8; i++)
      this.setFunctionModule(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++)
      this.setFunctionModule(8, size - 15 + i, getBit(bits, i));
    this.setFunctionModule(8, size - 8, true); // module sombre fixe
  }

  private drawVersion() {
    if (this.version < 7) return;
    let rem = this.version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (this.version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = getBit(bits, i);
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, bit);
      this.setFunctionModule(b, a, bit);
    }
  }

  private drawCodewords(data: number[]) {
    let i = 0; // index de bit
    const size = this.size;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5; // saute la colonne du timing
      for (let vert = 0; vert < size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
            i++;
          }
        }
      }
    }
  }

  // --- Masquage ---

  private applyMask(mask: number) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.isFunction[y][x]) continue;
        let invert = false;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          case 7: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        }
        if (invert) this.modules[y][x] = !this.modules[y][x];
      }
    }
  }

  private penaltyScore(): number {
    const size = this.size;
    const mod = this.modules;
    let result = 0;
    const N1 = 3, N2 = 3, N3 = 40, N4 = 10;

    // Règle 1 : séries horizontales et verticales.
    for (let y = 0; y < size; y++) {
      let runColor = false;
      let runLen = 0;
      for (let x = 0; x < size; x++) {
        if (mod[y][x] === runColor) {
          runLen++;
          if (runLen === 5) result += N1;
          else if (runLen > 5) result++;
        } else {
          runColor = mod[y][x];
          runLen = 1;
        }
      }
    }
    for (let x = 0; x < size; x++) {
      let runColor = false;
      let runLen = 0;
      for (let y = 0; y < size; y++) {
        if (mod[y][x] === runColor) {
          runLen++;
          if (runLen === 5) result += N1;
          else if (runLen > 5) result++;
        } else {
          runColor = mod[y][x];
          runLen = 1;
        }
      }
    }

    // Règle 2 : blocs 2x2 de même couleur.
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const c = mod[y][x];
        if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1])
          result += N2;
      }
    }

    // Règle 3 : motifs ressemblant aux finders (1:1:3:1:1).
    const patternA = [true, false, true, true, true, false, true, false, false, false, false];
    const patternB = [false, false, false, false, true, false, true, true, true, false, true];
    const matches = (get: (k: number) => boolean, pat: boolean[], start: number) => {
      for (let k = 0; k < pat.length; k++) if (get(start + k) !== pat[k]) return false;
      return true;
    };
    for (let y = 0; y < size; y++) {
      for (let x = 0; x <= size - 11; x++) {
        const get = (k: number) => mod[y][k];
        if (matches(get, patternA, x) || matches(get, patternB, x)) result += N3;
      }
    }
    for (let x = 0; x < size; x++) {
      for (let y = 0; y <= size - 11; y++) {
        const get = (k: number) => mod[k][x];
        if (matches(get, patternA, y) || matches(get, patternB, y)) result += N3;
      }
    }

    // Règle 4 : équilibre clair/sombre.
    let dark = 0;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) if (mod[y][x]) dark++;
    const total = size * size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += k * N4;

    return result;
  }

  // --- Tables de capacité ---

  private static numRawDataModules(ver: number): number {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const numAlign = Math.floor(ver / 7) + 2;
      result -= (25 * numAlign - 10) * numAlign - 55;
      if (ver >= 7) result -= 36;
    }
    return result;
  }

  private static dataCapacityBits(ver: number, ecl: Ecc): number {
    const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl][ver];
    const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecl][ver];
    const rawCodewords = Math.floor(QrCode.numRawDataModules(ver) / 8);
    return (rawCodewords - blockEccLen * numBlocks) * 8;
  }
}

function getBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

function utf8Bytes(str: string): number[] {
  const out: number[] = [];
  for (const ch of str) {
    let code = ch.codePointAt(0)!;
    if (code < 0x80) out.push(code);
    else if (code < 0x800) {
      out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      out.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }
  return out;
}
