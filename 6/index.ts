import fs from 'node:fs'

const testInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `

const input = fs.readFileSync('./6/input.txt', { encoding: 'utf-8'})

const transpose = (valueSets: number[][] | string[]) => {
    const length = Math.max(...valueSets.map(s => s.length))
    const res = new Array(length);
    for (let i = 0; i < valueSets.length; i++) {
        for (let j = 0; j < length; j++) {
            if (res[j] === undefined) res[j] = []
            res[j][i] = valueSets[i]![j]
        }
    }
    return res;
}

const toCeph = (val: string[][]) => {
    const res: number[][] = [[]];
    let i = 0;
    val.forEach((v) => {
        if (v.join("").trim() === '') {
            res.push([])
            i++
        } else {
            res[i]!.push(Number(v.join("").trim()))
        }
    })
    return res;
}

const parse = (input: string) => {
    const rows = input.split('\n');
    const operations = rows.pop()?.replaceAll(" ", "").split("") || [];
    const values = rows.map(r => r.split(" ").filter(v => v.trim() !== '').map(Number)) || [];

    const transposedRaw = transpose(rows)
    const cephalopodValues = toCeph(transposedRaw)

    return { operations, values, cephalopodValues };
}

const solve1 = (input: string) => {
    console.time('6-1');

    const { operations, values} = parse(input);

    const opRes = operations.map((op, col) => {
        let res = values[0]![col]!;
        for (let row = 1; row < values.length; row++) {
            res = op === '*' ? res * values[row]![col]! : res + values[row]![col]!
        }
        return res;
    })

    const result = opRes.reduce((a,b) => a+b)

    console.timeEnd('6-1')
    console.log('6-1:', result)
}

const solve2 = (input: string) => {
    console.time('6-2')

    const { operations, cephalopodValues } = parse(input);

    const result = operations.reduce((prev, curOp, opIndex) =>
        prev + cephalopodValues[opIndex]!.reduce((prev, cur) =>
                curOp === '*' ? prev * cur : prev + cur
            )
        , 0)

    console.timeEnd('6-2')
    console.log('6-2:', result)
}

solve1(input)

solve2(input)
