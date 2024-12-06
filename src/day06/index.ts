import run from "aocrunner";
import _ from "lodash";

const key = (y: number, x: number): string => y + "," + x;

interface Data {
    n_y: number;
    n_x: number;
    start_y: number;
    start_x: number;
    m: Map<string, string>;
}

const parseInput = (rawInput: string): Data => {
    const lines = rawInput.split("\n");
    const n_y = lines.length;
    const n_x = lines[0].length;
    let start_y = -1;
    let start_x = -1;
    let m = new Map<string, string>();
    lines.map((ln, y) => ln.split("").map((c, x) => {
        if (c == '^') {
            start_y = y;
            start_x = x;
        }
        m.set(key(y, x), c);
    }
    ));
    return { m, n_y, n_x, start_y, start_x }
};

const traverse = (input: Data): number | undefined => {
    let d_x = 0;
    let d_y = -1;
    let x = input.start_x;
    let y = input.start_y;
    let visited_positions = new Set<string>;
    let n_steps = 0;
    visited_positions.add(key(y, x));
    while (true) {
        const trial_x = x + d_x;
        const trial_y = y + d_y;
        const c = input.m.get(key(trial_y, trial_x));
        if (c === undefined) {
            break;
        } else if (c === '#') {
            //rotate 90 degrees to the right
            const nd_x = -d_y;
            const nd_y = d_x;
            d_x = nd_x;
            d_y = nd_y;
        } else {
            x = trial_x;
            y = trial_y;
            visited_positions.add(key(y, x));
            ++n_steps;
        }
        if (n_steps > 10000) return undefined;
    }
    return visited_positions.size;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    return traverse(input);
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    let n_loops = 0;
    for (let y = 0; y < input.n_y; ++y) {
        for (let x = 0; x < input.n_x; ++x) {
            const k = key(y, x);
            if (input.m.get(k) == '.') {
                const m = new Map(input.m);
                m.set(k, '#'); // place an obstacle here
                const input2: Data = { m, start_y: input.start_y, start_x: input.start_x, n_y: input.n_y, n_x: input.n_x }
                if (traverse(input2) === undefined) {
                    ++n_loops;
                }
            }
        }
    }
    return n_loops;
};

run({
    part1: {
        tests: [
            {
                input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
                expected: 41
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
                expected: 6
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
