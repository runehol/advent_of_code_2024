import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string): number[] => {
    return rawInput.split(" ").map(v => +v);
};





const cache = new Map<string, number>();
const count_n_steps = (s: number, steps_left: number): number => {

    const fn = (s: number, steps_left: number): number => {
        if (steps_left == 0) return 1;
        if (s == 0) {
            return count_n_steps(1, steps_left - 1);
        } else {
            const ss = "" + s;

            if (ss.length % 2 == 0) {
                const a = parseInt(ss.substring(0, ss.length / 2), 10);
                const b = parseInt(ss.substring(ss.length / 2, ss.length), 10);
                return count_n_steps(a, steps_left - 1) + count_n_steps(b, steps_left - 1);
            } else {
                return count_n_steps(s * 2024, steps_left - 1);
            }
        }
    }
    const k = s + " " + steps_left;
    const cv = cache.get(k);
    if (cv !== undefined) return cv;
    const v = fn(s, steps_left);
    cache.set(k, v);
    return v;

}

const step_n = (stones: number[], n: number): number => {
    let sum = 0;
    for (const s of stones) {
        sum += count_n_steps(s, n);
    }
    return sum;

}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const s = step_n(input, 25);
    return s;
};



const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const s = step_n(input, 75);
    return s;
};

run({
    part1: {
        tests: [
            {
                input: `125 17`,
                expected: 55312,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            /* {
                input: ``,
                expected: "",
            }, */
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
