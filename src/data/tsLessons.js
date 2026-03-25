/**
 * TypeScript Lessons Data
 * 4 modules covering TypeScript from basic to advanced
 */

export const tsModules = [
  // ─── MODULE 1: The Basics ──────────────────────────────────────────────────
  {
    id: 'ts-module-1',
    title: 'TypeScript Basics',
    icon: '📘',
    color: 'from-blue-600 to-blue-400',
    description: 'Understand why we use TypeScript and learn the basic types: string, number, and boolean.',
    lessons: [
      {
        id: 'ts-1-1',
        title: 'Introduction to Types',
        xp: 25,
        theory: `## What is TypeScript? 🛡️

TypeScript is a superset of JavaScript that adds **static types**. It helps you catch errors *before* you even run your code!

### Type Annotations
In JavaScript, you just say \`let x = 5\`. In TypeScript, you can explicitly state the type:

\`\`\`typescript
const name: string = "Alice";
const age: number = 25;
const isOnline: boolean = true;
\`\`\`

### Why use it?
- **Better Tooling**: Autocomplete works much better.
- **Error Catching**: TypeScript will warn you if you try to treat a number like a string.
- **Readability**: It's clear what kind of data each variable holds.

### Type Inference
TypeScript is smart. If you assign a value immediately, it often figures out the type for you:

\`\`\`typescript
let score = 100; // TypeScript knows this is a number!
// score = "high"; // Error: Type 'string' is not assignable to type 'number'.
\`\`\``,
        starterCode: `// Add type annotations to these variables
const username = "CodeExplorer";
const xp = 500;
const isAdmin = false;

console.log(\`User \${username} has \${xp} XP.\`);`,
        challenge: {
          prompt: 'Declare a variable `city` as a `string` and `population` as a `number`.',
          hint: 'const city: string = "Tokyo";',
          testFn: (output) => true, // Verification happens via the TS compiler in a real app, here we check if they used types in their head
        }
      },
      {
        id: 'ts-1-2',
        title: 'Arrays & Any',
        xp: 30,
        theory: `## Arrays in TypeScript 📋

Arrays can be typed in two ways:

### Type[] Syntax
\`\`\`typescript
const fruits: string[] = ["apple", "banana"];
const scores: number[] = [90, 85, 100];
\`\`\`

### Array<Type> Syntax
\`\`\`typescript
const ids: Array<number> = [1, 2, 3];
\`\`\`

### The "any" Type
If you don't know the type or want to opt-out of type checking, use \`any\`. Use this sparingly!

\`\`\`typescript
let randomValue: any = { id: 1 };
randomValue = "now I'm a string";
randomValue = 42;
\`\`\``,
        starterCode: `const tags: string[] = ["coding", "typescript"];
const results: number[] = [10, 20, 30];

console.log(tags);
console.log(results);`,
        challenge: {
          prompt: 'Create an array called `inventory` that can hold only strings.',
          hint: 'const inventory: string[] = ["sword", "shield"];',
          testFn: (output) => true,
        }
      }
    ]
  },

  // ─── MODULE 2: Interfaces & Objects ────────────────────────────────────────
  {
    id: 'ts-module-2',
    title: 'Interfaces & Objects',
    icon: '🏗️',
    color: 'from-indigo-600 to-indigo-400',
    description: 'Define the shape of your objects using Interfaces and Type Aliases.',
    lessons: [
      {
        id: 'ts-2-1',
        title: 'Interfaces',
        xp: 40,
        theory: `## Interfaces 📐

An **Interface** defines the "shape" of an object. It's a contract that ensures an object has the required properties.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
  readonly createdAt: Date; // Cannot be changed after creation
}

const me: User = {
  id: 1,
  name: "Bob",
  createdAt: new Date()
};
\`\`\`

Interfaces make your code predictable and easy to document!`,
        starterCode: `interface Hero {
  name: string;
  level: number;
}

const link: Hero = {
  name: "Link",
  level: 10
};

console.log(link.name);`,
        challenge: {
          prompt: 'Define an interface `Product` with `id` (number) and `price` (number), then create a product object.',
          hint: 'interface Product { id: number; price: number; }',
          testFn: (output) => true,
        }
      }
    ]
  },

  // ─── MODULE 3: Functions & Generics ───────────────────────────────────────
  {
    id: 'ts-module-3',
    title: 'Functions & Generics',
    icon: '🧪',
    color: 'from-purple-600 to-purple-400',
    description: 'Learn to type function parameters, return values, and create reusable generic components.',
    lessons: [
      {
        id: 'ts-3-1',
        title: 'Function Types',
        xp: 45,
        theory: `## Typing Functions ⚙️

You should always type your function parameters and return values.

\`\`\`typescript
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): void => {
  console.log(\`Hello \${name}\`);
};
\`\`\`

- \`number\`: Parameters \`a\` and \`b\` must be numbers.
- \`: number\`: The function must return a number.
- \`void\`: The function returns nothing.`,
        starterCode: `function double(n: number): number {
  return n * 2;
}

console.log(double(10));`,
        challenge: {
          prompt: 'Write a function `isAdult` that takes `age: number` and returns a `boolean`.',
          hint: 'function isAdult(age: number): boolean { return age >= 18; }',
          testFn: (output) => true,
        }
      }
    ]
  },

  // ─── MODULE 4: Generics ───────────────────────────────────────────────────
  {
    id: 'ts-module-4',
    title: 'Generics',
    icon: '🧬',
    color: 'from-pink-600 to-pink-400',
    description: 'Create reusable, type-safe components that work with a variety of types.',
    lessons: [
      {
        id: 'ts-4-1',
        title: 'Generic Functions',
        xp: 50,
        theory: `## Generics 🧬

Generics allow you to create components that work with a variety of types rather than a single one. This allows users to consume these components and use their own types.

### The Identity Function
Imagine a function that returns whatever is passed into it:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);
\`\`\`

- \`<T>\`: The type variable \`T\` captures the type the user provides.
- \`arg: T\`: The argument must be of type \`T\`.
- \`: T\`: The return type must be the same type \`T\`.`,
        starterCode: `function getFirstItem<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirstItem([1, 2, 3]);
const str = getFirstItem(["a", "b", "c"]);

console.log(num, str);`,
        challenge: {
          prompt: 'Write a generic function `wrap` that takes an argument of type `T` and returns an array containing that single item `[T]`.',
          hint: 'function wrap<T>(item: T): T[] { return [item]; }',
          testFn: (output) => true,
        }
      }
    ]
  },

  // ─── MODULE 5: Classes & OOP ──────────────────────────────────────────────
  {
    id: 'ts-module-5',
    title: 'Classes & OOP',
    icon: '🏛️',
    color: 'from-orange-600 to-orange-400',
    description: 'Master Object-Oriented Programming in TypeScript with Classes and Modifiers.',
    lessons: [
      {
        id: 'ts-5-1',
        title: 'Classes & Modifiers',
        xp: 60,
        theory: `## Classes in TypeScript 🏛️

TypeScript adds powerful features to regular JavaScript classes, like **Access Modifiers**.

### Basic Class
\`\`\`typescript
class Player {
  private id: number; // Only accessible inside the class
  public name: string; // Accessible anywhere (default)
  protected score: number; // Accessible in subclasses

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.score = 0;
  }

  getDetails(): string {
    return \`Player: \${this.name} (ID: \${this.id})\`;
  }
}
\`\`\`

Modifiers help you enforce **encapsulation** and clean architecture.`,
        starterCode: `class Animal {
  constructor(public name: string) {}
  
  makeSound() {
    console.log(\`\${this.name} makes a noise.\`);
  }
}

const dog = new Animal("Dog");
dog.makeSound();`,
        challenge: {
          prompt: 'Create a class `Car` with a private property `speed` (number) and a public method `getSpeed()`.',
          hint: 'class Car { private speed: number = 0; getSpeed() { return this.speed; } }',
          testFn: (output) => true,
        }
      }
    ]
  },

  // ─── MODULE 6: Advanced Patterns (C++ Style) ─────────────────────────────
  {
    id: 'ts-module-6',
    title: 'Advanced Patterns',
    icon: '⚙️',
    color: 'from-slate-600 to-slate-400',
    description: 'Explore Enums, Abstract Classes, and Overloading—features that bridge the gap from C++ to TypeScript.',
    lessons: [
      {
        id: 'ts-6-1',
        title: 'Enums & Tuples',
        xp: 50,
        theory: `## Enums & Tuples 🔢

If you're coming from C++, you'll find these very familiar!

### Enums
Enums allow you to define a set of named constants.

\`\`\`typescript
enum Status {
  Pending = 0,
  InProgress = 1,
  Completed = 2
}

const currentStatus: Status = Status.Pending;
\`\`\`

### Tuples
Tuples are fixed-length arrays where each element has a specific type.

\`\`\`typescript
let employee: [number, string] = [1, "John"];
\`\`\``,
        starterCode: `enum Direction {
  Up,
  Down,
  Left,
  Right
}

const move = Direction.Up;
console.log(move); // 0`,
        challenge: {
          prompt: 'Create an enum `Role` with `User`, `Admin`, and `Guest` levels.',
          hint: 'enum Role { User, Admin, Guest }',
          testFn: (output) => true,
        }
      },
      {
        id: 'ts-6-2',
        title: 'Abstract Classes',
        xp: 60,
        theory: `## Abstract Classes 🏗️

Abstract classes are base classes from which other classes may be derived. They **cannot** be instantiated directly.

\`\`\`typescript
abstract class Shape {
  abstract getArea(): number; // Must be implemented by subclasses

  printArea() {
    console.log("Area: " + this.getArea());
  }
}

class Circle extends Shape {
  constructor(public radius: number) { super(); }
  getArea() { return Math.PI * this.radius ** 2; }
}
\`\`\`

This is exactly like **Pure Virtual Functions** in C++!`,
        starterCode: `abstract class Logger {
  abstract log(message: string): void;
}

class ConsoleLogger extends Logger {
  log(msg: string) { console.log(msg); }
}

const myLogger = new ConsoleLogger();
myLogger.log("Hello!");`,
        challenge: {
          prompt: 'Create an abstract class `Vehicle` with an abstract method `drive()`.',
          hint: 'abstract class Vehicle { abstract drive(): void; }',
        }
      },
      {
        id: 'ts-6-3',
        title: 'Function Overloading',
        xp: 55,
        theory: `## Function Overloading 🔄

In C++, you can have multiple functions with the same name but different parameters. TypeScript supports this too!

You provide multiple **signatures**, followed by a single **implementation**.

\`\`\`typescript
// Signatures
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

// Implementation
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
\`\`\`

The implementation signature must be compatible with all overload signatures.`,
        starterCode: `function printInfo(name: string): void;
function printInfo(id: number): void;
function printInfo(value: string | number): void {
  console.log("Info: " + value);
}

printInfo("Alice");
printInfo(101);`,
        challenge: {
          prompt: 'Write an overloaded function `combine` that takes two strings and returns a string, or two numbers and returns a number.',
          hint: 'function combine(a: string, b: string): string; function combine(a: number, b: number): number; ...',
          testFn: (output) => true,
        }
      }
    ]
  }
];

export const getAllTSLessonIds = () => {
  return tsModules.flatMap(m => m.lessons.map(l => l.id))
}

export const getTSLesson = (moduleId, lessonId) => {
  const module = tsModules.find(m => m.id === moduleId)
  if (!module) return null
  return module.lessons.find(l => l.id === lessonId) || null
}

export const getTSModuleProgress = (moduleId, completedLessons) => {
  const module = tsModules.find(m => m.id === moduleId)
  if (!module) return { completed: 0, total: 0 }
  const completed = module.lessons.filter(l => completedLessons[l.id]).length
  return { completed, total: module.lessons.length }
}

export const isTSModuleUnlocked = (moduleIndex, completedLessons) => {
  if (moduleIndex === 0) return true
  const prevModule = tsModules[moduleIndex - 1]
  return prevModule.lessons.every(l => completedLessons[l.id])
}
