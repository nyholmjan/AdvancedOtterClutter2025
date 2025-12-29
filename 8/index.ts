import fs from 'node:fs'

const testInput = ``

const input = fs.readFileSync('./8/input.txt', { encoding: 'utf-8' })

type Coord = { x: number, y: number, z: number };

type Junction = { dist: number, a: Coord | null, b: Coord | null };

const euclideanDist = (a: Coord, b: Coord) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)

console.time('setup')
const parse = (input: string): Coord[] => {
    return input.split('\n').map(r => r.split(",").map(Number)).map(r => ({ x: r[0], y: r[1], z: r[2] } as Coord));
}

const rows = parse(input);

const graph = rows.reduce((graphs, coord) => {
  graphs.set(
    coord,
    new Map(
      rows.filter(r => r !== coord)
        .map(r =>
          [
            euclideanDist(coord, r),
            r
          ]
        )
    )
  )
  return graphs;
}, new Map<Coord, Map<number, Coord>>())

const toKey = (a: Coord, b: Coord) =>
  euclideanDist(a, b)

const graphMap = new Map<number, Junction>()
graph.forEach((v, a) => {
  v.forEach((b, dist) => {
    if (a !== b && !graphMap.has(toKey(a, b))) {
      graphMap.set(toKey(a, b), { dist, a, b })
    }
  })
})

const sorted = Array.from(graphMap.values()).sort((((a, b) => a.dist - b.dist)))

console.timeEnd('setup')

const solve1 = () => {
  console.time('8-1');

  const circuits: Coord[][] = [];
  const testSet = sorted.length < 1000 ? sorted.slice(0, 10) : sorted.slice(0, 1000);

  for (const junction of testSet) {
    const foundA = circuits.find(c => c.some(j => j === junction.a));
    const foundB = circuits.find(c => c.some(j => j === junction.b));
    if (foundA || foundB) {
      if (foundA === foundB) {
      } else if (foundA && foundB) {
        foundB.push(...foundA);
        circuits.splice(circuits.indexOf(foundA), 1);
      } else if (foundB) {
        foundB.push(junction.a!);
      } else if (foundA) {
        foundA.push(junction.b!);
      }
    } else {
      circuits.push([junction.a!, junction.b!])
    }
  }

  circuits.sort((a,b) => b.length - a.length)

  console.timeEnd('8-1')
  console.log('8-1:', circuits[0]!.length * circuits[1]!.length * circuits[2]!.length)
}

const solve2 = () => {
  console.time('8-2')

  const circuits: Coord[][] = [];

  for (const junction of sorted) {
    const foundA = circuits.find(c => c.some(j => j === junction.a));
    const foundB = circuits.find(c => c.some(j => j === junction.b));

    if (foundA || foundB) {
      if (foundA === foundB) {
      } else if (foundA && foundB) {
        foundB.push(...foundA);
        circuits.splice(circuits.indexOf(foundA), 1);
      } else if (foundB) {
        foundB.push(junction.a!);
      } else if (foundA) {
        foundA.push(junction.b!);
      }
    } else {
      circuits.push([junction.a!, junction.b!])
    }
    if (circuits.length === 1 && circuits[0] && circuits[0].length === 1000) {
      console.timeEnd('8-2')
      console.log('8-2:', junction!.a!.x * junction!.b!.x)
      break;
    }
  }
}

solve1()

solve2()
