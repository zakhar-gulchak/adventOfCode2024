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
    const antinodes = new Set();
    // 1. build Map of Nodes
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[0].length; j++) {
        if (lines[i][j] !== '.') {
          antennas.set(lines[i][j], antennas.has(lines[i][j]) ? [...antennas.get(lines[i][j]), [i, j]] : [[i, j]]);
          antinodes.add(`[${i}][${j}]`);
        }
      }
    }
    const calcAntinodes = (i1, j1, i2, j2, width, height) => {
      const points = [];
      let x = 2 * j1 - j2;
      let y = 2 * i1 - i2;
      while (0 <= x && x < width && 0 <= y && y < height) {
        points.push([x, y]);
        x += j1 - j2;
        y += i1 - i2;
      }
      x = 2 * j2 - j1;
      y = 2 * i2 - i1;
      while (0 <= x && x < width && 0 <= y && y < height) {
        points.push([x, y]);
        x += j2 - j1;
        y += i2 - i1;
      }

      return points;
    }

    // 2. for each type calculate antinodes -> add to the set
    // console.log(lines.length, antennas);
    for (const [_, coordinates] of antennas) {
      for (let j = 0; j < coordinates.length - 1; j++) {
        for (let k = j + 1; k < coordinates.length; k++) {
          const points = calcAntinodes(coordinates[j][0], coordinates[j][1], coordinates[k][0], coordinates[k][1], lines[0].length, lines.length);
          for (const [x, y] of points) {
            antinodes.add(`[${y}][${x}]`);
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
