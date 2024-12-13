async function fetchData () {
  try {
    const { body } = await fetch('https://adventofcode.com/2024/day/13/input', {
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

    function solveClawMachines(machines) {
      let totalPrizes = 0;
      let totalTokens = 0;

      for (let machine of machines) {
        const { x_a, y_a, x_b, y_b, prize_x, prize_y } = machine;
        let bestCost = Infinity;
        let canWinPrize = false;

        // Try all possible combinations of button presses for a_count and b_count
        for (let a_count = 0; a_count <= 100; a_count++) {
          for (let b_count = 0; b_count <= 100; b_count++) {
            // Check if this combination of presses satisfies the prize coordinates
            if (a_count * x_a + b_count * x_b === prize_x &&
              a_count * y_a + b_count * y_b === prize_y) {
              canWinPrize = true;
              const cost = a_count * 3 + b_count * 1; // 3 tokens for A, 1 token for B
              bestCost = Math.min(bestCost, cost); // Minimize the cost
            }
          }
        }

        // If a solution exists for this machine, add to the total count and cost
        if (canWinPrize) {
          totalPrizes++;
          totalTokens += bestCost;
        }
      }

      return { totalPrizes, totalTokens };
    }

    function parseInput(input) {
      const machines = [];
      const machineData = input.split("\n\n"); // Split by double newline (each machine)

      for (const machine of machineData) {
        const lines = machine.split("\n");
        const buttonA = lines[0].match(/Button A: X([+-]\d+), Y([+-]\d+)/);
        const buttonB = lines[1].match(/Button B: X([+-]\d+), Y([+-]\d+)/);
        const prize = lines[2].match(/Prize: X=(\d+), Y=(\d+)/);

        if (buttonA && buttonB && prize) {
          const x_a = parseInt(buttonA[1]);
          const y_a = parseInt(buttonA[2]);
          const x_b = parseInt(buttonB[1]);
          const y_b = parseInt(buttonB[2]);
          const prize_x = parseInt(prize[1]);
          const prize_y = parseInt(prize[2]);

          machines.push({ x_a, y_a, x_b, y_b, prize_x, prize_y });
        }
      }

      return machines;
    }
    const machines = parseInput(data);
    console.log(machines);
    const result = solveClawMachines(machines);
    console.log(`Total prizes: ${result.totalPrizes}`);
    console.log(`Total tokens spent: ${result.totalTokens}`);


  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
