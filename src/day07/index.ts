import run from "aocrunner";
import _ from "lodash";

interface Equation {
    result: number;
    components: number[];
}

const parseInput = (rawInput: string): Equation[] => {
    return rawInput.split("\n").map(ln => {
        const [a, b] = ln.split(": ");
        const result = parseInt(a);
        const components = b.split(" ").map(v => parseInt(v));
        return { result, components };
    });
};

const is_result = (result: number, so_far: number, rest_components: number[]): boolean => {
    if (rest_components.length == 0) {
        return result == so_far;
    } else {
        const next = rest_components[0];
        const remainder = rest_components.slice(1);
        return is_result(result, so_far + next, remainder) || is_result(result, so_far * next, remainder);
    }
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    let total = 0;
    for (const eq of input) {
        if (is_result(eq.result, eq.components[0], eq.components.slice(1))) {
            total += eq.result;
        }
    }
    return total;
};

const is_result2 = (result: number, so_far: number, rest_components: number[]): boolean => {
    if (rest_components.length == 0) {
        return result == so_far;
    } else {
        const next = rest_components[0];
        const remainder = rest_components.slice(1);
        if (is_result2(result, so_far + next, remainder)) {
            return true;
        }
        if (is_result2(result, so_far * next, remainder)) {
            return true;
        }
        const concat = parseInt(so_far + "" + next);
        if (is_result2(result, concat, remainder)) {
            return true;
        }

        return false;
    }
}


const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    let total = 0;
    for (const eq of input) {
        if (is_result2(eq.result, eq.components[0], eq.components.slice(1))) {
            total += eq.result;
        }
    }
    return total;
};

run({
    part1: {
        tests: [
            {
                input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
                expected: 3749,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
                expected: 11387,
            },],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
