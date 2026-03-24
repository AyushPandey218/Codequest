/**
 * Python Beginner Lessons Data
 * 6 modules covering Python from scratch
 */

export const pythonModules = [
  // ─── MODULE 1: Getting Started ────────────────────────────────────────────
  {
    id: 'module-1',
    title: 'Getting Started',
    icon: '🐣',
    color: 'from-blue-500 to-cyan-500',
    description: 'Print output, understand variables, and explore Python\'s basic data types.',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Your First Line of Code',
        xp: 20,
        theory: `## Hello, Python! 👋

Python is one of the most beginner-friendly programming languages in the world. It reads almost like plain English, which makes it perfect for learning to code.

### The print() function

The most fundamental thing you can do in Python is **display output** to the screen. We use the \`print()\` function for this:

\`\`\`python
print("Hello, World!")
\`\`\`

This tells Python: *"print the text inside the quotes to the screen."*

### Why quotes?
Text in Python is called a **string**. You wrap strings in either single \`''\` or double \`""\` quotes — both work the same way.

\`\`\`python
print("Hello!")      # Using double quotes
print('Hello!')      # Using single quotes — same result!
\`\`\`

### Comments
Lines starting with \`#\` are **comments** — Python ignores them. They are notes for you (or other programmers) to explain what the code does.`,
        starterCode: `# This is your first Python program!
# Press Run to see what happens

print("Hello, World!")`,
        challenge: {
          prompt: 'Print the message **"I love coding!"** (exactly as shown, with the exclamation mark).',
          hint: 'Use print() and wrap the text in quotes. Make sure the text matches exactly!',
          testFn: (output) => output.trim() === 'I love coding!',
        }
      },
      {
        id: 'lesson-1-2',
        title: 'Variables — Labelling Your Data',
        xp: 25,
        theory: `## Variables 📦

A **variable** is like a labelled box where you store data. You give it a name, and Python remembers the value for you.

### Creating a variable
\`\`\`python
name = "Alice"
age = 25
\`\`\`

The \`=\` sign means **"store this value in this variable"** (not equals like in maths!).

### Using variables
\`\`\`python
name = "Alice"
print(name)        # Output: Alice
print("Hi, " + name + "!")  # Output: Hi, Alice!
\`\`\`

### Variable naming rules
- Use only letters, numbers, and underscores \`_\`
- Cannot start with a number
- Names are case-sensitive: \`Name\` and \`name\` are different!

\`\`\`python
my_name = "Bob"    # ✅ Good
myName = "Bob"     # ✅ Also fine (camelCase)
2name = "Bob"      # ❌ Cannot start with a number
\`\`\``,
        starterCode: `# Create some variables and print them
name = "Alice"
age = 25

print(name)
print(age)
print("Hello, " + name + "!")`,
        challenge: {
          prompt: 'Create a variable called `city` that stores the name of any city, then print it.',
          hint: 'Remember: city = "your city name" then print(city)',
          testFn: (output) => output.trim().length > 0,
        }
      },
      {
        id: 'lesson-1-3',
        title: 'Data Types — What Kind of Data?',
        xp: 30,
        theory: `## Data Types 🔢

Python has different **types** of data. The three most important ones for beginners are:

### 1. Strings (text)
\`\`\`python
greeting = "Hello, World!"
language = 'Python'
\`\`\`

### 2. Integers (whole numbers)
\`\`\`python
age = 25
score = 100
year = 2024
\`\`\`

### 3. Floats (decimal numbers)
\`\`\`python
pi = 3.14159
price = 9.99
temperature = -3.5
\`\`\`

### Checking the type
You can ask Python what type something is using \`type()\`:
\`\`\`python
print(type("hello"))   # <class 'str'>
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
\`\`\`

### Mixing types in print
Use \`str()\` to convert numbers to text when combining them:
\`\`\`python
age = 25
print("I am " + str(age) + " years old.")
\`\`\``,
        starterCode: `# Explore different data types
name = "Alex"
age = 18
height = 5.9

print("Name:", name)
print("Age:", age)
print("Height:", height)
print("Type of name:", type(name))`,
        challenge: {
          prompt: 'Create three variables: `score` (an integer), `average` (a float), and `player` (a string). Print all three.',
          hint: 'Example: score = 95, average = 87.5, player = "Alice"',
          testFn: (output) => output.trim().split('\n').length >= 3,
        }
      }
    ]
  },

  // ─── MODULE 2: Making Decisions ───────────────────────────────────────────
  {
    id: 'module-2',
    title: 'Making Decisions',
    icon: '🔀',
    color: 'from-purple-500 to-pink-500',
    description: 'Learn how to write code that makes choices using if, elif, and else.',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'If Statements',
        xp: 25,
        theory: `## Making Decisions with if 🤔

Programs need to make decisions. Python uses **if statements** to run code only when a condition is true.

### Basic if
\`\`\`python
temperature = 30

if temperature > 25:
    print("It's hot outside!")
\`\`\`

⚠️ **Indentation matters!** The indented line only runs if the condition is \`True\`. Python uses 4 spaces (or a tab) to group code.

### if...else
\`\`\`python
age = 16

if age >= 18:
    print("You can vote!")
else:
    print("You're too young to vote.")
\`\`\`

### Comparison operators
| Operator | Meaning |
|----------|---------|
| \`==\` | Equal to |
| \`!=\` | Not equal to |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater than or equal to |
| \`<=\` | Less than or equal to |`,
        starterCode: `age = 20

if age >= 18:
    print("Adult")
else:
    print("Minor")`,
        challenge: {
          prompt: 'Write code that prints "Positive" if the variable `num = 7` is greater than 0, otherwise prints "Not positive".',
          hint: 'Set num = 7, then use if num > 0:',
          testFn: (output) => output.trim().toLowerCase().includes('positive'),
        }
      },
      {
        id: 'lesson-2-2',
        title: 'elif — Multiple Choices',
        xp: 30,
        theory: `## elif — More Than Two Options 🌈

When you have more than two outcomes, use \`elif\` (short for "else if"):

\`\`\`python
score = 75

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")
\`\`\`

Python checks each condition **in order** — the first one that's \`True\` runs, and the rest are skipped.

### And / Or
You can combine conditions:
\`\`\`python
age = 25
has_id = True

if age >= 18 and has_id:
    print("Welcome!")

if age < 13 or age > 65:
    print("Special pricing applies.")
\`\`\``,
        starterCode: `score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")`,
        challenge: {
          prompt: 'Set `temp = 15` and print "Cold" if below 10, "Warm" if between 10–25, or "Hot" if above 25.',
          hint: 'Use if temp < 10, elif temp <= 25, else.',
          testFn: (output) => output.trim().toLowerCase() === 'warm',
        }
      }
    ]
  },

  // ─── MODULE 3: Loops ──────────────────────────────────────────────────────
  {
    id: 'module-3',
    title: 'Repeating Actions',
    icon: '🔁',
    color: 'from-emerald-500 to-teal-500',
    description: 'Use for and while loops to repeat actions without writing the same code over and over.',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'For Loops',
        xp: 30,
        theory: `## For Loops 🔄

A **for loop** repeats code a set number of times, or for each item in a collection.

### Looping with range()
\`\`\`python
for i in range(5):
    print(i)
# Output: 0, 1, 2, 3, 4
\`\`\`

\`range(5)\` generates numbers from 0 up to (but not including) 5.

### Custom range
\`\`\`python
for i in range(1, 6):
    print(i)
# Output: 1, 2, 3, 4, 5
\`\`\`

### Looping over a list
\`\`\`python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
\`\`\`

### Using the loop variable
\`\`\`python
for i in range(1, 6):
    print(i, "x", 3, "=", i * 3)
# Prints the 3 times table!
\`\`\``,
        starterCode: `# Print numbers 1 to 5
for i in range(1, 6):
    print(i)`,
        challenge: {
          prompt: 'Use a for loop to print the numbers 1 through 10, each on its own line.',
          hint: 'Use range(1, 11) — remember the end is exclusive!',
          testFn: (output) => {
            const lines = output.trim().split('\n').map(l => l.trim());
            return lines.length === 10 && lines[0] === '1' && lines[9] === '10';
          },
        }
      },
      {
        id: 'lesson-3-2',
        title: 'While Loops',
        xp: 35,
        theory: `## While Loops ⏳

A **while loop** keeps running as long as a condition is \`True\`:

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count += 1   # count = count + 1
\`\`\`

⚠️ **Warning:** Always make sure the condition eventually becomes \`False\`, otherwise you create an **infinite loop** that runs forever!

### When to use while vs for?
- Use **for** when you know how many times to repeat (e.g., 10 times)
- Use **while** when you repeat until a condition changes (e.g., until user quits)

### Break and Continue
\`\`\`python
for i in range(10):
    if i == 5:
        break      # Stops the loop entirely
    print(i)

for i in range(10):
    if i % 2 == 0:
        continue   # Skips to the next iteration
    print(i)       # Only prints odd numbers
\`\`\``,
        starterCode: `count = 1

while count <= 5:
    print("Count:", count)
    count += 1

print("Done!")`,
        challenge: {
          prompt: 'Use a while loop to print "Hello" exactly 3 times.',
          hint: 'Start with count = 0, loop while count < 3, print "Hello", then increment count.',
          testFn: (output) => {
            const lines = output.trim().split('\n').filter(l => l.trim() === 'Hello');
            return lines.length === 3;
          },
        }
      }
    ]
  },

  // ─── MODULE 4: Working with Data ──────────────────────────────────────────
  {
    id: 'module-4',
    title: 'Working with Data',
    icon: '📦',
    color: 'from-orange-500 to-amber-500',
    description: 'Store and access collections of data using lists and dictionaries.',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'Lists',
        xp: 35,
        theory: `## Lists — Collections of Items 📋

A **list** lets you store multiple values in a single variable:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["Alice", 25, True, 3.14]
\`\`\`

### Accessing items (indexing)
Lists start at index **0**:
\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])   # apple
print(fruits[1])   # banana
print(fruits[-1])  # cherry (last item)
\`\`\`

### Useful list operations
\`\`\`python
fruits.append("grape")   # Add to end
fruits.remove("banana")  # Remove by value
print(len(fruits))       # Number of items
\`\`\`

### Looping over a list
\`\`\`python
for fruit in fruits:
    print(fruit)
\`\`\``,
        starterCode: `# Create and use a list
colors = ["red", "green", "blue"]

print(colors[0])     # First item
print(len(colors))   # How many items?

colors.append("yellow")
print(colors)        # All items`,
        challenge: {
          prompt: 'Create a list called `animals` with 3 animals, then print the number of animals in the list using len().',
          hint: 'animals = ["cat", "dog", "bird"] then print(len(animals))',
          testFn: (output) => output.trim() === '3',
        }
      },
      {
        id: 'lesson-4-2',
        title: 'Dictionaries',
        xp: 40,
        theory: `## Dictionaries — Key-Value Pairs 🔑

A **dictionary** stores data as **key: value** pairs, like a real dictionary where you look up a word (key) to get its definition (value):

\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "London"
}
\`\`\`

### Accessing values
\`\`\`python
print(person["name"])   # Alice
print(person["age"])    # 25
\`\`\`

### Adding and updating
\`\`\`python
person["email"] = "alice@example.com"  # Add new key
person["age"] = 26                     # Update existing
\`\`\`

### Looping over a dictionary
\`\`\`python
for key, value in person.items():
    print(key, ":", value)
\`\`\``,
        starterCode: `# Create a dictionary about a book
book = {
    "title": "Python 101",
    "author": "John Doe",
    "pages": 300
}

print(book["title"])
print(book["author"])`,
        challenge: {
          prompt: 'Create a dictionary `car` with keys "brand" and "year". Print the brand.',
          hint: 'car = {"brand": "Toyota", "year": 2022} then print(car["brand"])',
          testFn: (output) => output.trim().length > 0,
        }
      }
    ]
  },

  // ─── MODULE 5: Functions ──────────────────────────────────────────────────
  {
    id: 'module-5',
    title: 'Functions',
    icon: '🔧',
    color: 'from-indigo-500 to-violet-500',
    description: 'Write reusable blocks of code with functions — the cornerstone of good programming.',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Defining and Calling Functions',
        xp: 40,
        theory: `## Functions — Reusable Code Blocks 🧩

A **function** is a named block of code you can run again and again. Instead of copying code, you write it once and **call** it by name.

### Defining a function
\`\`\`python
def greet():
    print("Hello, World!")
\`\`\`

\`def\` keyword means "define a function". The colon and indentation work just like with \`if\` and \`for\`.

### Calling a function
\`\`\`python
greet()   # Output: Hello, World!
greet()   # You can call it multiple times!
\`\`\`

### Functions with parameters
\`\`\`python
def greet(name):
    print("Hello, " + name + "!")

greet("Alice")  # Hello, Alice!
greet("Bob")    # Hello, Bob!
\`\`\`

Parameters let you pass data **into** the function.`,
        starterCode: `def greet(name):
    print("Hello, " + name + "!")

greet("Alice")
greet("Bob")`,
        challenge: {
          prompt: 'Define a function called `say_hi` that prints "Hi there!" when called, then call it.',
          hint: 'def say_hi(): then print("Hi there!") then call say_hi()',
          testFn: (output) => output.trim() === 'Hi there!',
        }
      },
      {
        id: 'lesson-5-2',
        title: 'Return Values',
        xp: 45,
        theory: `## Returning Values from Functions 📤

Functions can **give back** a result using the \`return\` keyword:

\`\`\`python
def add(a, b):
    return a + b

result = add(3, 4)
print(result)   # 7
\`\`\`

### Why use return?
The function computes something and **hands it back** to whoever called it. You can then use that value anywhere.

\`\`\`python
def square(n):
    return n * n

print(square(5))         # 25
print(square(3) + 1)     # 10
total = square(4) + square(3)
print(total)             # 25
\`\`\`

### Functions stop at return
\`\`\`python
def check_age(age):
    if age >= 18:
        return "Adult"
    return "Minor"

print(check_age(20))   # Adult
print(check_age(15))   # Minor
\`\`\``,
        starterCode: `def multiply(a, b):
    return a * b

result = multiply(6, 7)
print(result)`,
        challenge: {
          prompt: 'Write a function `double(n)` that returns the number multiplied by 2. Call it with 5 and print the result.',
          hint: 'def double(n): return n * 2 then print(double(5))',
          testFn: (output) => output.trim() === '10',
        }
      }
    ]
  },

  // ─── MODULE 6: Mini Project ───────────────────────────────────────────────
  {
    id: 'module-6',
    title: 'Mini Project',
    icon: '🚀',
    color: 'from-rose-500 to-orange-500',
    description: 'Put it all together! Build a simple number-guessing game using everything you\'ve learned.',
    lessons: [
      {
        id: 'lesson-6-1',
        title: 'Project: Number Guessing Game',
        xp: 100,
        theory: `## 🎉 Your First Real Python Program!

You've learned variables, conditionals, loops, and functions. Now let's combine them to build something real — a **number guessing game**!

### What we'll build
The computer picks a secret number (we'll hardcode it for now), and the player has 3 attempts to guess it. After each wrong guess, the computer gives a hint.

### The plan
1. Store the secret number in a variable
2. Use a loop to allow multiple guesses
3. Use if/elif/else to compare the guess
4. Print hints and end game appropriately

### Here's the full game:
\`\`\`python
def play_game():
    secret = 42
    attempts = 3
    
    for i in range(attempts):
        guess = int(input("Guess the number: "))
        
        if guess == secret:
            print("🎉 Correct! You win!")
            return
        elif guess < secret:
            print("Too low! Try higher.")
        else:
            print("Too high! Try lower.")
    
    print("Game over! The number was", secret)

play_game()
\`\`\`

### 🧩 Your challenge
Modify the game — change the secret number and the number of attempts, then make sure it still works!`,
        starterCode: `def play_game(secret, max_attempts):
    print("Welcome to the Number Guessing Game!")
    print(f"You have {max_attempts} attempts to guess my number.")
    
    for attempt in range(1, max_attempts + 1):
        print(f"Attempt {attempt}/{max_attempts}")
        
        # For this exercise, we simulate a correct guess
        guess = secret  # Change this to test different guesses!
        
        if guess == secret:
            print("Correct! You win!")
            return True
        elif guess < secret:
            print("Too low!")
        else:
            print("Too high!")
    
    print("Game over! The number was", secret)
    return False

play_game(42, 3)`,
        challenge: {
          prompt: 'Run the starter code. It should print "Correct! You win!" — make sure your code includes that exact message.',
          hint: 'Just run the code as-is! The guess is set equal to secret so it will always be correct.',
          testFn: (output) => output.toLowerCase().includes('correct') || output.toLowerCase().includes('win'),
        }
      }
    ]
  }
]

/**
 * Get all lesson IDs in order
 */
export const getAllLessonIds = () => {
  return pythonModules.flatMap(m => m.lessons.map(l => l.id))
}

/**
 * Get a specific lesson by module and lesson ID
 */
export const getLesson = (moduleId, lessonId) => {
  const module = pythonModules.find(m => m.id === moduleId)
  if (!module) return null
  return module.lessons.find(l => l.id === lessonId) || null
}

/**
 * Get progress stats for a module
 */
export const getModuleProgress = (moduleId, completedLessons) => {
  const module = pythonModules.find(m => m.id === moduleId)
  if (!module) return { completed: 0, total: 0 }
  const completed = module.lessons.filter(l => completedLessons[l.id]).length
  return { completed, total: module.lessons.length }
}

/**
 * Check if a module is unlocked
 * Module 1 always unlocked. Module N unlocked when Module N-1 is fully complete.
 */
export const isModuleUnlocked = (moduleIndex, completedLessons) => {
  if (moduleIndex === 0) return true
  const prevModule = pythonModules[moduleIndex - 1]
  return prevModule.lessons.every(l => completedLessons[l.id])
}
