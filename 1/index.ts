import fs from 'node:fs'

const testInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`

const input = fs.readFileSync('./1/input.txt', { encoding: 'utf-8'})

const parse = (input: string): { direction: 'L' | 'R', steps: number }[] => {
    return input.split('\n').map(instruction => {
        const direction = instruction[0] as 'L' | 'R';
        const steps = instruction.substring(1)
        return { direction, steps: Number(steps) }
    })
}

const solve1 = (input: string) => {
    console.time('1-1')
    const instructions = parse(input);
    let zeroes = 0;
    let position = 50;
    for (const step of instructions) {
        if (step.direction === 'R') {
            position = position + step.steps;
            position = (position % 100);
        } else {
            position = position - step.steps
            if (position < 0) {
                position = ((position % 100) + 100) % 100
            }
        }
        if (position === 0) {
            zeroes += 1;
        }
    }
    console.timeEnd('1-1')
    console.log('1-1', zeroes)
}

const solve2 = (input: string) => {
    console.time('1-2')
    const instructions = parse(input);
    let zeroes = 0;
    let position = 50;
    for (const step of instructions) {
        if (step.direction === 'R') {
            position = position + step.steps;
            zeroes += Math.floor(position / 100);
            position = (position % 100);
        } else {
            const previousZero = position === 0 ? 0 : 1
            position = position - step.steps;
            if (position < 0) {
                zeroes += previousZero + Math.floor(Math.abs(position) / 100);
                position = ((position % 100) + 100) % 100;
            } else if (position === 0) {
                zeroes += 1;
            }
        }
    }
    console.timeEnd('1-2')
    console.log('1-2', zeroes)
}


solve1(input)

solve2(input)