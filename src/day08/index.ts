import run from "aocrunner";
import _ from "lodash";

interface Vec {
    x: number;
    y: number;
}
const key = (v: Vec): string => v.y + "," + v.x;


interface Data {
    size: Vec;
    m: Map<string, string>;
    frequencies: Map<string, Vec[]>;
}

const parseInput = (rawInput: string): Data => {
    const lines = rawInput.split("\n");
    const n_y = lines.length;
    const n_x = lines[0].length;
    let m = new Map<string, string>();
    let frequencies = new Map<string, Vec[]>();
    lines.map((ln, y) => ln.split("").map((c, x) => {
        const v = { x, y }
        m.set(key(v), c);
        if (c != '.') {
            const arr = frequencies.get(c) ?? [];
            arr.push(v);
            frequencies.set(c, arr);
        }
    }
    ));
    return { m, frequencies, size: { y: n_y, x: n_x } }
};

const antipole = (a: Vec, b: Vec, step: number): Vec => {
    const y = b.y + step * (b.y - a.y);
    const x = b.x + step * (b.x - a.x);
    return { y, x };
}

const print_map_with_antipoles = (d: Data, antipole_locations: Set<string>) => {
    for (let y = 0; y < d.size.y; ++y) {
        let s = "";
        for (let x = 0; x < d.size.x; ++x) {
            let v = { y, x };
            let c = d.m.get(key(v));
            if (antipole_locations.has(key(v))) {
                c = "#";
            }


            s += c;

        }
        console.log(s);
    }
}

const count_antipoles = (input: Data, min: number, max: number): number => {
    let antipole_locations = new Set<string>();
    input.frequencies.forEach((positions, freq) => {
        for (let i = 0; i < positions.length; ++i) {
            const p1 = positions[i];
            for (let j = 0; j < positions.length; ++j) {
                if (i == j) continue;
                const p2 = positions[j];
                for (let step = min; step <= max; ++step) {
                    const ap = antipole(p1, p2, step);
                    const c = input.m.get(key(ap));
                    if (c === undefined) break;
                    antipole_locations.add(key(ap));
                }
            }
        }
    });
    //print_map_with_antipoles(input, antipole_locations);
    return antipole_locations.size;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    return count_antipoles(input, 1, 1);
};


const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    return count_antipoles(input, 0, 100000);
};

run({
    part1: {
        tests: [
            {
                input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
                expected: 14,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
                expected: 34,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
