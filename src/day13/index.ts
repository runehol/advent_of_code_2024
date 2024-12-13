import run from "aocrunner";
import _ from "lodash";

interface Vec {
    x: number;
    y: number;
}

interface Game {
    a: Vec;
    b: Vec;
    prize: Vec;
}

const parseInput = (rawInput: string): Game[] => {
    return rawInput.split("\n\n").map(v => {
        const vs = v.split("\n").map(ln => {
            const v = ln.match(/(\d+).*?(\d+)/);
            if (v !== null) {
                return {
                    x: parseInt(v[1]), y: parseInt(v[2])
                }
            }
            throw "could not parse" + ln

        })
        return { a: vs[0], b: vs[1], prize: vs[2] }

    });
};

const solve_game = (g: Game): number | undefined => {
    let best: number | undefined = undefined;

    const b = Math.floor((g.a.y * g.prize.x - g.a.x * g.prize.y) / (g.a.y * g.b.x - g.a.x * g.b.y));
    const a = Math.floor((g.prize.x - g.b.x * b) / g.a.x);

    if (g.a.x * a + g.b.x * b == g.prize.x) {
        if (g.a.y * a + g.b.y * b == g.prize.y) {
            const cost = 3 * a + 1 * b;
            return cost;
        }
    }
    return undefined;
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    let sum = 0;
    for (const g of input) {
        const cost = solve_game(g);
        if (cost !== undefined) {
            sum += cost;
        }
    }
    return sum;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    let sum = 0;
    let offset = 10000000000000;
    for (let g of input) {
        g.prize.x += offset;
        g.prize.y += offset;
        const cost = solve_game(g);
        if (cost !== undefined) {
            sum += cost;
        }
    }
    return sum;
};

run({
    part1: {
        tests: [
            {
                input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
                expected: 480,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
                expected: 875318608908,
            },],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
