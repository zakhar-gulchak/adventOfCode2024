async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/6/input', {
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
    let i = 0;
    for (; i < lines.length; i++) {
      if (lines[i].match(/[<>^v]/g)) break;
    }
    let j = lines[i].indexOf('^'); // || lines[i].indexOf('>') || lines[i].indexOf('<') || lines[i].indexOf('v');
    const directions = [
      [-1,0], // up
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
    ];
    let curDirection = 0;
    const visited = new Set();
    const path = new Set();

    while (
      i >= 0 &&
      i < lines.length &&
      j >= 0 &&
      j < lines[0].length
    ) {
      path.add(`[${i}][${j}]`);
      visited.add(`[${i}][${j}][${curDirection}]`);
      if (
        i+directions[curDirection][0] >= 0 &&
        i+directions[curDirection][0] < lines.length &&
        j+directions[curDirection][1] >= 0 &&
        j+directions[curDirection][1] < lines[0].length &&
        lines[i+directions[curDirection][0]][j+directions[curDirection][1]] === '#'
      ) {
        curDirection++;
        if (curDirection > 3 ) {
          curDirection = 0;
        }
      } else {
        i += directions[curDirection][0];
        j += directions[curDirection][1];
      }
    }

    console.log(path.size);
    console.log(visited.size);
    visited.delete(`[${i-directions[curDirection][0]}][${j-directions[curDirection][1]}][${curDirection}]`);
    visited.delete(`[${i-directions[curDirection][0]*2}][${j-directions[curDirection][1]*2}][${curDirection}]`);
    console.log(visited.size);

    let possibleLoops = 0;
    for (const key of visited) {
      let [i, j, curDirection] = key.match(/\d+/g).map(Number);
      const visited = new Set();
      const newObstacle = [i + directions[curDirection][0], j + directions[curDirection][1]];

      while (
        i >= 0 &&
        i < lines.length &&
        j >= 0 &&
        j < lines[0].length
      ) {
        if (visited.has(`[${i}][${j}][${curDirection}]`)) {
          possibleLoops++;
          break;
        }
        visited.add(`[${i}][${j}][${curDirection}]`);

        if (
          i+directions[curDirection][0] >= 0 &&
          i+directions[curDirection][0] < lines.length &&
          j+directions[curDirection][1] >= 0 &&
          j+directions[curDirection][1] < lines[0].length &&
          (
            lines[i+directions[curDirection][0]][j+directions[curDirection][1]] === '#' ||
            (i+directions[curDirection][0] === newObstacle[0] && j+directions[curDirection][1] === newObstacle[1])
          )
        ) {
          curDirection++;
          if (curDirection > 3 ) {
            curDirection = 0;
          }
        } else {
          i += directions[curDirection][0];
          j += directions[curDirection][1];
        }
      }
      // console.log(visited.size);
    }
    console.log(possibleLoops);
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
