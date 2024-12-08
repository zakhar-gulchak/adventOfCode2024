async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/8/input', {
      headers: {
        'Cookie': '',
      }
    })
    const reader = await body.getReader()
    const decoder = new TextDecoder();
    let data = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      data +=  decoder.decode(value, { stream: true });
    }

    const lines = data.split('\n');
    lines.pop();
    const antennas = new Map();
    // 1. build Map of Nodes
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[0].length; j++) {
        if (lines[i][j] !== '.') {
          antennas.set(lines[i][j], antennas.has(lines[i][j]) ? [...antennas.get(lines[i][j]), [i, j]] : [[i, j]]);
        }
      }
    }
    const calcAntinodes = (i1, j1, i2, j2) =>
      [2 * j1 - j2, 2 * i1 - i2, 2 * j2 - j1, 2 * i2 - i1];

    // 2. for each type calculate antinodes -> add to the set
    const antinodes = new Set();
    for (const [_, coordinates] of antennas) {
      for (let j = 0; j < coordinates.length - 1; j++) {
        for (let k = j + 1; k < coordinates.length; k++) {
          const [x1,y1,x2,y2] = calcAntinodes(coordinates[j][0], coordinates[j][1], coordinates[k][0], coordinates[k][1]);
          if (0 <= x1 && x1 < lines[0].length && 0 <= y1 && y1 < lines.length) {
            antinodes.add(`[${x1}][${y1}]`);
          }
          if (0 <= x2 && x2 < lines[0].length && 0 <= y2 && y2 < lines.length) {
            antinodes.add(`[${x2}][${y2}]`);
          }
        }
      }
    }

    console.log(antinodes.size);
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
