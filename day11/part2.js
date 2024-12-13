async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/11/input', {
      headers: {
        'Cookie': 'session=53616c7465645f5f24524e54357a7463a26032b097d30f92fe78ea90e54c3b6688279b280bc8209b86289cfafaf19123a4d58d3729b42ed870819e7eb64069d1\n',
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

    const blinkAtStone = (numberOnStone, timesToBlink, cache = {}) => {
        if (cache[`${numberOnStone},${timesToBlink}`])
          return cache[`${numberOnStone},${timesToBlink}`];

        if (timesToBlink === 0) return 1;

        if (numberOnStone === 0) return blinkAtStone(1, timesToBlink - 1, cache);

        if (numberOnStone.toString().length % 2 !== 0)
          return blinkAtStone(2024 * numberOnStone, timesToBlink - 1, cache);

        const n = numberOnStone.toString();

        return (cache[`${numberOnStone},${timesToBlink}`] =
          blinkAtStone(parseInt(n.slice(0, n.length / 2)), timesToBlink - 1, cache) +
          blinkAtStone(
            parseInt(n.slice(n.length / 2, n.length)),
            timesToBlink - 1,
            cache
          ));
      };

    const num = data.split(' ').map(Number)
      .map((stoneNum) => blinkAtStone(stoneNum, 75))
      .reduce((sum, numStones) => sum + numStones);

    console.log(num)
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
