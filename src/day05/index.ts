import run from "aocrunner";
import _ from "lodash";

interface Rule {
    before: number;
    after: number;
}

interface Data {
    rules: Rule[];
    updates: number[][];
}

const parseInput = (rawInput: string): Data => {
    const halves = rawInput.split("\n\n");
    const rules = halves[0].split("\n").map(ln => {
        const r = ln.split("|");
        const before = parseInt(r[0]);
        const after = parseInt(r[1]);
        return { before, after };
    });

    const updates = halves[1].split("\n").map(ln => ln.split(",").map(v => parseInt(v)));
    return { rules, updates };
};

const validate_update = (update: number[], rules: Rule[]): boolean => {
    for (const r of rules) {
        const before_idx = update.findIndex(v => v == r.before);
        const after_idx = update.findIndex(v => v == r.after);
        if (before_idx != -1 && after_idx != -1) {
            if (before_idx >= after_idx) return false;
        }
    }
    return true;
}

const fix_update = (orig_update: number[], rules: Rule[]): number[] => {
    let update = orig_update.slice();
    let was_updated = true;
    while (was_updated) {
        was_updated = false;
        for (const r of rules) {
            const before_idx = update.findIndex(v => v == r.before);
            const after_idx = update.findIndex(v => v == r.after);
            if (before_idx != -1 && after_idx != -1) {
                if (before_idx >= after_idx) {
                    // swap the two
                    const v = update[before_idx];
                    update[before_idx] = update[after_idx];
                    update[after_idx] = v;
                    was_updated = true;
                }
            }
        }
    }
    return update;
}


const middle = (update: number[]): number => {
    return update[(update.length - 1) / 2];
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    let sum = 0;
    for (const u of input.updates) {
        if (validate_update(u, input.rules)) {
            sum += middle(u);
        }
    }

    return sum;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    let sum = 0;
    for (const u of input.updates) {
        if (!validate_update(u, input.rules)) {
            const modified = fix_update(u, input.rules);
            sum += middle(modified);
        }
    }

    return sum;
};

run({
    part1: {
        tests: [
            {
                input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
                expected: 143,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
                expected: 123,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
