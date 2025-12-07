import fs from 'node:fs'

const testInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`

const input = fs.readFileSync('./7/input.txt', { encoding: 'utf-8'})

const parse = (input: string) => {
    return input.split('\n').map(r => r.split(""));
}

const solve1 = (input: string) => {
    console.time('7-1');

    const rows = parse(input);
    let splits = 0;
    rows.forEach((row, rowIndex) => {
        row.forEach((char, charIndex) => {
            if (char === 'S') {
                rows[rowIndex + 1]![charIndex] = '|';
            } else if (char === '|') {
                const charBelow = rows[rowIndex + 1]?.[charIndex];
                if (charBelow === '^') {
                    const nextLeft = rows[rowIndex + 2]![charIndex - 1]
                    const nextRight = rows[rowIndex + 2]![charIndex + 1]
                    if (nextLeft && nextLeft !== '^') {
                        rows[rowIndex + 1]![charIndex - 1] = '|';
                    }
                    if (nextRight && nextRight !== '^') {
                        rows[rowIndex + 1]![charIndex + 1] = '|';
                    }
                    splits++
                } else if (charBelow === '.') {
                    rows[rowIndex + 1]![charIndex] = '|';
                }
            }
        })
    })
    console.timeEnd('7-1')
    console.log('7-1:', splits)
}

const solve2 = (input: string) => {
    console.time('7-2')
    
    const rows = parse(input) as any[][];

    rows.forEach((row, rowIndex) => {
        row.forEach((char, charIndex) => {
            if (char === 'S') {
                rows[rowIndex + 1]![charIndex] = 1;
            } else if (typeof char === 'number' && rows[rowIndex + 1]) {
                const charBelow = rows[rowIndex + 1]?.[charIndex];
                if (charBelow === '^') {
                    if (typeof rows[rowIndex + 1]![charIndex - 1] === 'number') {
                        rows[rowIndex + 1]![charIndex - 1] += char
                    } else {
                        rows[rowIndex + 1]![charIndex - 1] = char
                    }
                    if (typeof rows[rowIndex + 1]![charIndex + 1] === 'number') {
                        rows[rowIndex + 1]![charIndex + 1] += char
                    } else {
                        rows[rowIndex + 1]![charIndex + 1] = char
                    }
                } else if (charBelow === '.') {
                    rows[rowIndex + 1]![charIndex] = char;
                } else {
                    rows[rowIndex + 1]![charIndex] += char;
                }
            }
        })
    })

    const result = rows.at(-1)?.reduce((a, b) => typeof b === 'number' ? a + b : a + 0, 0)

    console.timeEnd('7-2')
    console.log('7-2:', result)
}

solve1(input)

solve2(input)
