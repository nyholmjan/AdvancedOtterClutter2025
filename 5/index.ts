import fs from 'node:fs'

const testInput = `3-5
10-14
12-18
10-20

1
5
8
11
17
32`

const input = fs.readFileSync('./5/input.txt', { encoding: 'utf-8'})

type Range = [number, number];

const parse = (input: string): [Range[], number[]] => {
    const [ranges, ingrediends] = input.split('\n\n').map(r => r.split('\n'))
    return [ranges!.map(range => range.split('-').map(Number) as Range), ingrediends!.map(Number)]
}

const solve1 = (input: string) => {
    console.time('5-1');

    const isInRange = (val: number, start: number, finish: number) => val >= start && val <= finish;
    let total = new Set();

    const [ranges, ingredients] = parse(input);
    ingredients.forEach(ing => {
        ranges.forEach(range => {
            if (isInRange(ing, range[0], range[1])) {
                total.add(ing);
            }
        })
    })

    console.timeEnd('5-1')
    console.log('5-1:', total.size)
}

const solve2 = (input: string) => {
    console.time('5-2')

    const sumRanges = (ranges: Range[]) => {
        let sum = 0;
        let prevMax = 0;
        ranges.sort((a,b) => a[0] - b[0]).forEach((range, i) => {
            const prev = ranges[i - 1]
            if (prev && range[0] <= prev[1]) {
                sum += Math.max(prevMax, range[1]) - Math.max(range[0], prevMax);
            } else if (range[1] >= prevMax) {
                sum += range[1] - Math.max(prevMax, range[0] - 1);
            }
            prevMax = Math.max(prevMax, range[1]);
        })
        return sum;
    }

    const [ranges] = parse(input);
    const result = sumRanges(ranges)

    console.timeEnd('5-2')
    console.log('5-2:', result)
}

solve1(input)

solve2(input)
