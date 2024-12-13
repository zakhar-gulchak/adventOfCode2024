async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/10/input', {
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
      data += decoder.decode(value, { stream: true });
    }

    const directions = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ];
    const lines = data.split('\n');
    const traverse = (i, j, index = 0, visited = new Set()) => {
      if (index === 9) {
        if (!visited.has(`[${i}][${j}]`)) {
          visited.add(`[${i}][${j}]`);
          return 1;
        }
        else return 0;
      }
      const nextIndex = index + 1;
      let score = 0;
      for (const [di, dj] of directions) {
        if (0 <= i + di && i + di < lines.length && 0 <= j + dj && j + dj < lines[0].length && Number(lines[i + di][j + dj]) === nextIndex) {
          score += traverse(i + di, j + dj, nextIndex, visited);
        }
      }

      return score;
    };

    let scores = 0;
    for (let i = 0 ; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === '0') {
          scores += traverse(i, j);
        }
      }
    }

    console.log(scores);
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
