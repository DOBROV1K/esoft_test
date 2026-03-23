function isValid(s) {
  if (s.length === 0) return true;

  const stack = [];

  const matchingOpen = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if ("([{".includes(char)) {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack[stack.length - 1] !== matchingOpen[char]) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}

const tests = [
  { input: "",       expected: true  },
  { input: "()",     expected: true  },
  { input: "()[]{}", expected: true  },
  { input: "{[]}",   expected: true  },
  { input: "(]",     expected: false },
  { input: "([)]",   expected: false },
  { input: "(((",    expected: false },
  { input: "}",      expected: false },
];

tests.forEach(({ input, expected }) => {
  const result = isValid(input);
  console.log(`isValid("${input}") = ${result}`);
});