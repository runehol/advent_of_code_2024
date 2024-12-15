import run from "aocrunner";
import _ from "lodash";

interface Vec {
    x: number;
    y: number;
}

interface Robot {
    pos: Vec;
    vel: Vec;
}

const parseInput = (rawInput: string): Robot[] => {
    return rawInput.split("\n").map(ln => {
        const p = ln.split(" ").map(v => v.split("=")[1].split(",").map(n => parseInt(n)))
        const pos = { x: p[0][0], y: p[0][1] }
        const vel = { x: p[1][0], y: p[1][1] }
        return { pos, vel }
    });
};

const floormod = (a: number, b: number): number => {
    a = a % b;
    if (a < 0) a += b;
    return a;
}

const quadrant_score = (robots: Robot[], n_x: number, n_y: number, time: number): number => {
    let quadrants = [0, 0, 0, 0];

    const hx = Math.floor(n_x / 2);
    const hy = Math.floor(n_y / 2);
    for (const r of robots) {
        const x = floormod(r.pos.x + r.vel.x * time, n_x);
        const y = floormod(r.pos.y + r.vel.y * time, n_y);
        if (x > hx) {
            if (y > hy) {
                quadrants[3] += 1;
            } else if (y < hy) {
                quadrants[1] += 1;
            }
        }

        if (x < hx) {
            if (y > hy) {
                quadrants[2] += 1;
            } else if (y < hy) {
                quadrants[0] += 1;
            }
        }

    }
    return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
}


const is_unique = (robots: Robot[], n_x: number, n_y: number, time: number): boolean => {
    let s = new Set<string>();

    for (const r of robots) {
        const x = floormod(r.pos.x + r.vel.x * time, n_x);
        const y = floormod(r.pos.y + r.vel.y * time, n_y);

        const k = x + " " + y;
        if (s.has(k)) return false;
        s.add(k);

    }
    return true;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    return quadrant_score(input, 101, 103, 100);
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    for (let t = 0; t < 1000000; ++t) {
        if (is_unique(input, 101, 103, t)) {
            return t;
        }
    }
    return -1;
};

run({
    part1: {
        tests: [
        ],
        solution: part1,
    },
    part2: {
        tests: [
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
