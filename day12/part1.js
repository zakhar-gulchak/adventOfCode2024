async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/12/input', {
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

    const input = data.split('\n');

    const findRegions = (data) => {
      // Array to store the regions
      let regions = [];
      // Positions outside the current region
      let outRegionPositions = [{y: 0, x: 0}];
      // Set of visited points
      let visited = new Set();

      // Breadth First Search (BFS) for each region
      while (outRegionPositions.length > 0) {
        let start = outRegionPositions.shift();
        if (visited.has(`${start.y},${start.x}`)) continue;

        let area = 0;
        let perimeter = 0;
        let spaces = new Map();

        let inRegionPositions = [start];
        let regionLetter = data[start.y][start.x];

        while (inRegionPositions.length > 0) {
          let current = inRegionPositions.shift();
          if (visited.has(`${current.y},${current.x}`)) continue;

          let inRegionAdjacent = 0;
          let adjacent = [
            {y: current.y - 1, x: current.x}, // up
            {y: current.y + 1, x: current.x}, // down
            {y: current.y, x: current.x - 1}, // left
            {y: current.y, x: current.x + 1}  // right
          ].filter(val => inGrid(val, data));
          adjacent.forEach(val => {
            if (data[val.y][val.x] === regionLetter) {
              inRegionAdjacent++;
              inRegionPositions.push(val);
            } else {
              outRegionPositions.push(val);
            }
          });
          let edges = 4 - inRegionAdjacent;
          perimeter += edges;
          area++;
          spaces.set(`${current.y},${current.x}`, {y: current.y, x: current.x, edges});
          visited.add(`${current.y},${current.x}`);
        }

        let corners = 0;
        for (const space of Array.from(spaces.values())) {
          const hasUp = spaces.has(`${space.y - 1},${space.x}`);
          const hasDown = spaces.has(`${space.y + 1},${space.x}`);
          const hasLeft = spaces.has(`${space.y},${space.x - 1}`);
          const hasRight = spaces.has(`${space.y},${space.x + 1}`);
          const hasUpperRight = spaces.has(`${space.y - 1},${space.x + 1}`);
          const hasLowerRight = spaces.has(`${space.y + 1},${space.x + 1}`);
          const hasLowerLeft = spaces.has(`${space.y + 1},${space.x - 1}`);
          const hasUpperLeft = spaces.has(`${space.y - 1},${space.x - 1}`);

          const inBoundsUpperRight = inGrid({y: space.y - 1, x: space.x + 1}, data);
          const inBoundsLowerRight = inGrid({y: space.y + 1, x: space.x + 1}, data);
          const inBoundsLowerLeft = inGrid({y: space.y + 1, x: space.x - 1}, data);
          const inBoundsUpperLeft = inGrid({y: space.y - 1, x: space.x - 1}, data);

          if (space.edges === 4) {
            corners += 4;
          } else if (space.edges === 3) {
            corners += 2;
          } else if (space.edges === 2) {
            if (hasUp && hasRight) {
              corners += hasUpperRight ? 1 : 2;
            } else if (hasRight && hasDown) {
              corners += hasLowerRight ? 1 : 2;
            } else if (hasDown && hasLeft) {
              corners += hasLowerLeft ? 1 : 2;
            } else if (hasLeft && hasUp) {
              corners += hasUpperLeft ? 1 : 2;
            }
          } else if (space.edges === 1) {
            if (hasLeft && hasDown && hasRight) {
              if (!hasLowerRight && inBoundsLowerRight) corners += 1;
              if (!hasLowerLeft && inBoundsLowerLeft) corners += 1;
            } else if (hasLeft && hasDown && hasUp) {
              if (!hasUpperLeft && inBoundsUpperLeft) corners += 1;
              if (!hasLowerLeft && inBoundsLowerLeft) corners += 1;
            } else if (hasLeft && hasUp && hasRight) {
              if (!hasUpperRight && inBoundsUpperRight) corners += 1;
              if (!hasUpperLeft && inBoundsUpperLeft) corners += 1;
            } else if (hasUp && hasDown && hasRight) {
              if (!hasLowerRight && inBoundsLowerRight) corners += 1;
              if (!hasUpperRight && inBoundsUpperRight) corners += 1;
            }
          } else if (space.edges === 0) {
            if (!hasLowerRight && inBoundsLowerRight) corners += 1;
            if (!hasLowerLeft && inBoundsLowerLeft) corners += 1;
            if (!hasUpperRight && inBoundsUpperRight) corners += 1;
            if (!hasUpperLeft && inBoundsUpperLeft) corners += 1;
          }
        }

        regions.push({area, perimeter, corners});
      }

      return regions;
    }

    const inGrid = (val, data) => {
      return val.y >= 0 && val.y < data.length && val.x >= 0 && val.x < data[val.y].length;
    }

    const regions = findRegions(input);
    console.log(
      regions.reduce((acc, region) => acc += region.area * region.perimeter, 0),
      regions.reduce((acc, region) => acc += region.area * region.corners, 0));
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
