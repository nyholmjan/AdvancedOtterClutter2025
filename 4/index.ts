import fs from 'node:fs'

const testInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`

const input = fs.readFileSync('./4/input.txt', { encoding: 'utf-8'})

const parse = (input: string) => {
    return input.split('\n').map(r => r.split(''))
}

const test = (i: number, j: number, rows: string[][]) => {
    let res = 0;
    if (rows[i - 1]?.[j - 1] === "@") res += 1
    if (rows[i - 1]?.[j] === "@") res += 1
    if (rows[i - 1]?.[j + 1] === "@") res += 1
    if (rows[i]?.[j - 1] === "@") res += 1
    if (rows[i]?.[j + 1] === "@") res += 1
    if (rows[i + 1]?.[j - 1] === "@") res += 1
    if (rows[i + 1]?.[j] === "@") res += 1
    if (rows[i + 1]?.[j + 1] === "@") res += 1
    return res < 4
}

const solve1 = (input: string) => {
    console.time('4-1');

    const rows = parse(input);
    let total = 0;

    rows.forEach((row, i) => {
        row.forEach((c, j) => {
            if (c === '@') {
                if (test(i, j, rows)) total += 1;
            }
        })
    })

    console.timeEnd('4-1')
    console.log('4-1:', total)
}



const solve2 = (input: string) => {
    console.time('4-2')

    const rows = parse(input);
    let total = 0;
    let removed = Infinity;

    while (removed !== 0) {
        removed = 0
        rows.forEach((row, i) => {
            row.forEach((c, j) => {
                if (c === '@') {
                    if (test(i, j, rows)) {
                        total += 1;
                        removed += 1;
                        rows[i]![j] = '.'
                    }
                }
            })
        })
    }

    console.timeEnd('4-2')
    console.log('4-2:', total)
}

solve1(input)

solve2(input)