import run from "aocrunner";
import _ from "lodash";

interface Vec {
    x: number;
    y: number;
}

const key = (v: Vec): string => v.y + "," + v.x;



interface Data {
    n_y: number;
    n_x: number;
    start: Vec;
    m: Map<string, string>;
    commands: string
}

const print_map = (d: Data): void => {
    for (let y = 0; y < d.n_y; ++y) {
        let s = "";
        for (let x = 0; x < d.n_x; ++x) {
            s += d.m.get(key({ y, x })) ?? "";
        }
        console.log(s);
    }
}

const parseInput = (rawInput: string): Data => {
    const [map, cmds] = rawInput.split("\n\n")
    const lines = map.split("\n");
    const n_y = lines.length;
    const n_x = lines[0].length;
    let start = { x: -1, y: -1 };
    let m = new Map<string, string>();
    lines.map((ln, y) => ln.split("").map((c, x) => {
        let p = { x, y }
        m.set(key(p), c);
        if (c == "@") {
            start = p;
        }
    }
    ));
    let commands = cmds.replace(/\n/g, "")
    return { m, n_y, n_x, start, commands }
};

const double_map = (d: Data): Data => {
    let m = new Map<string, string>();
    for (let y = 0; y < d.n_y; ++y) {
        for (let x = 0; x < d.n_x; ++x) {
            const c = d.m.get(key({ y, x })) ?? ".";
            let cc = "..";
            if (c === "#") {
                cc = "##";
            } else if (c === "O") {
                cc = "[]";
            } else if (c === ".") {
                cc = "..";
            } else if (c === "@") {
                cc = "@.";
            }
            m.set(key({ y, x: x * 2 + 0 }), cc[0])
            m.set(key({ y, x: x * 2 + 1 }), cc[1])
        }
    }
    return { m, n_y: d.n_y, n_x: d.n_x * 2, start: { y: d.start.y, x: d.start.x * 2 }, commands: d.commands }
}


const add = (a: Vec, b: Vec): Vec => { return { x: a.x + b.x, y: a.y + b.y } }


const try_move = (pos: Vec, dir: Vec, m: Map<string, string>, commit: boolean, shifted_box: boolean): boolean => {
    const next = add(pos, dir);
    const next_contents = m.get(key(next))
    const curr_contents = m.get(key(pos)) ?? "";
    if (next_contents === "#") {
        // wall
        return false;
    } else if (next_contents !== ".") {
        if (!try_move(next, dir, m, commit, false)) {
            return false;
        }
    }
    if (commit) {
        m.set(key(next), curr_contents);
        m.set(key(pos), ".");
    }

    if (dir.y != 0 && !shifted_box) {
        if (curr_contents === "[") {
            return try_move({ y: pos.y, x: pos.x + 1 }, dir, m, commit, true);
        } else if (curr_contents === "]") {
            return try_move({ y: pos.y, x: pos.x - 1 }, dir, m, commit, true);
        }
    }
    return true;
}


const score_map = (d: Data): number => {
    let sum = 0;
    for (let y = 0; y < d.n_y; ++y) {
        let s = "";
        for (let x = 0; x < d.n_x; ++x) {
            const c = d.m.get(key({ y, x }))
            if (c === "O" || c === "[") {
                sum += y * 100 + x;
            }
        }
    }
    return sum;
}
const execute_commands = (d: Data): number => {
    let pos = d.start;
    let directions = new Map<string, Vec>();
    directions.set("<", { y: 0, x: -1 })
    directions.set("^", { y: -1, x: 0 })
    directions.set(">", { y: 0, x: +1 })
    directions.set("v", { y: +1, x: 0 })

    for (const c of d.commands.split("")) {
        let dir = directions.get(c);

        if (dir !== undefined) {
            if (try_move(pos, dir, d.m, false, false)) {
                try_move(pos, dir, d.m, true, false);
                pos = add(pos, dir);
            }
        }
    }
    return score_map(d);
}



const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const res = execute_commands(input);
    return res;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const doubled = double_map(input);
    const res = execute_commands(doubled);
    return res;
};

run({
    part1: {
        tests: [
            {
                input: `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
                expected: 2028,
            },
            {
                input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
                expected: 10092
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
                expected: 9021
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
