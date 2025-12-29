import fs from 'node:fs'

const testInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`

const input = fs.readFileSync('./9/input.txt', { encoding: 'utf-8' })

type Coord = [number, number];
type Rect = [Coord, Coord];

const parse = (input: string) => {
    return input.split('\n').map(r => r.split(",").map(Number) as Coord);
}

const calculateSize = (rect: Rect) => (Math.abs(rect[0][0] - rect[1][0]) + 1) * (Math.abs(rect[0][1] - rect[1][1]) + 1);

const sizeCompareFn = (a: Rect, b: Rect) => calculateSize(b) - calculateSize(a);

const solve1 = (input: string) => {
  const rows = parse(input)
  let largest = 0;
  console.time('9-1');
  rows.forEach(a => {
    rows.forEach(b => {
      const size =  calculateSize([a, b])
        if (size > largest) {
          largest = size;
        }
    })
  })

  console.timeEnd('9-1')
  console.log('9-1:', largest)
}

const solve2 = (input: string) => {
  const rows = parse(input);
  console.time('9-2');

  const rects: Rect[] = [];
  for (let a = 0; a < rows.length; a++) {
    for (let b = a + 1; b < rows.length; b++) {
      rects.push([rows[a]!, rows[b]!])
    }
  }

  rects.sort(sizeCompareFn);

  const borders: [Coord, Coord][] = [];

  rows.forEach((r, i) => {
    const next = rows[i + 1];
    if (next) {
      borders.push([r, next])
    } else {
      borders.push([r, rows[0]!])
    }
  })

  const getBounds = (rect: Rect): [number, number, number, number] => [
    Math.max(rect[0][1], rect[1][1]),
    Math.min(rect[0][1], rect[1][1]),
    Math.max(rect[0][0], rect[1][0]),
    Math.min(rect[0][0], rect[1][0])
  ];

  const testCollision = (rect: Rect) => {
    const [rTop, rBottom, rRight, rLeft] = getBounds(rect)

    return borders.every(border => {
      const [borderT, borderBottom, borderRight, borderLeft] = getBounds(border)

      return !(borderBottom < rTop && borderT > rBottom && borderLeft < rRight && borderRight > rLeft)
    })
  }

  for (let i = 0; i < rects.length; i++) {
      if (testCollision(rects[i]!)) {
        console.log('9-2:', calculateSize(rects[i]!))
        break;
      }
  }

  console.timeEnd('9-2')
}

solve1(input)

solve2(input)
