async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/11/input', {
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

    const stones = data.split(' ').map(Number);
    for (let i = 0; i < 25; i++) {
      const stLength = stones.length;
      const toInsert = new Map();
      for (let j = 0; j < stLength; j++) {
        if (stones[j] === 0) {
          stones[j] = 1;
        } else if (stones[j].toString().length % 2 === 0) {
          toInsert.set(j, Number(stones[j].toString().slice(stones[j].toString().length / 2)));
          stones[j] = Number(stones[j].toString().slice(0, stones[j].toString().length / 2));
        } else {
          stones[j] *= 2024;
        }
      }

      let inserted = 0;
      for (const [key, val] of toInsert.entries()) {
        stones.splice(key + inserted, 0, val);
        inserted++;
      }
    }

    console.log(stones.length)
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
