/**
 * JavaScript Beginner Lessons Data
 * 6 modules covering JavaScript from scratch
 */

export const jsModules = [
  // ─── MODULE 1: Getting Started ────────────────────────────────────────────
  {
    id: 'js-module-1',
    title: 'Getting Started',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    description: 'Learn how to print output, declare variables, and understand JavaScript\'s basic syntax.',
    lessons: [
      {
        id: 'js-1-1',
        title: 'Your First JavaScript',
        xp: 20,
        theory: `## Hello, JavaScript! 👋

JavaScript is the language that makes websites interactive. It runs directly in your browser — no installation needed!

### console.log()

The most basic thing in JavaScript is printing output using \`console.log()\`:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

Think of \`console.log()\` as the "print to screen" command.

### Strings
Text in JavaScript is called a **string**. You can use:
- Double quotes: \`"Hello"\`
- Single quotes: \`'Hello'\`
- Backticks: \`\`Hello\`\` (more powerful — we'll see why later!)

\`\`\`javascript
console.log("Hello!");
console.log('Hello!');
console.log(\`Hello!\`);
// All produce the same output
\`\`\`

### Comments
Lines starting with \`//\` are **comments** — JavaScript ignores them. They are notes for you.

\`\`\`javascript
// This is a comment — JavaScript ignores this line
console.log("This runs!"); // inline comment
\`\`\``,
        starterCode: `// Your first JavaScript program!
console.log("Hello, World!");
console.log("JavaScript is awesome!");`,
        challenge: {
          prompt: 'Print the message **"I love JavaScript!"** to the console.',
          hint: 'Use console.log() and wrap the text in quotes.',
          testFn: (output) => output.trim() === 'I love JavaScript!',
        }
      },
      {
        id: 'js-1-2',
        title: 'Variables with let and const',
        xp: 25,
        theory: `## Variables in JavaScript 📦

Variables store data. JavaScript has two modern ways to declare them:

### const — for values that don't change
\`\`\`javascript
const name = "Alice";
const age = 25;
\`\`\`
Use \`const\` whenever the value won't be reassigned. This is the safest choice!

### let — for values that change
\`\`\`javascript
let score = 0;
score = 10;    // OK — let can be reassigned
score = score + 5;
\`\`\`

### Using variables
\`\`\`javascript
const name = "Alice";
console.log(name);           // Alice
console.log("Hi, " + name); // Hi, Alice

let lives = 3;
lives = lives - 1;
console.log(lives);          // 2
\`\`\`

### What about var?
You might see \`var\` in older code — avoid it in new code. Use \`const\` or \`let\` instead.`,
        starterCode: `const name = "Alice";
let score = 0;

console.log(name);
console.log("Score:", score);

score = score + 100;
console.log("New score:", score);`,
        challenge: {
          prompt: 'Create a `const` called `city` that stores any city name, then print it.',
          hint: 'const city = "London"; then console.log(city);',
          testFn: (output) => output.trim().length > 0,
        }
      },
      {
        id: 'js-1-3',
        title: 'Data Types',
        xp: 30,
        theory: `## JavaScript Data Types 🔢

JavaScript has several built-in data types:

### String (text)
\`\`\`javascript
const greeting = "Hello, World!";
const lang = 'JavaScript';
\`\`\`

### Number (both integers and decimals)
\`\`\`javascript
const age = 25;
const price = 9.99;
const negative = -10;
\`\`\`

### Boolean (true or false)
\`\`\`javascript
const isOnline = true;
const isAdmin = false;
\`\`\`

### Checking types with typeof
\`\`\`javascript
console.log(typeof "hello");   // string
console.log(typeof 42);        // number
console.log(typeof true);      // boolean
console.log(typeof undefined); // undefined
\`\`\`

### Template Literals — the better way to combine strings
Instead of \`"Hello, " + name\`, use backticks:
\`\`\`javascript
const name = "Bob";
const age = 30;
console.log(\`My name is \${name} and I am \${age} years old.\`);
\`\`\``,
        starterCode: `const name = "Alex";
const age = 20;
const isStudent = true;

console.log(\`Name: \${name}\`);
console.log(\`Age: \${age}\`);
console.log(\`Student: \${isStudent}\`);
console.log("Type of age:", typeof age);`,
        challenge: {
          prompt: 'Create variables `product` (string), `price` (number), and `inStock` (boolean). Use a template literal to print them all on one line.',
          hint: 'console.log(`${product} costs $${price} - In stock: ${inStock}`)',
          testFn: (output) => output.trim().length > 5,
        }
      }
    ]
  },

  // ─── MODULE 2: Making Decisions ───────────────────────────────────────────
  {
    id: 'js-module-2',
    title: 'Making Decisions',
    icon: '🔀',
    color: 'from-cyan-500 to-blue-500',
    description: 'Write code that makes choices using if, else if, and else statements.',
    lessons: [
      {
        id: 'js-2-1',
        title: 'If / Else Statements',
        xp: 25,
        theory: `## Making Decisions with if 🤔

Programs need to make choices. JavaScript uses **if statements**:

### Basic if
\`\`\`javascript
const temperature = 30;

if (temperature > 25) {
  console.log("It's hot outside!");
}
\`\`\`

Unlike Python, JavaScript uses **curly braces** \`{}\` to group code, not indentation (though indentation is still good practice!).

### if...else
\`\`\`javascript
const age = 16;

if (age >= 18) {
  console.log("You can vote!");
} else {
  console.log("You're too young to vote.");
}
\`\`\`

### Comparison operators
| Operator | Meaning |
|----------|---------|
| \`===\` | Strict equal (preferred!) |
| \`!==\` | Strict not equal |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater than or equal |
| \`<=\` | Less than or equal |

> Use \`===\` (triple equals) not \`==\` — it's safer and more predictable!`,
        starterCode: `const age = 20;

if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}`,
        challenge: {
          prompt: 'Write code with `const num = 7`. Print "Positive" if it\'s greater than 0, otherwise print "Not positive".',
          hint: 'if (num > 0) { console.log("Positive"); } else { ... }',
          testFn: (output) => output.trim() === 'Positive',
        }
      },
      {
        id: 'js-2-2',
        title: 'else if and Logical Operators',
        xp: 30,
        theory: `## else if — Multiple Choices 🌈

\`\`\`javascript
const score = 75;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
\`\`\`

### Logical Operators
Combine conditions using \`&&\` (AND), \`||\` (OR), \`!\` (NOT):

\`\`\`javascript
const age = 25;
const hasTicket = true;

if (age >= 18 && hasTicket) {
  console.log("Welcome to the show!");
}

if (age < 5 || age > 65) {
  console.log("Free entry!");
}

if (!hasTicket) {
  console.log("Please buy a ticket.");
}
\`\`\`

### Ternary operator (shorthand if/else)
\`\`\`javascript
const isOnline = true;
const status = isOnline ? "Online" : "Offline";
console.log(status); // Online
\`\`\``,
        starterCode: `const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}`,
        challenge: {
          prompt: 'Set `const temp = 15`. Print "Cold" if below 10, "Warm" if between 10–25, or "Hot" if above 25.',
          hint: 'Use if (temp < 10), else if (temp <= 25), else',
          testFn: (output) => output.trim() === 'Warm',
        }
      }
    ]
  },

  // ─── MODULE 3: Loops ──────────────────────────────────────────────────────
  {
    id: 'js-module-3',
    title: 'Loops',
    icon: '🔁',
    color: 'from-green-500 to-emerald-500',
    description: 'Use for and while loops to repeat code automatically.',
    lessons: [
      {
        id: 'js-3-1',
        title: 'For Loops',
        xp: 30,
        theory: `## For Loops 🔄

A **for loop** repeats code a fixed number of times:

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// 0, 1, 2, 3, 4
\`\`\`

The for loop has three parts:
1. \`let i = 0\` — start value
2. \`i < 5\` — keep going while this is true
3. \`i++\` — increment (same as \`i = i + 1\`)

### Counting from 1 to 10
\`\`\`javascript
for (let i = 1; i <= 10; i++) {
  console.log(i);
}
\`\`\`

### Looping over an array
\`\`\`javascript
const fruits = ["apple", "banana", "cherry"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
\`\`\`

### for...of (cleaner way to loop arrays)
\`\`\`javascript
for (const fruit of fruits) {
  console.log(fruit);
}
\`\`\``,
        starterCode: `// Print numbers 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}`,
        challenge: {
          prompt: 'Use a for loop to print the numbers 1 through 10, each on its own line.',
          hint: 'for (let i = 1; i <= 10; i++) { console.log(i); }',
          testFn: (output) => {
            const lines = output.trim().split('\n').map(l => l.trim());
            return lines.length === 10 && lines[0] === '1' && lines[9] === '10';
          },
        }
      },
      {
        id: 'js-3-2',
        title: 'While Loops',
        xp: 35,
        theory: `## While Loops ⏳

A **while loop** keeps running as long as a condition is true:

\`\`\`javascript
let count = 1;

while (count <= 5) {
  console.log(count);
  count++; // Don't forget this! Otherwise: infinite loop
}
\`\`\`

### Break and Continue
\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break;    // Stops the loop
  console.log(i);        // Prints 0, 1, 2, 3, 4
}

for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue; // Skip even numbers
  console.log(i);             // Prints 1, 3, 5, 7, 9
}
\`\`\`

### When to use while vs for?
- Use **for** when you know how many iterations (count to 10)
- Use **while** when you repeat until a condition changes (until user quits)`,
        starterCode: `let count = 1;

while (count <= 5) {
  console.log("Count:", count);
  count++;
}

console.log("Done!");`,
        challenge: {
          prompt: 'Use a while loop to print "Hello" exactly 3 times.',
          hint: 'let i = 0; while (i < 3) { console.log("Hello"); i++; }',
          testFn: (output) => {
            const lines = output.trim().split('\n').filter(l => l.trim() === 'Hello');
            return lines.length === 3;
          },
        }
      }
    ]
  },

  // ─── MODULE 4: Functions ──────────────────────────────────────────────────
  {
    id: 'js-module-4',
    title: 'Functions',
    icon: '🔧',
    color: 'from-purple-500 to-violet-500',
    description: 'Write reusable code blocks called functions — the cornerstone of JavaScript.',
    lessons: [
      {
        id: 'js-4-1',
        title: 'Defining Functions',
        xp: 40,
        theory: `## Functions — Reusable Code 🧩

A **function** is a named block of code you can call anytime:

### Function declaration
\`\`\`javascript
function greet() {
  console.log("Hello, World!");
}

greet(); // Call the function
greet(); // Call it again!
\`\`\`

### Functions with parameters
\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Alice"); // Hello, Alice!
greet("Bob");   // Hello, Bob!
\`\`\`

### Functions that return values
\`\`\`javascript
function add(a, b) {
  return a + b;
}

const result = add(3, 4);
console.log(result); // 7
\`\`\`

### Arrow functions (modern syntax)
\`\`\`javascript
const add = (a, b) => a + b;
const greet = (name) => console.log(\`Hello, \${name}!\`);

console.log(add(5, 3)); // 8
greet("Alice");          // Hello, Alice!
\`\`\``,
        starterCode: `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("Alice");
greet("Bob");

const add = (a, b) => a + b;
console.log(add(10, 5));`,
        challenge: {
          prompt: 'Define a function called `sayHi` that prints "Hi there!" when called, then call it.',
          hint: 'function sayHi() { console.log("Hi there!"); } then sayHi();',
          testFn: (output) => output.trim() === 'Hi there!',
        }
      },
      {
        id: 'js-4-2',
        title: 'Return Values & Scope',
        xp: 45,
        theory: `## Return Values & Variable Scope 📤

### Return values
\`\`\`javascript
function square(n) {
  return n * n;
}

console.log(square(5));     // 25
console.log(square(3) + 1); // 10
\`\`\`

### Multiple returns (early exit)
\`\`\`javascript
function checkAge(age) {
  if (age >= 18) {
    return "Adult";
  }
  return "Minor"; // Only reaches here if age < 18
}

console.log(checkAge(20)); // Adult
console.log(checkAge(15)); // Minor
\`\`\`

### Scope — where variables live
\`\`\`javascript
const globalVar = "I'm everywhere!";

function myFunction() {
  const localVar = "I'm only inside this function";
  console.log(globalVar); // Works fine
  console.log(localVar);  // Works fine
}

myFunction();
// console.log(localVar); // ERROR — localVar doesn't exist here
\`\`\``,
        starterCode: `function multiply(a, b) {
  return a * b;
}

const result = multiply(6, 7);
console.log(result);

function isEven(num) {
  return num % 2 === 0;
}
console.log(isEven(4));  // true
console.log(isEven(7));  // false`,
        challenge: {
          prompt: 'Write a function `double(n)` that returns `n * 2`. Call it with 5 and print the result.',
          hint: 'function double(n) { return n * 2; } then console.log(double(5));',
          testFn: (output) => output.trim() === '10',
        }
      }
    ]
  },

  // ─── MODULE 5: Arrays & Objects ───────────────────────────────────────────
  {
    id: 'js-module-5',
    title: 'Arrays & Objects',
    icon: '📦',
    color: 'from-rose-500 to-pink-500',
    description: 'Store and work with collections of data using arrays and objects.',
    lessons: [
      {
        id: 'js-5-1',
        title: 'Arrays',
        xp: 40,
        theory: `## Arrays — Ordered Collections 📋

An **array** stores multiple values in a single variable:

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"];
const numbers = [1, 2, 3, 4, 5];
\`\`\`

### Accessing items (0-indexed)
\`\`\`javascript
const fruits = ["apple", "banana", "cherry"];
console.log(fruits[0]);  // apple
console.log(fruits[1]);  // banana
console.log(fruits[fruits.length - 1]); // cherry (last)
\`\`\`

### Useful array methods
\`\`\`javascript
fruits.push("grape");         // Add to end
fruits.pop();                 // Remove from end
console.log(fruits.length);   // Number of items
console.log(fruits.includes("apple")); // true
\`\`\`

### forEach — loop over array
\`\`\`javascript
fruits.forEach(fruit => {
  console.log(fruit);
});
\`\`\`

### map — transform array
\`\`\`javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
\`\`\``,
        starterCode: `const colors = ["red", "green", "blue"];

console.log(colors[0]);
console.log("Length:", colors.length);

colors.push("yellow");
console.log("After push:", colors);

colors.forEach(color => console.log(color));`,
        challenge: {
          prompt: 'Create an array called `animals` with 3 animals, then print the length of the array.',
          hint: 'const animals = ["cat", "dog", "bird"]; console.log(animals.length);',
          testFn: (output) => output.trim() === '3',
        }
      },
      {
        id: 'js-5-2',
        title: 'Objects',
        xp: 45,
        theory: `## Objects — Key-Value Pairs 🔑

An **object** stores related data as **key: value** pairs:

\`\`\`javascript
const person = {
  name: "Alice",
  age: 25,
  city: "London"
};
\`\`\`

### Accessing properties
\`\`\`javascript
console.log(person.name);      // Alice (dot notation)
console.log(person["age"]);    // 25 (bracket notation)
\`\`\`

### Adding and updating
\`\`\`javascript
person.email = "alice@example.com"; // Add new property
person.age = 26;                    // Update existing
\`\`\`

### Object methods (functions inside objects)
\`\`\`javascript
const car = {
  brand: "Tesla",
  speed: 0,
  accelerate: function() {
    this.speed += 10;
    console.log(\`Speed: \${this.speed}\`);
  }
};

car.accelerate(); // Speed: 10
\`\`\`

### Looping over object keys
\`\`\`javascript
for (const key in person) {
  console.log(\`\${key}: \${person[key]}\`);
}
\`\`\``,
        starterCode: `const book = {
  title: "JavaScript 101",
  author: "Jane Doe",
  pages: 350
};

console.log(book.title);
console.log(\`By: \${book.author}\`);
console.log(\`Pages: \${book.pages}\`);`,
        challenge: {
          prompt: 'Create an object `car` with keys "brand" and "year". Print the brand using dot notation.',
          hint: 'const car = { brand: "Toyota", year: 2022 }; console.log(car.brand);',
          testFn: (output) => output.trim().length > 0,
        }
      }
    ]
  },

  // ─── MODULE 6: Mini Project ───────────────────────────────────────────────
  {
    id: 'js-module-6',
    title: 'Mini Project',
    icon: '🚀',
    color: 'from-amber-500 to-yellow-400',
    description: 'Put it all together! Build a simple grade calculator using everything you\'ve learned.',
    lessons: [
      {
        id: 'js-6-1',
        title: 'Project: Grade Calculator',
        xp: 100,
        theory: `## 🎉 Your First Real JavaScript Program!

You've learned variables, conditionals, loops, functions, and objects. Now let's combine them to build a **grade calculator**!

### What we'll build
A function that takes an array of test scores, calculates the average, and returns the letter grade.

### The plan
1. Create an array of scores
2. Write a function to calculate the average
3. Write a function to convert the average to a grade
4. Print the result using template literals

### Here's the full program:
\`\`\`javascript
function getAverage(scores) {
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

function getGrade(average) {
  if (average >= 90) return "A";
  else if (average >= 80) return "B";
  else if (average >= 70) return "C";
  else if (average >= 60) return "D";
  else return "F";
}

const scores = [85, 92, 78, 95, 88];
const average = getAverage(scores);
const grade = getGrade(average);

console.log(\`Average: \${average.toFixed(1)}\`);
console.log(\`Grade: \${grade}\`);
\`\`\`

This uses **arrays**, **functions**, **if/else**, and **template literals** all together!`,
        starterCode: `function getAverage(scores) {
  let total = 0;
  for (const score of scores) {
    total += score;
  }
  return total / scores.length;
}

function getGrade(average) {
  if (average >= 90) return "A";
  else if (average >= 80) return "B";
  else if (average >= 70) return "C";
  else if (average >= 60) return "D";
  else return "F";
}

const scores = [85, 92, 78, 95, 88];
const average = getAverage(scores);
const grade = getGrade(average);

console.log(\`Average: \${average.toFixed(1)}\`);
console.log(\`Grade: \${grade}\`);`,
        challenge: {
          prompt: 'Run the starter code. It should print the average and grade. Make sure your output contains "Grade:".',
          hint: 'Just run the starter code as-is! It\'s already complete.',
          testFn: (output) => output.toLowerCase().includes('grade:'),
        }
      }
    ]
  }
]

export const getAllJSLessonIds = () => {
  return jsModules.flatMap(m => m.lessons.map(l => l.id))
}

export const getJSLesson = (moduleId, lessonId) => {
  const module = jsModules.find(m => m.id === moduleId)
  if (!module) return null
  return module.lessons.find(l => l.id === lessonId) || null
}

export const getJSModuleProgress = (moduleId, completedLessons) => {
  const module = jsModules.find(m => m.id === moduleId)
  if (!module) return { completed: 0, total: 0 }
  const completed = module.lessons.filter(l => completedLessons[l.id]).length
  return { completed, total: module.lessons.length }
}

export const isJSModuleUnlocked = (moduleIndex, completedLessons) => {
  if (moduleIndex === 0) return true
  const prevModule = jsModules[moduleIndex - 1]
  return prevModule.lessons.every(l => completedLessons[l.id])
}
