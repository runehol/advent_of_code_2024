import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => {
    const lines = rawInput.split("\n");
    const first = lines.map(ln => parseInt(ln.split(/(\s+)/)[0]));
    const second = lines.map(ln => parseInt(ln.split(/(\s+)/)[2]));
    return [first, second];
};

const part1 = (rawInput: string) => {
    const [first, second] = parseInput(rawInput);
    first.sort();
    second.sort();
    const pairsums = _.zip(first, second).map(v => Math.abs((v[0] || 0) - (v[1] || 0)));
    return _.sum(pairsums);
};

const part2 = (rawInput: string) => {
    const [left, right] = parseInput(rawInput);
    const freq = new Map<number, number>();
    for (const el of right) {
        freq.set(el, (freq.get(el) || 0) + 1);
    }

    let score = 0;
    for (const el of left) {
        score += el * (freq.get(el) || 0);
    }

    return score;
};

run({
    part1: {
        tests: [
            {
                input: `3   4
4   3
2   5
1   3
3   9
3   3`,
                expected: 11,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `3   4
4   3
2   5
1   3
3   9
3   3`,
                expected: 31,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
