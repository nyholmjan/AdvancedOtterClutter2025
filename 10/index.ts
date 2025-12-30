import fs from 'node:fs'
import { type Arith, init } from 'z3-solver';
const { Context } = await init();

const testInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`

const input = fs.readFileSync('./10/input.txt', { encoding: 'utf-8' })

type Machine = {
  integerButtons: number[];
  buttons: number[][];
  expectedLights: number;
  joltages: number[];
}

const parseMachine = (input: string) => {
  const machine: Machine = {
    integerButtons: [],
    buttons: [],
    expectedLights: 0,
    joltages: []
  }

  const unwrap = (w: string) => w.substring(1, w.length - 1)
  const lightsToInteger = (val: string) => parseInt(val.split('').map(char => char === '.' ? 0 : 1).reverse().join(''), 2);
  const buttonToInteger = (btn: number[]) => btn.reduce((int, num) => (int += 1 << num), 0)

  input.split(' ').forEach(word => {
    if (word.startsWith('[')) {
      machine.expectedLights = lightsToInteger(unwrap(word));
    } else if (word.startsWith('(')) {
      const btn = unwrap(word).split(',').map(Number);
      machine.integerButtons.push(buttonToInteger(btn));
      machine.buttons.push(btn);
    } else if (word.startsWith('{')) {
      machine.joltages = unwrap(word).split(',').map(Number)
    }
  })

  return machine;
}

const parse = (input: string) => {
    return input.split('\n').map(parseMachine);
}

const solve1 = (input: string) => {
  const machines = parse(input)
  console.time('10-1');

  const bfs = (machine: Machine) => {
    const queue: [number, number, number][] = []
    const visited = new Set<number>()

    for (let b of machine.integerButtons) {
      queue.push([machine.expectedLights, b, 0])
    }

    let queueIndex = 0;
    while (true) {
      const next = queue[queueIndex];
      queueIndex++
      if (!next) throw new Error('Empty queue');

      const newState = next[1] ^ next[0];

      if (newState === 0) return next[2] + 1;


      for (let i = 0; i < machine.integerButtons.length; i++) {
        const memoId = next[2] + 1 + (newState << 6) + (machine.integerButtons[i]! << 16);
        if (visited.has(memoId)) continue;
        visited.add(memoId);
        queue.push([newState, machine.integerButtons[i]!, next[2] + 1])
      }
    }
  }

  const presses = machines.map(m => bfs(m))

  console.log('10-1:', presses.reduce((a, b) => a + b))
  console.timeEnd('10-1')
}

const solve2 = async (input: string) => {
  const machines = parse(input);
  console.time('10-2');

  const cheat = async (machine: Machine) => {
    const { Optimize, Int } = Context('main');
    const optimizer = new Optimize();

    const bVars: Arith[] = [];
    for (let i = 0; i < machine.buttons.length; i++) {
      const value = Int.const(String.fromCodePoint(97 + i));
      optimizer.add(value.ge(0));
      bVars.push(value);
    }

    machine.joltages.forEach((joltage, ji) => {
      const cond = machine.buttons.reduce<Arith>((cond, b, bi) => {
        if (b.includes(ji)) {
          return cond.add(bVars[bi]!);
        }
        return cond;
      }, Int.val(0));
      optimizer.add(cond.eq(Int.val(joltage)))
    })

    const sum = bVars.reduce((val, bVar) => val.add(bVar), Int.val(0));

    optimizer.minimize(sum);
    const res = await optimizer.check()
    if (res != "sat") throw new Error('You have a problem');
    return parseInt(optimizer.model().eval(sum).toString())
  }

  const res = await Promise.all(machines.map(m => cheat(m)))

  console.log('10-2:', res.reduce((a, b) => a + b))
  console.timeEnd('10-2')
}

solve1(input)

solve2(input)
