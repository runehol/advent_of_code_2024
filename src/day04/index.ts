import run from "aocrunner";
import _ from "lodash";

const key = (y: number, x: number): string => y + "," + x;

interface Data {
    n_y: number;
    n_x: number;
    m: Map<string, string>;
}

const parseInput = (rawInput: string): Data => {
    const lines = rawInput.split("\n");
    const n_y = lines.length;
    const n_x = lines[0].length;
    let m = new Map<string, string>();
    lines.map((ln, y) => ln.split("").map((c, x) => m.set(key(y, x), c)));
    return { m, n_y, n_x }
};

const extract = (o_y: number, o_x: number, d_y: number, d_x: number, n: number, d: Data) => {
    let result = "";
    for (let i = 0; i < n; ++i) {
        const y = o_y + i * d_y;
        const x = o_x + i * d_x;
        const c = d.m.get(key(y, x)) ?? "";
        result += c;
    }
    return result;
}

const count_string = (y: number, x: number, s: string, d: Data): number => {
    let count = 0;
    let len = s.length;
    if (extract(y, x, 0, -1, len, d) == s) ++count;
    if (extract(y, x, 1, -1, len, d) == s) ++count;
    if (extract(y, x, 1, 0, len, d) == s) ++count;
    if (extract(y, x, 1, 1, len, d) == s) ++count;
    if (extract(y, x, 0, 1, len, d) == s) ++count;
    if (extract(y, x, -1, 1, len, d) == s) ++count;
    if (extract(y, x, -1, 0, len, d) == s) ++count;
    if (extract(y, x, -1, -1, len, d) == s) ++count;
    return count;
}

const part1 = (rawInput: string) => {
    const d = parseInput(rawInput);
    let count = 0;
    for (let y = 0; y < d.n_y; ++y) {
        for (let x = 0; x < d.n_x; ++x) {
            count += count_string(y, x, "XMAS", d);
        }
    }
    return count;
};

const count_mas = (y: number, x: number, d: Data): number => {
    let len = 3;
    let count = 0;
    const a = extract(y, x, 1, 1, 3, d);
    const b = extract(y + len - 1, x, -1, 1, len, d);
    if (a == "MAS" || a == "SAM") {
        if (b == "MAS" || b == "SAM") {
            count = 1;
        }
    }
    return count;
}


const part2 = (rawInput: string) => {
    const d = parseInput(rawInput);
    let count = 0;
    for (let y = 0; y < d.n_y; ++y) {
        for (let x = 0; x < d.n_x; ++x) {
            count += count_mas(y, x, d);
        }
    }
    return count;
};

run({
    part1: {
        tests: [
            {
                input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
                expected: 18,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
                expected: 9,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
