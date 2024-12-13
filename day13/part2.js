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

    // Helper function to calculate the number of button presses needed for a given prize location
    function calculateButtonPresses(AX, AY, BX, BY, PX, PY) {
      const denom = BY * AX - BX * AY;
      const countA = (PX * BY - BX * PY) / denom;
      const countB = (PY * AX - AY * PX) / denom;
      return [countA, countB];
    }

    // Helper function to check if the button press counts are valid
    function isValid(countA, countB, maxPresses = 100) {
      return Number.isInteger(countA) && Number.isInteger(countB) && countA >= 0 && countB >= 0 && countA <= maxPresses && countB <= maxPresses;
    }

    let answer1 = 0;
    let answer2 = 0;

    // Process inputs in chunks of 4 lines
    const machines = parseInput(data);
    for (const { x_a, y_a, x_b, y_b, prize_x, prize_y } of machines) {
      // Part 1
      const [cntA, cntB] = calculateButtonPresses(x_a, y_a, x_b, y_b, prize_x, prize_y);
      if (isValid(cntA, cntB)) {
        answer1 += cntA * 3 + cntB;
      }

      // Part 2
      const shift = 10000000000000;
      const [cntA2, cntB2] = calculateButtonPresses(x_a, y_a, x_b, y_b, prize_x + shift, prize_y + shift);
      if (isValid(cntA2, cntB2, Infinity)) { // No max press limit for Part 2
        answer2 += cntA2 * 3 + cntB2;
      }
    }

    console.log({ answer1, answer2 });
  } catch (error) {
    console.error('Fetching data failed:', error)
  }
}

fetchData()
