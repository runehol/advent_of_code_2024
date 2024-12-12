import run from "aocrunner";
import _ from "lodash";

const key = (y: number, x: number): string => y + "," + x;


interface Data {
    n_y: number;
    n_x: number;
    m: Map<string, string>;
}

const parseInput = (rawInput: string): Data => {
    const lines = rawInput.split("\n");
    const n_y = lines.length;
    const n_x = lines[0].length;
    let m = new Map<string, string>();
    lines.map((ln, y) => ln.split("").map((c, x) => {
        m.set(key(y, x), c);
    }
    ));
    return { m, n_y, n_x }
};

interface Region {
    area: number;
    perimeter: number;
    corners: number;
};

const add_region = (a: Region, b: Region): Region => {
    return { area: a.area + b.area, perimeter: a.perimeter + b.perimeter, corners: a.corners + b.corners }
}

const count_corners = (y: number, x: number, color: string, map: Map<string, string>): number => {
    // AA AB AC
    // BA ** BC
    // CA CB CC

    const aa = map.get(key(y - 1, x - 1)) == color;
    const ab = map.get(key(y - 1, x + 0)) == color;
    const ac = map.get(key(y - 1, x + 1)) == color;

    const ba = map.get(key(y + 0, x - 1)) == color;
    const bc = map.get(key(y + 0, x + 1)) == color;

    const ca = map.get(key(y + 1, x - 1)) == color;
    const cb = map.get(key(y + 1, x + 0)) == color;
    const cc = map.get(key(y + 1, x + 1)) == color;

    let n_corners = 0;
    if (!ba && (aa || !ab)) ++n_corners;
    if (!ab && (ac || !bc)) ++n_corners;
    if (!bc && (cc || !cb)) ++n_corners;
    if (!cb && (ca || !ba)) ++n_corners;
    return n_corners;
}

const count_region = (y: number, x: number, color: string, map: Map<string, string>, visited: Set<string>): Region => {
    const k = key(y, x);
    const c = map.get(k) ?? "";
    if (c != color) {
        return { area: 0, perimeter: 1, corners: 0 }
    }
    if (visited.has(k)) return { area: 0, perimeter: 0, corners: 0 }

    const corners = count_corners(y, x, color, map);
    let r: Region = { area: 1, perimeter: 0, corners };
    visited.add(k);

    r = add_region(r, count_region(y, x - 1, color, map, visited));
    r = add_region(r, count_region(y - 1, x, color, map, visited));
    r = add_region(r, count_region(y, x + 1, color, map, visited));
    r = add_region(r, count_region(y + 1, x, color, map, visited));

    return r;
}


const count_price = (d: Data, price_model: "PART1" | "PART2"): number => {
    let master_visited = new Set<string>();
    let price = 0;
    for (let y = 0; y < d.n_y; ++y) {
        for (let x = 0; x < d.n_x; ++x) {
            const k = key(y, x);
            if (!master_visited.has(k)) {
                let visited = new Set<string>();
                const r = count_region(y, x, d.m.get(k) || "?", d.m, visited);
                switch (price_model) {
                    case "PART1":
                        price += r.area * r.perimeter;
                        break;
                    case "PART2":
                        price += r.area * r.corners;
                        break;
                }
                visited.forEach(master_visited.add, master_visited);
            }

        }
    }
    return price;
}


const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);

    return count_price(input, "PART1");
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);

    return count_price(input, "PART2");
};

run({
    part1: {
        tests: [
            {
                input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
                expected: 1930,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
                expected: 1206,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
