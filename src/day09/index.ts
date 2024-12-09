import run from "aocrunner";
import _ from "lodash";

interface Block {
    id: number;
    start: number;
    len: number;
}

const parseInput = (rawInput: string): Block[] => {
    const seq = rawInput.split("").map(v => parseInt(v));
    let blocks: Block[] = [];
    let pos = 0;
    let id = 0;
    for (let i = 0; i < seq.length; ++i) {
        const c = seq[i];
        if (i % 2 == 0) {
            blocks.push({ id, start: pos, len: c })
            ++id;
        }
        pos += c;
    }
    return blocks;
};

const checksum = (blocks: Block[]): number => {
    let sum = 0;
    for (const b of blocks) {
        const sum_of_sequence = b.len / 2 * (2 * b.start + (b.len - 1));

        sum += b.id * sum_of_sequence;
    }
    return sum;
}

const compact = (_blocks: Block[]): Block[] => {
    let working_blocks = _blocks.slice();

    let result: Block[] = [];
    let pos = 0;
    while (working_blocks.length > 0) {
        const first = working_blocks[0];
        const gap = first.start - pos;
        if (gap == 0) {
            result.push(first);
            pos += first.len;
            working_blocks.shift();
        } else {
            const last = working_blocks[working_blocks.length - 1];
            const n_to_copy = Math.min(gap, last.len);
            if (n_to_copy <= 0) throw "nothing to copy";
            result.push({ id: last.id, start: pos, len: n_to_copy });

            pos += n_to_copy;

            working_blocks.pop();
            const n_left = last.len - n_to_copy;
            if (n_left > 0) {
                working_blocks.push({ id: last.id, start: last.start, len: n_left })
            }
        }
    }


    return result;
}

const maybe_move_id = (blocks: Block[], id: number): void => {
    for (let fidx = blocks.length - 1; fidx >= 0; --fidx) {
        const b = blocks[fidx];
        if (b.id == id) {
            for (let tidx = 0; tidx < fidx; ++tidx) {
                const p = (blocks[tidx].start + blocks[tidx].len)
                const gap = blocks[tidx + 1].start - p
                if (gap >= b.len) {
                    //one, cut out the old block from fidx
                    blocks.splice(fidx, 1);

                    //new block
                    const b2: Block = { id: b.id, start: p, len: b.len }

                    // and insert it into the gap
                    blocks.splice(tidx + 1, 0, b2);
                    return;
                }
            }
            return;
        }
    }
}

const compact_whole_files = (_blocks: Block[]): Block[] => {
    let result = _blocks.slice();

    const max_id = _.max(result.map(b => b.id)) ?? -1;
    for (let id = max_id; id >= 0; --id) {
        maybe_move_id(result, id);
    }
    return result;
}

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const compacted = compact(input);
    return checksum(compacted);
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const compacted = compact_whole_files(input);
    return checksum(compacted);
};

run({
    part1: {
        tests: [
            {
                input: `2333133121414131402`,
                expected: 1928,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `2333133121414131402`,
                expected: 2858,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
