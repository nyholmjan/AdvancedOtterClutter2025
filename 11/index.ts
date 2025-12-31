import fs from 'node:fs'

const testInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`

const testInput2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`

const input = fs.readFileSync('./11/input.txt', { encoding: 'utf-8' })

const parse = (input: string) => {
  const graph = new Map<string, string[]>()
  input.split('\n').forEach(r => {
    const [device, to] = r.split(':');
    graph.set(device!, to!.trim().split(' ').sort())
  });
  return graph;
}

const graph = parse(input)

const bfs = (from:string, to: string) => {
  const addAllowedPaths = (word: string, target: string, set: Set<string>) => {
    graph.entries().forEach(([k, v]) => {
      if (v.includes(word) && !set.has(k)) {
        set.add(k)
        if (k !== target) addAllowedPaths(k, target, set)
      }
    })
  }
  const createFilter = (to: string, from: string) => {
    const paths = new Set<string>()
    addAllowedPaths(to, from, paths);
    return paths
  }
  const filter = createFilter(to, from);

  const queue: string[] = []

  graph.get(from)!.forEach((d) => queue.push(d))

  let queueIndex = 0;
  let outs = 0;
  while (queueIndex <= queue.length) {
    const next = graph.get(queue[queueIndex]!);
    if (!next) break;

    queueIndex++
    if (next.includes(to)) {
      outs++;
      continue
    }

    next.forEach(n => {
      if (filter.has(n)) queue.push(n)
    })
  }

  return outs;
}


const solve1 = () => {
  console.time('11-1');
  console.log('11-1:', bfs('you', 'out'))
  console.timeEnd('11-1')
}

const solve2 = () => {
  console.time('11-2');

  const res =  bfs('svr', 'fft') * bfs('fft', 'dac') * bfs('dac', 'out')

  console.log('11-2:', res)
  console.timeEnd('11-2')
}

solve1()

solve2()
