async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/7/input', {
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

    const generateCombinations = (n, values) => {
      const results = [];
      function helper(current = []) {
        if (current.length === n) {
          results.push(current.slice());
          return;
        }
        for (let i = 0; i < values.length; i++) {
          helper([...current, values[i]]);
        }
      }
      helper();
      return results;
    }

    const list = new Map(data.trim().split('\n').map(v => {
      const [key, values] = v.split(':');
      return [Number(key), values.trim().split(' ').map(Number)]
    }));

    const operationMap = {
      '+': (a, b) => a + b,
      '*': (a, b) => a * b,
      '||': (a, b) => a * Math.pow(10, b.toString().length) + b,
    };

    let sum = 0;
    for (const [key, values] of list) {
      const possibleOperations = generateCombinations(values.length - 1, ['*', '+', '||']);

      for (let i = 0; i < possibleOperations.length; i++) {
        // console.log(possibleOperations[i]);
        let val = values[0];
        for (let j = 0; j < possibleOperations[i].length; j++) {
          val = operationMap[possibleOperations[i][j]](val, values[j+1]);
        }
        if (val === key) {
          sum += key;
          break;
        }
      }
    }

    console.log(sum);
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
