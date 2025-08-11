interface Sfc32StateParams {
  a: number;
  b: number;
  c: number;
  ctr: number;
}

class Sfc32State {
  a: number;
  b: number;
  c: number;
  ctr: number;

  constructor(params: Sfc32StateParams) {
    this.a = params.a >>> 0; // Force to 32-bit unsigned
    this.b = params.b >>> 0;
    this.c = params.c >>> 0;
    this.ctr = params.ctr >>> 0;
  }

  nextStream(stream: number): number {
    const result = (this.a + this.b + this.ctr) >>> 0;
    // Increment counter by stream value (matches C _SFC32_Next_Stream behavior)
    this.ctr = (this.ctr + stream) >>> 0;
    this.a = (this.b ^ (this.b >>> 9)) >>> 0;
    this.b = (this.c * 9) >>> 0;
    this.c = (result + ((this.c << 21) | (this.c >>> 11))) >>> 0;
    return result;
  }
}

const RANDOMIZER_STREAM: number = 17;

function randomizerRandSeed(
  reason: number,
  data1: number,
  data2: number,
  randomizerSeed: number // Changed from trainerId to match C
): Sfc32State {
  const state = new Sfc32State({
    a: (randomizerSeed + reason) >>> 0,
    b: (randomizerSeed ^ data2) >>> 0,
    c: data1 >>> 0,
    ctr: RANDOMIZER_STREAM,
  });

  // Warm up the generator
  for (let i = 0; i < 10; i++) {
    state.nextStream(RANDOMIZER_STREAM);
  }

  return state;
}

function randomizerNextRange(state: Sfc32State, range: number): number {
  if (range < 2) return 0;
  if (range === 0xffffffff) return state.nextStream(RANDOMIZER_STREAM);

  // Find next power of two
  let nextPowerOfTwo = range;
  nextPowerOfTwo--;
  nextPowerOfTwo |= nextPowerOfTwo >>> 1;
  nextPowerOfTwo |= nextPowerOfTwo >>> 2;
  nextPowerOfTwo |= nextPowerOfTwo >>> 4;
  nextPowerOfTwo |= nextPowerOfTwo >>> 8;
  nextPowerOfTwo |= nextPowerOfTwo >>> 16;
  nextPowerOfTwo++;

  const mask = nextPowerOfTwo - 1;

  // Rejection sampling
  let result: number;
  do {
    result = state.nextStream(RANDOMIZER_STREAM) & mask;
  } while (result >= range);

  return result;
}

export {
  Sfc32State,
  RANDOMIZER_STREAM,
  randomizerRandSeed,
  randomizerNextRange,
};
export const RANDOMIZER_REASON_WILD_ENCOUNTER = 0;
