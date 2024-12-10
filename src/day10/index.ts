import run from "aocrunner";
import _ from "lodash";
const key = (y: number, x: number): string => y + "," + x;

interface Data {
    n_y: number;
    n_x: number;
    m: Map<string, number>;
}

const parseInput = (rawInput: string): Data => {
    const lines = rawInput.split("\n");
    const n_y = lines.length;
    const n_x = lines[0].length;
    let m = new Map<string, number>();
    lines.map((ln, y) => ln.split("").map((c, x) => {
        const v = parseInt(c);
        m.set(key(y, x), v);
    }
    ));
    return { m, n_y, n_x }
};

const score_trailhead_step = (y: number, x: number, prev_h: number, d: Data, s: Set<string>): void => {
    const h = d.m.get(key(y, x));

    // cutoff cases
    if (h === undefined) return;
    if (h != prev_h + 1) return;

    // final case
    if (h == 9) {
        s.add(key(y, x));
    }

    // recursion case
    score_trailhead_step(y, x - 1, h, d, s);
    score_trailhead_step(y - 1, x, h, d, s);
    score_trailhead_step(y, x + 1, h, d, s);
    score_trailhead_step(y + 1, x, h, d, s);

}


const score_trailhead = (y: number, x: number, d: Data): number => {
    const s = new Set<string>();
    score_trailhead_step(y, x, -1, d, s);
    return s.size
}

const part1 = (rawInput: string) => {
    const d = parseInput(rawInput);
    let sum = 0;
    for (let y = 0; y < d.n_y; ++y) {
        for (let x = 0; x < d.n_x; ++x) {
            if (d.m.get(key(y, x)) == 0) {
                const v = score_trailhead(y, x, d);
                if (v != 0) {
                    //console.log(y, x, v);
                }
                sum += v;
            }
        }
    }

    return sum;
};

const n_distinct_step = (y: number, x: number, prev_h: number, d: Data): number => {
    const h = d.m.get(key(y, x));

    // cutoff cases
    if (h === undefined) return 0;
    if (h != prev_h + 1) return 0;

    // final case
    if (h == 9) return 1;

    // recursion case
    return (
        n_distinct_step(y, x - 1, h, d) +
        n_distinct_step(y - 1, x, h, d) +
        n_distinct_step(y, x + 1, h, d) +
        n_distinct_step(y + 1, x, h, d));

}


const n_distinct = (y: number, x: number, d: Data): number => {
    return n_distinct_step(y, x, -1, d);
}

const part2 = (rawInput: string) => {
    const d = parseInput(rawInput);
    let sum = 0;
    for (let y = 0; y < d.n_y; ++y) {
        for (let x = 0; x < d.n_x; ++x) {
            if (d.m.get(key(y, x)) == 0) {
                const v = n_distinct(y, x, d);
                if (v != 0) {
                    //console.log(y, x, v);
                }
                sum += v;
            }
        }
    }

    return sum;
};

run({
    part1: {
        tests: [
            {
                input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`,
                expected: 36,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`,
                expected: 81,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
