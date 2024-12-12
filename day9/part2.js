async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/9/input', {
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

    // 1. convert to filesystem
    const filesystem = [];
    for (let i = 0, len = data.length, fileId = 0; i < len; i++) {
      if (i % 2 === 0) {
        filesystem.push(Array(Number(data[i])).fill(fileId));
        fileId++;
      } else if (data[i] > 0 ) {
        filesystem.push(Array(Number(data[i])).fill('.'));
      }
    }

    // 2. сompress filesystem
    for (let i = filesystem.length - 1; i > 0; i--) {
      if (filesystem[i].includes('.')) continue;

      for (let j = 0; j < i; j++) {
        if (filesystem[j].includes('.') && filesystem[j].length >= filesystem[i].length) {
          const jLength = filesystem[j].length - filesystem[i].length;
          filesystem[j] = [...filesystem[i]];
          filesystem[i] = Array(filesystem[i].length).fill('.');
          if (jLength > 0) {
            filesystem.splice(j + 1, 0, Array(jLength).fill('.'));
            i++;
          }
          break;
        }
      }
    }

    // 3. calculate checksum
    let checksum = 0;
    let index = 0;
    for (let i = 0; i < filesystem.length; i++) {
      for (const block of filesystem[i]) {
        if (block !== '.') {
          checksum += index * block;
        }
        index++;
      }
    }
    console.log(index, checksum);
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
