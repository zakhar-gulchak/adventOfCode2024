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
        for (let j = 0; j < Number(data[i]); j++) {
          filesystem.push(fileId);
        }
        fileId++;
      } else {
        for (let j = 0; j < Number(data[i]); j++) {
          filesystem.push('.');
        }
      }
    }
    // 2. сompress filesystem
    for (let i = 0; i < filesystem.length; i++) {
      while (filesystem.at(-1) === '.') {
        filesystem.pop();
      }
      if (filesystem[i] === '.') {
        filesystem[i] = filesystem.at(-1);
        filesystem.pop();
      }
    }
    // 3. calculate checksum
    let checksum = 0;
    for (let i = 0; i < filesystem.length; i++) {
      checksum += i * filesystem[i];
    }
    console.log(filesystem.length, checksum);

  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
