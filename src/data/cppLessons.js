/**
 * C++ Beginner Lessons Data
 */

export const cppModules = [
  {
    id: 'module-1',
    title: 'C++ Basics',
    icon: '🏗️',
    color: 'from-blue-600 to-indigo-600',
    description: 'Learn the structure of a C++ program, how to print, and basic variables.',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Hello C++',
        xp: 20,
        theory: `## Welcome to C++! 🚀

C++ is a powerful, high-performance language used for everything from video games to space rockets.

### Program Structure
Every C++ program needs a \`main()\` function. This is where the computer starts reading your code.

\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!";
    return 0;
}
\`\`\`

- \`#include <iostream>\`: This line lets us use "input/output" tools like \`cout\`.
- \`std::cout\`: This stands for "character output". It's how we print text.
- \`return 0;\`: This tells the computer the program finished successfully.
- \`;\`: In C++, **most lines must end with a semicolon**..`,
        starterCode: `#include <iostream>

int main() {
    std::cout << "Hello, CodeQuest!";
    return 0;
}`,
        challenge: {
          prompt: 'Change the message to print **"CPP is fun"**.',
          hint: 'Modify the text inside the quotes. Don\'t forget the semicolon!',
          testFn: (output) => output.trim() === 'CPP is fun',
        }
      },
      {
        id: 'lesson-1-2',
        title: 'Variables and Types',
        xp: 25,
        theory: `## Variables in C++ 📦

C++ is **statically typed**, meaning you must tell the computer what *kind* of data a variable will hold.

### Common Types:
- \`int\`: Integers (whole numbers like 5, -10).
- \`double\`: Decimals (like 3.14, 9.99).
- \`char\`: Single characters (like 'A', 'z').
- \`bool\`: True or false.

\`\`\`cpp
int age = 20;
double price = 19.99;
char grade = 'A';
bool isCoding = true;
\`\`\`

### Printing Variables
You can "chain" things together with \`<<\`:

\`\`\`cpp
std::cout << "Age: " << age;
\`\`\``,
        starterCode: `#include <iostream>

int main() {
    int score = 100;
    std::cout << "Your score is: " << score;
    return 0;
}`,
        challenge: {
          prompt: 'Create an integer variable called `coins` with value 50 and print it.',
          hint: 'int coins = 50; then std::cout << coins;',
          testFn: (output) => output.trim().includes('50'),
        }
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Making Decisions',
    icon: '🚦',
    color: 'from-orange-500 to-red-500',
    description: 'Make your C++ programs smart using if statements and logical operators.',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'If Statements',
        xp: 30,
        theory: `## If Statements 🌲

Just like in other languages, C++ uses \`if\` and \`else\` to make decisions.

\`\`\`cpp
int temp = 30;

if (temp > 25) {
    std::cout << "Hot!";
} else {
    std::cout << "Cool!";
}
\`\`\`

Note that the condition must be inside **parentheses** \`()\`, and the code to run is inside **curly braces** \`{}\`.`,
        starterCode: `#include <iostream>

int main() {
    int age = 20;
    if (age >= 18) {
        std::cout << "Adult";
    } else {
        std::cout << "Minor";
    }
    return 0;
}`,
        challenge: {
          prompt: 'Check if `x = 10` is equal to 10. If yes, print "Match".',
          hint: 'Use the double equals \`==\` for comparison.',
          testFn: (output) => output.trim() === 'Match',
        }
      },
      {
        id: 'lesson-2-2',
        title: 'Logical Operators',
        xp: 35,
        theory: `## Logical Operators 🧠

You can combine conditions using:
- \`&&\`: AND (Both must be true)
- \`||\`: OR (At least one must be true)
- \`!\`: NOT (Flips the boolean)

\`\`\`cpp
int age = 20;
bool hasID = true;

if (age >= 18 && hasID) {
    std::cout << "Allowed";
}
\`\`\``,
        starterCode: `#include <iostream>

int main() {
    bool isRainy = true;
    bool hasUmbrella = true;

    if (isRainy && hasUmbrella) {
        std::cout << "Go out";
    } else {
        std::cout << "Stay home";
    }
    return 0;
}`,
        challenge: {
          prompt: 'Print "Win" if `score = 85` is greater than 80 AND `lives > 0`.',
          hint: 'if (score > 80 && lives > 0)',
          testFn: (output) => output.trim() === 'Win',
        }
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Loops',
    icon: '🔁',
    color: 'from-green-500 to-teal-500',
    description: 'Repeat actions efficiently using for and while loops.',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'For Loops',
        xp: 35,
        theory: `## For Loops 🔄

A \`for\` loop runs code a specific number of times.

\`\`\`cpp
for (int i = 0; i < 5; i++) {
    std::cout << i << " ";
}
// Prints: 0 1 2 3 4
\`\`\`

1. \`int i = 0\`: Start value.
2. \`i < 5\`: Condition (Keep going while true).
3. \`i++\`: Update (Add 1 to i each time).`,
        starterCode: `#include <iostream>

int main() {
    for (int i = 1; i <= 3; i++) {
        std::cout << "Hello ";
    }
    return 0;
}`,
        challenge: {
          prompt: 'Use a for loop to print numbers from **1 to 5** (inclusive).',
          hint: 'for (int i = 1; i <= 5; i++)',
          testFn: (output) => output.trim().replace(/\s+/g, '') === '12345',
        }
      },
      {
        id: 'lesson-3-2',
        title: 'While Loops',
        xp: 35,
        theory: `## While Loops ⏳

A \`while\` loop runs as long as a condition is true.

\`\`\`cpp
int count = 1;
while (count <= 5) {
    std::cout << count;
    count++;
}
\`\`\``,
        starterCode: `#include <iostream>

int main() {
    int x = 3;
    while (x > 0) {
        std::cout << x << " ";
        x--;
    }
    return 0;
}`,
        challenge: {
          prompt: 'Use a while loop to print "Hi" exactly 3 times.',
          hint: 'Use a counter variable starting at 0.',
          testFn: (output) => output.trim().split('Hi').length === 4,
        }
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Collections',
    icon: '📦',
    color: 'from-purple-500 to-pink-500',
    description: 'Work with arrays and strings to manage lists of data.',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'Arrays',
        xp: 40,
        theory: `## Arrays 📋

An array stores multiple values of the same type in a single variable.

\`\`\`cpp
int scores[3] = {90, 85, 95};
std::cout << scores[0]; // Prints 90
\`\`\`

Remember: Arrays in C++ are **0-indexed**!`,
        starterCode: `#include <iostream>

int main() {
    int nums[] = {10, 20, 30};
    std::cout << nums[1];
    return 0;
}`,
        challenge: {
          prompt: 'Create an array of 4 integers and print the very last element.',
          hint: 'The last element of a 4-item array is at index 3.',
          testFn: (output) => output.trim().length > 0,
        }
      },
      {
        id: 'lesson-4-2',
        title: 'Strings',
        xp: 35,
        theory: `## Strings 🧵

To use strings in C++, you should include the string library.

\`\`\`cpp
#include <string>

std::string name = "Alice";
std::cout << name.length(); // Prints 5
\`\`\``,
        starterCode: `#include <iostream>
#include <string>

int main() {
    std::string greeting = "Hello";
    std::cout << greeting + " World";
    return 0;
}`,
        challenge: {
          prompt: 'Create a string variable `lang` with value "C++" and print it.',
          hint: 'std::string lang = "C++";',
          testFn: (output) => output.trim() === 'C++',
        }
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Functions',
    icon: '🔧',
    color: 'from-amber-500 to-yellow-500',
    description: 'Break your code into reusable blocks with functions.',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Basic Functions',
        xp: 45,
        theory: `## Functions 🧩

Functions let you group code and give it a name to use later.

\`\`\`cpp
void greet() {
    std::cout << "Hi!";
}

int main() {
    greet();
    return 0;
}
\`\`\`

\`void\` means the function doesn't return any value.`,
        starterCode: `#include <iostream>

void sayHello() {
    std::cout << "Hello Function";
}

int main() {
    sayHello();
    return 0;
}`,
        challenge: {
          prompt: 'Define a function called `ping` that prints "pong" when called, then call it from main.',
          hint: 'void ping() { std::cout << "pong"; }',
          testFn: (output) => output.trim() === 'pong',
        }
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Project',
    icon: '🚀',
    color: 'from-red-600 to-rose-600',
    description: 'Put it all together! Build a simple calculator.',
    lessons: [
      {
        id: 'lesson-6-1',
        title: 'Mini Calculator',
        xp: 100,
        theory: `## 🎉 Final Project!

You've learned printing, variables, conditions, loops, and functions. Let's combine them into a simple **Addition Machine**.

\`\`\`cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 5, y = 10;
    std::cout << "Result: " << add(x, y);
    return 0;
}
\`\`\``,
        starterCode: `#include <iostream>

// Write an add function here

int main() {
    int result = 5 + 10; // Use your function instead!
    std::cout << "Total: " << result;
    return 0;
}`,
        challenge: {
          prompt: 'Write a function \`int multiply(int a, int b)\` that returns a * b, then use it in main to multiply 6 * 7 and print the result.',
          hint: 'return a * b;',
          testFn: (output) => output.includes('42'),
        }
      }
    ]
  },
  {
    id: 'module-7',
    title: 'Pointers & Memory',
    icon: '🧠',
    color: 'from-cyan-600 to-blue-700',
    description: 'Master memory addresses and pointers — the heart of C++ power.',
    lessons: [
      {
        id: 'lesson-7-1',
        title: 'Memory Addresses',
        xp: 50,
        theory: `## Addresses & Pointers 🤖

Every variable is stored at a specific "address" in your memory. 

### The Address-of Operator (&)
You can find where a variable lives using \`&\`:

\`\`\`cpp
int age = 20;
std::cout << &age; // Prints something like 0x7ffd...
\`\`\`

### Pointers (*)
A **pointer** is a variable that stores a memory address.

\`\`\`cpp
int age = 20;
int* ptr = &age; // ptr now "points" to age
\`\`\`

- \`int*\` means "pointer to an integer".`,
        starterCode: `#include <iostream>

int main() {
    int secret = 42;
    std::cout << "Address: " << &secret;
    return 0;
}`,
        challenge: {
          prompt: 'Create an int \`val = 10\` and a pointer \`ptr\` storing its address. Print the pointer.',
          hint: 'int* ptr = &val;',
          testFn: (output) => output.includes('0x'),
        }
      },
      {
        id: 'lesson-7-2',
        title: 'Dereferencing',
        xp: 55,
        theory: `## Dereferencing 🗝️

Use the **dereference operator** (\`*\`) to get the value a pointer points to.

\`\`\`cpp
int age = 20;
int* ptr = &age;

std::cout << *ptr; // Prints 20
*ptr = 21;         // Changes age to 21!
\`\`\``,
        starterCode: `#include <iostream>

int main() {
    int score = 100;
    int* p = &score;
    std::cout << "Value: " << *p;
    return 0;
}`,
        challenge: {
          prompt: 'Use the pointer \`p\` to change \`score\` to **500**, then print \`score\`.',
          hint: '*p = 500;',
          testFn: (output) => output.includes('500'),
        }
      }
    ]
  },
  {
    id: 'module-8',
    title: 'Object-Oriented C++',
    icon: '🏛️',
    color: 'from-indigo-600 to-purple-700',
    description: 'Learn Classes, Encapsulation, and Constructors.',
    lessons: [
      {
        id: 'lesson-8-1',
        title: 'Classes & Objects',
        xp: 60,
        theory: `## Classes 🏗️

A class is a blueprint for objects. It groups data and functions.

\`\`\`cpp
class Player {
public:
    std::string name;
    void sayHi() {
        std::cout << "Hi, I am " << name;
    }
};
\`\`\`

- \`public\`: Members can be accessed from outside.`,
        starterCode: `#include <iostream>
#include <string>

class Robot {
public:
    std::string model;
    void beep() { std::cout << "Beep!"; }
};

int main() {
    Robot r1;
    r1.model = "X-100";
    r1.beep();
    return 0;
}`,
        challenge: {
          prompt: 'Create a class \`Car\` with a public string \`brand\`. Set it to "Tesla" in main and print it.',
          hint: 'Car myCar; myCar.brand = "Tesla";',
          testFn: (output) => output.includes('Tesla'),
        }
      }
    ]
  },
  {
    id: 'module-9',
    title: 'STL Power',
    icon: '⚡',
    color: 'from-teal-600 to-emerald-700',
    description: 'Use the STL for dynamic arrays and maps.',
    lessons: [
      {
        id: 'lesson-9-1',
        title: 'Vectors',
        xp: 50,
        theory: `## std::vector 🛹

Vectors are dynamic arrays that can grow!

\`\`\`cpp
#include <vector>

std::vector<int> nums = {1, 2};
nums.push_back(3); 
std::cout << nums.size(); // 3
\`\`\``,
        starterCode: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> items;
    items.push_back("Sword");
    std::cout << items[0];
    return 0;
}`,
        challenge: {
          prompt: 'Create a vector of ints, add 3 numbers, and print the \`.size()\`.',
          hint: 'v.push_back(10);',
          testFn: (output) => output.includes('3'),
        }
      }
    ]
  },
  {
    id: 'module-10',
    title: 'Final Mastery',
    icon: '👑',
    color: 'from-rose-600 to-red-800',
    description: 'Deep dive into recursion and complex logic.',
    lessons: [
      {
        id: 'lesson-10-1',
        title: 'Recursion',
        xp: 80,
        theory: `## Recursion 🌀

A function calling itself. Must have a base case!

\`\`\`cpp
int sum(int n) {
    if (n == 0) return 0;
    return n + sum(n - 1);
}
\`\`\``,
        starterCode: `#include <iostream>

int sum(int n) {
    if (n == 0) return 0;
    return n + sum(n - 1);
}

int main() {
    std::cout << sum(5);
    return 0;
}`,
        challenge: {
          prompt: 'Calculate the sum of numbers up to **10** using recursion and print it.',
          hint: 'sum(10) is 55.',
          testFn: (output) => output.includes('55'),
        }
      }
    ]
  }
];

export const getAllLessonIds = () => cppModules.flatMap(m => m.lessons.map(l => l.id));

export const getCPPModuleProgress = (moduleId, completedLessons) => {
  const module = cppModules.find(m => m.id === moduleId)
  if (!module) return { completed: 0, total: 0 }
  const completed = module.lessons.filter(l => completedLessons[l.id]).length
  return { completed, total: module.lessons.length }
}

export const isCPPModuleUnlocked = (moduleIndex, completedLessons) => {
  if (moduleIndex === 0) return true
  const prevModule = cppModules[moduleIndex - 1]
  return prevModule.lessons.every(l => completedLessons[l.id])
}
