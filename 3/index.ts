import fs from 'node:fs'

const testInput = `987654321111111
811111111111119
234234234234278
818181911112111`

const input = fs.readFileSync('./3/input.txt', { encoding: 'utf-8'})

const parse = (input: string) => {
    return input.split('\n').map(bank => Uint8Array.from(bank))
}



const solve1 = (input: string) => {
    console.time('3-1');

    const banks = parse(input);
    let total = 0

    banks.forEach(bank => {
        let left = 0;
        let leftIndex = 0;
        let right = 0;
        let rightIndex = 0;
        bank.forEach((battery, index) => {
            if (battery > left && index < bank.length - 1) {
                left = battery;
                leftIndex = index;
            }
            if (index > leftIndex && battery > right || rightIndex <= leftIndex) {
                right = battery;
                rightIndex = index;
            }
        })
        total += Number([left, right].join(''))
    })

    console.timeEnd('3-1')
    console.log('3-1:', total)
}



const solve2 = (input: string) => {
    console.time('3-2')

    const findLargestPossibleValue = (startingIndex: number, array: Uint8Array, amountLeft: number)  => {
        let val = 0;
        let index = startingIndex;

        for (let i = startingIndex; i < array.length - amountLeft + 1; i++) {
            if (array[i] > val) {
                val = array[i];
                index = i;
            }
        }
        return [val, index];
    }

    const banks = parse(input);
    const results = banks.map(bank => {
        const result: number[] = [];
        let index = 0;

        while (result.length < 12) {
            const [val, lastIndex] = findLargestPossibleValue(index, bank, 12 - result.length);
            index = lastIndex + 1;
            result.push(val)
        }
        return Number(result.join(''));
    })
    const result = results.reduce((a, b) => a + b)

    console.timeEnd('3-2')
    console.log('3-2:', result)
}


solve1(input)

solve2(input)