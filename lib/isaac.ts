interface IsaacState {
    accumulator: number
    prevResult: number
    cursor: number
    memory: number[]
    results: number[]
}

export interface Isaac {
    results: () => number[]
    add(a: number, b: number): number
    reset: () => Isaac
    seed: (seed: number[]) => Isaac
    prng: (n?: number) => Isaac
    rand: () => number
    internals: () => IsaacState
}

export function isaac(): Isaac {
    const _memory: number[] = Array.from({ length: 256 })
    const _results: number[] = Array.from({ length: 256 })
    let _accumulator = 0
    let _prevResult = 0
    let _cursor = 0
    let _genCursor = 0

    return Object.assign({}, {
        results: () => _results,
        add(a: number, b: number): number {
            const lsb = (a & 0xffff) + (b & 0xffff)
            const msb = (a >>> 16) + (b >>> 16) + (lsb >>> 16)
            return (msb << 16) | (lsb & 0xffff)
        },
        reset(this: Isaac) {
            _accumulator = _prevResult = _cursor = 0
            for (let i = 0; i < 256; ++i) {
                _memory[i] = _results[i] = 0
            }
            _genCursor = 0
            return this
        },
        seed(this: Isaac, seed: number[]) {
            let a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number;

            a = b = c = d =
                e = f = g = h = 0x9e3779b9;

            this.reset();
            for (i = 0; i < seed.length; i++)
                _results[i & 0xff] += (typeof (seed[i]) === 'number') ? seed[i] : 0;

            const scramble = () => {
                a ^= b << 11; d = this.add(d, a); b = this.add(b, c);
                b ^= c >>> 2; e = this.add(e, b); c = this.add(c, d);
                c ^= d << 8; f = this.add(f, c); d = this.add(d, e);
                d ^= e >>> 16; g = this.add(g, d); e = this.add(e, f);
                e ^= f << 10; h = this.add(h, e); f = this.add(f, g);
                f ^= g >>> 4; a = this.add(a, f); g = this.add(g, h);
                g ^= h << 8; b = this.add(b, g); h = this.add(h, a);
                h ^= a >>> 9; c = this.add(c, h); a = this.add(a, b);
            };

            for (i = 0; i < 4; i++)
                scramble();

            for (i = 0; i < 256; i += 8) {
                if (seed) {
                    a = this.add(a, _results[i + 0]); b = this.add(b, _results[i + 1]);
                    c = this.add(c, _results[i + 2]); d = this.add(d, _results[i + 3]);
                    e = this.add(e, _results[i + 4]); f = this.add(f, _results[i + 5]);
                    g = this.add(g, _results[i + 6]); h = this.add(h, _results[i + 7]);
                }

                scramble();

                _memory[i + 0] = a; _memory[i + 1] = b; _memory[i + 2] = c; _memory[i + 3] = d;
                _memory[i + 4] = e; _memory[i + 5] = f; _memory[i + 6] = g; _memory[i + 7] = h;
            }
            if (seed) {

                for (i = 0; i < 256; i += 8) {
                    a = this.add(a, _memory[i + 0]); b = this.add(b, _memory[i + 1]);
                    c = this.add(c, _memory[i + 2]); d = this.add(d, _memory[i + 3]);
                    e = this.add(e, _memory[i + 4]); f = this.add(f, _memory[i + 5]);
                    g = this.add(g, _memory[i + 6]); h = this.add(h, _memory[i + 7]);
                    scramble();

                    _memory[i + 0] = a; _memory[i + 1] = b; _memory[i + 2] = c; _memory[i + 3] = d;
                    _memory[i + 4] = e; _memory[i + 5] = f; _memory[i + 6] = g; _memory[i + 7] = h;
                }

            }

            this.prng();
            _genCursor = 256;

            return this
        },
        prng(this: Isaac, n?: number) {
            let i, x, y;

            n = (n && typeof (n) === 'number')
                ? Math.abs(Math.floor(n)) : 1;

            while (n--) {
                _cursor = this.add(_cursor, 1);
                _prevResult = this.add(_prevResult, _cursor);

                for (i = 0; i < 256; i++) {
                    switch (i & 3) {
                        case 0: _accumulator ^= _accumulator << 13; break;
                        case 1: _accumulator ^= _accumulator >>> 6; break;
                        case 2: _accumulator ^= _accumulator << 2; break;
                        case 3: _accumulator ^= _accumulator >>> 16; break;
                    }
                    _accumulator = this.add(_memory[(i + 128) & 0xff], _accumulator); x = _memory[i];
                    _memory[i] = y = this.add(_memory[(x >>> 2) & 0xff], this.add(_accumulator, _prevResult));
                    _results[i] = _prevResult = this.add(_memory[(y >>> 10) & 0xff], x);
                }
            }
            return this
        },
        rand() {
            if (!_genCursor--) {
                this.prng(); _genCursor = 255;
            }
            return _results[_genCursor];
        },
        internals: (): IsaacState => ({
            accumulator: _accumulator,
            prevResult: _prevResult,
            cursor: _cursor,
            memory: _memory,
            results: _results,
        })
    })
}