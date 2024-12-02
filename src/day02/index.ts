import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string): number[][] => {
    const lines = rawInput.split("\n");
    const input = lines.map(ln => {
        return ln.split(" ").map(v => parseInt(v))
    });
    return input;
};

const is_safe = (ns: number[]): boolean => {
    const dir = ns[ns.length - 1] - ns[0];
    for (let i = 1; i < ns.length; i++) {
        const diff = ns[i] - ns[i - 1];
        if (Math.abs(diff) > 3 || Math.abs(diff) < 1) return false;
        if (Math.sign(diff) != Math.sign(dir)) return false;
    }
    return true;
}


const remove_one_is_safe = (ns: number[]): boolean => {
    if (is_safe(ns)) return true;
    for (let pos = 0; pos < ns.length; ++pos) {
        const patched = ns.slice();
        patched.splice(pos, 1);
        if (is_safe(patched)) return true;
    }
    return false;
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);

    return _.sum(input.map(is_safe));
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);

    return _.sum(input.map(remove_one_is_safe));
};

run({
    part1: {
        tests: [
            {
                input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
                expected: 2,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
                expected: 4,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
