import fs from 'node:fs'

const testInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`

const input = fs.readFileSync('./2/input.txt', { encoding: 'utf-8'})

const parse = (input: string): number[][] => {
    return input.split(',').map(range => {
        return range.split('-').map(Number)
    })
}

const isValid = (val: number) => {
    const string = String(val);
    if (string.length % 2) return true
    const middle = string.length / 2;
    return string.indexOf(string.substring(0, middle), middle) !== middle;
}

const solve1 = (input: string) => {
    console.time('2-1')
    const ranges = parse(input);
    let result = 0;

    ranges.forEach(range => {
        for (let i = range[0]!; i < range[1]! + 1; i++) {
            result += isValid(i) ? 0 : i;
        }
    })
    console.timeEnd('2-1')
    console.log('2-1:', result)
}

const isValid2 = (val: number) => {
    const string = String(val);
    let invalid = false
    outer: for (let i = 1; i < Math.floor(string.length / 2 + 1) && !invalid; i++) {
        const part = string.substring(0, i);

        for (let j = i; j < string.length; j += i) {
            if (string.indexOf(part, j) !== j) continue outer
        }

        invalid = true
        break;
    }
    return !invalid
}

const solve2 = (input: string) => {
    console.time('2-2')
    const ranges = parse(input);
    let result = 0;

    ranges.forEach(range => {
        for (let i = range[0]!; i < range[1]! + 1; i++) {
            result += isValid2(i) ? 0 : i;
        }
    })
    console.timeEnd('2-2')
    console.log('2-2:', result)
}


solve1(input)

solve2(input)