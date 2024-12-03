import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string): string => {
    return rawInput;
};

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const all_matches = input.match(/mul\(\d+,\d+\)/g);
    let sum = 0;
    if (all_matches != null) {
        for (const m of all_matches) {
            const rm = /mul\((\d+),(\d+)\)/.exec(m);
            if (rm != null) {
                sum += parseInt(rm[1]) * parseInt(rm[2]);
            }
        }
    }
    return sum;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const all_matches = input.match(/(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g);
    let sum = 0;
    let enabled = true;
    if (all_matches != null) {
        for (const m of all_matches) {
            if (m == "do()") {
                enabled = true;
            } else if (m == "don't()") {
                enabled = false;
            } else {
                const rm = /mul\((\d+),(\d+)\)/.exec(m);
                if (rm != null) {
                    if (enabled) {
                        sum += parseInt(rm[1]) * parseInt(rm[2]);
                    }
                }
            }
        }
    }

    return sum;
};

run({
    part1: {
        tests: [
            {
                input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
`,
                expected: 161,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`,
                expected: 48,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
