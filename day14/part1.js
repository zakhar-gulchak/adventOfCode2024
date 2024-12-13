async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/14/input', {
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
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
