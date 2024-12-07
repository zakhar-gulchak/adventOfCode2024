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
    const startI = i, startJ = j;
    const directions = [
      [-1,0], // up
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
    ];
    let curDirection = 0;
    const visited = new Set();

    while (0 <= i && i < lines.length && 0 <= j && j < lines[0].length) {
      visited.add(`[${i}][${j}]`);
      if (
        0 <= i+directions[curDirection][0] && i+directions[curDirection][0] < lines.length &&
        0 <= j+directions[curDirection][1] && j+directions[curDirection][1] < lines[0].length &&
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

    console.log(visited.size);
    visited.delete(`[${startI}][${startJ}]`);
    console.log(visited.size);

    let possibleLoops = 0;
    for (const key of visited) {
      let i = startI, j = startJ;
      let curDirection = 0;
      let [obstI, obstJ] = key.match(/\d+/g).map(Number);
      const visited = new Set();
      const newObstacle = [obstI, obstJ];

      while (0 <= i && i < lines.length && 0 <= j && j < lines[0].length) {
        if (visited.has(`[${i}][${j}][${curDirection}]`)) {
          possibleLoops++;
          break;
        }
        visited.add(`[${i}][${j}][${curDirection}]`);

        if (
          0 <= i+directions[curDirection][0] && i+directions[curDirection][0] < lines.length &&
          0 <= j+directions[curDirection][1] && j+directions[curDirection][1] < lines[0].length &&
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
