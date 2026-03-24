/**
 * Java Beginner Lessons Data
 */

export const javaModules = [
  {
    id: 'java-module-1',
    title: 'Java Basics',
    icon: '☕',
    color: 'from-orange-600 to-red-600',
    description: 'Structure, Printing, and Variables in Java.',
    lessons: [
      {
        id: 'java-lesson-1-1',
        title: 'Hello Java',
        xp: 20,
        theory: `## Welcome to Java! ☕

Java is a classic language known for being "Write Once, Run Anywhere". It's widely used in Android apps and big corporate systems.

### The Main Class
In Java, everything must be inside a **class**. The specific method that starts your program is the \`main\` method.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
\`\`\`

- \`public class Main\`: Name of our class.
- \`System.out.println(...)\`: This is how Java prints to the screen.
- \`;\`: Semicolons are required at the end of each statement!`,
        starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeQuest!");
    }
}`,
        challenge: {
          prompt: 'Change the message to print **"Java is powerful"**.',
          hint: 'Update the text inside the quotes in System.out.println().',
          testFn: (output) => output.trim() === 'Java is powerful',
        }
      },
      {
        id: 'java-lesson-1-2',
        title: 'Variables and Types',
        xp: 25,
        theory: `## Variables in Java 📦

Java is **statically typed**, meaning every variable must have a declared type.

### Common Types:
- \`int\`: Whole numbers (10, -5).
- \`double\`: Decimal numbers (3.14).
- \`boolean\`: true or false.
- \`String\`: Text (wrapped in double quotes).

\`\`\`java
int age = 25;
double price = 19.99;
boolean isCoding = true;
String name = "Alice";
\`\`\`

### Printing Variables
\`\`\`java
System.out.println("Age: " + age);
\`\`\``,
        starterCode: `public class Main {
    public static void main(String[] args) {
        int score = 100;
        System.out.println("Score: " + score);
    }
}`,
        challenge: {
          prompt: 'Create a String variable called \`hero\` with value "CodeQuest" and print it.',
          hint: 'String hero = "CodeQuest"; then System.out.println(hero);',
          testFn: (output) => output.trim().includes('CodeQuest'),
        }
      }
    ]
  },
  {
    id: 'java-module-2',
    title: 'Making Decisions',
    icon: '🚦',
    color: 'from-blue-600 to-indigo-600',
    description: 'Use if statements and comparison operators to make your Java code smart.',
    lessons: [
      {
        id: 'java-lesson-2-1',
        title: 'If/Else Statements',
        xp: 30,
        theory: `## Logic in Java 🌲

Java uses \`if\`, \`else if\`, and \`else\` to control the flow of the program.

\`\`\`java
int temp = 30;

if (temp > 25) {
    System.out.println("Hot!");
} else {
    System.out.println("Cold!");
}
\`\`\`

Operators: \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`.`,
        starterCode: `public class Main {
    public static void main(String[] args) {
        int age = 20;
        if (age >= 18) {
            System.out.println("Adult");
        } else {
            System.out.println("Minor");
        }
    }
}`,
        challenge: {
          prompt: 'Check if \`num = 10\` is equal to 10. If so, print "Match".',
          hint: 'if (num == 10)',
          testFn: (output) => output.trim() === 'Match',
        }
      }
    ]
  },
  {
    id: 'java-module-3',
    title: 'Loops',
    icon: '🔁',
    color: 'from-emerald-500 to-teal-500',
    description: 'Repeat tasks easily with for and while loops.',
    lessons: [
      {
        id: 'java-lesson-3-1',
        title: 'For Loops',
        xp: 35,
        theory: `## For Loops 🔄

A \`for\` loop in Java has three parts: start, condition, and increment.

\`\`\`java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
\`\`\``,
        starterCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            System.out.println("Looping...");
        }
    }
}`,
        challenge: {
          prompt: 'Use a for loop to print numbers from **1 to 5**.',
          hint: 'for (int i = 1; i <= 5; i++)',
          testFn: (output) => output.trim().replace(/\s+/g, '') === '12345',
        }
      }
    ]
  },
  {
    id: 'java-module-4',
    title: 'Arrays & Lists',
    icon: '📦',
    color: 'from-amber-500 to-yellow-500',
    description: 'Store multiple values in arrays.',
    lessons: [
      {
        id: 'java-lesson-4-1',
        title: 'Arrays',
        xp: 40,
        theory: `## Arrays 📋

An array is a fixed-size collection of values of the same type.

\`\`\`java
int[] numbers = {10, 20, 30};
System.out.println(numbers[0]); // 10
\`\`\`

Arrays are **0-indexed**.`,
        starterCode: `public class Main {
    public static void main(String[] args) {
        String[] fruits = {"Apple", "Banana"};
        System.out.println(fruits[0]);
    }
}`,
        challenge: {
          prompt: 'Create an array of 3 integers and print the length of the array using \`arr.length\`.',
          hint: 'int[] arr = {1, 2, 3}; System.out.println(arr.length);',
          testFn: (output) => output.trim() === '3',
        }
      }
    ]
  },
  {
    id: 'java-module-5',
    title: 'Methods',
    icon: '🔧',
    color: 'from-purple-500 to-pink-500',
    description: 'Write reusable code blocks with methods.',
    lessons: [
      {
        id: 'java-lesson-5-1',
        title: 'Creating Methods',
        xp: 45,
        theory: `## Methods 🧩

In Java, we use **methods** (functions) to organize code.

\`\`\`java
public static void greet() {
    System.out.println("Hi!");
}
\`\`\`

- \`void\`: Means it returns nothing.
- \`static\`: Allows us to call it without creating an object.`,
        starterCode: `public class Main {
    public static void greet() {
        System.out.println("Hello from Method!");
    }

    public static void main(String[] args) {
        greet();
    }
}`,
        challenge: {
          prompt: 'Create a method called \`ping\` that prints "pong", then call it from the main method.',
          hint: 'public static void ping() { ... }',
          testFn: (output) => output.trim() === 'pong',
        }
      }
    ]
  },
  {
    id: 'java-module-6',
    title: 'Classes & Objects',
    icon: '🚀',
    color: 'from-green-600 to-emerald-600',
    description: 'Introduction to Object-Oriented Programming.',
    lessons: [
      {
        id: 'java-lesson-6-1',
        title: 'Your First Class',
        xp: 100,
        theory: `## Objects 🛸

Java is an **Object-Oriented** language. Everything is an object!

\`\`\`java
class Dog {
    String name;
    void bark() {
        System.out.println("Woof!");
    }
}
\`\`\``,
        starterCode: `class Hero {
    String name = "CodeQuest";
    void powerUp() {
        System.out.println("Powering Up!");
    }
}

public class Main {
    public static void main(String[] args) {
        Hero myHero = new Hero();
        System.out.println(myHero.name);
        myHero.powerUp();
    }
}`,
        challenge: {
          prompt: 'Change the Hero\'s name to "SuperDev" and print it.',
          hint: 'myHero.name = "SuperDev";',
          testFn: (output) => output.includes('SuperDev'),
        }
      }
    ]
  },
  {
    id: 'java-module-7',
    title: 'Advanced OOP',
    icon: '🧬',
    color: 'from-blue-700 to-cyan-600',
    description: 'Learn Inheritance and Morphing in Java.',
    lessons: [
      {
        id: 'java-lesson-7-1',
        title: 'Inheritance',
        xp: 60,
        theory: `## Inheritance 🧬

Inheritance allows one class to get methods and fields from another. We use the \`extends\` keyword.

\`\`\`java
class Animal {
    void eat() { System.out.println("Eating..."); }
}

class Dog extends Animal {
    void bark() { System.out.println("Barking..."); }
}
\`\`\`

A \`Dog\` "is an" \`Animal\`, so it can \`eat()\` too!`,
        starterCode: `class Vehicle {
    void move() { System.out.println("Moving!"); }
}

class Bike extends Vehicle {
    void ringBell() { System.out.println("Ring!"); }
}

public class Main {
    public static void main(String[] args) {
        Bike myBike = new Bike();
        myBike.move();
        myBike.ringBell();
    }
}`,
        challenge: {
          prompt: 'Create a class \`Car\` that \`extends Vehicle\`. In main, create a Car object and call its \`move()\` method.',
          hint: 'class Car extends Vehicle { }',
          testFn: (output) => output.includes('Moving!'),
        }
      }
    ]
  },
  {
    id: 'java-module-8',
    title: 'Errors & Exceptions',
    icon: '⚠️',
    color: 'from-red-500 to-orange-600',
    description: 'Handle program crashes gracefully with try-catch.',
    lessons: [
      {
        id: 'java-lesson-8-1',
        title: 'Try/Catch',
        xp: 55,
        theory: `## Exceptions ⚠️

When Java runs into an error, it "throws" an exception. We "catch" it using \`try-catch\`.

\`\`\`java
try {
    int result = 10 / 0; // Error!
} catch (Exception e) {
    System.out.println("Oops: " + e.getMessage());
}
\`\`\``,
        starterCode: `public class Main {
    public static void main(String[] args) {
        try {
            int[] nums = {1, 2};
            System.out.println(nums[5]); // Error!
        } catch (Exception e) {
            System.out.println("Caught Error");
        }
    }
}`,
        challenge: {
          prompt: 'Wrap an operation that throws an error in a try-catch block and print "Handled" inside the catch.',
          hint: 'catch (Exception e) { System.out.println("Handled"); }',
          testFn: (output) => output.includes('Handled'),
        }
      }
    ]
  },
  {
    id: 'java-module-9',
    title: 'Collections',
    icon: '📊',
    color: 'from-purple-600 to-indigo-700',
    description: 'Introduction to ArrayList and dynamic data.',
    lessons: [
      {
        id: 'java-lesson-9-1',
        title: 'ArrayList',
        xp: 50,
        theory: `## ArrayList 🛹

Standard arrays are fixed size. \`ArrayList\` can grow as you add items!

\`\`\`java
import java.util.ArrayList;

ArrayList<String> list = new ArrayList<>();
list.add("Java");
System.out.println(list.size()); // 1
\`\`\``,
        starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(90);
        scores.add(85);
        System.out.println(scores.get(0));
    }
}`,
        challenge: {
          prompt: 'Add a third number to the \`scores\` list and print the total size of the list.',
          hint: 'scores.add(100); System.out.println(scores.size());',
          testFn: (output) => output.includes('3'),
        }
      }
    ]
  },
  {
    id: 'java-module-10',
    title: 'Java Master Project',
    icon: '🏆',
    color: 'from-green-600 to-teal-700',
    description: 'Build a mini-bank system using everything you have learned.',
    lessons: [
      {
        id: 'java-lesson-10-1',
        title: 'Mini-Bank System',
        xp: 150,
        theory: `## Final Project! 🏦

Let's build a simple **Bank Account** class with fields for balance and methods for depositing money.

\`\`\`java
class Account {
    double balance = 0;
    void deposit(double amount) {
        balance += amount;
    }
}
\`\`\``,
        starterCode: `class Account {
    double balance = 100.0;
    
    void deposit(double amount) {
        balance += amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Account myAcc = new Account();
        myAcc.deposit(50.0);
        System.out.println("Balance: " + myAcc.balance);
    }
}`,
        challenge: {
          prompt: 'Add a \`withdraw\` method to the Account class that subtracts an amount. Withdraw **30.0** from the account and print the final balance.',
          hint: 'void withdraw(double amount) { balance -= amount; }',
          testFn: (output) => output.includes('120'),
        }
      }
    ]
  }
];

export const getAllLessonIds = () => javaModules.flatMap(m => m.lessons.map(l => l.id));

export const getJavaModuleProgress = (moduleId, completedLessons) => {
  const module = javaModules.find(m => m.id === moduleId)
  if (!module) return { completed: 0, total: 0 }
  const completed = module.lessons.filter(l => completedLessons[l.id]).length
  return { completed, total: module.lessons.length }
}

export const isJavaModuleUnlocked = (moduleIndex, completedLessons) => {
  if (moduleIndex === 0) return true
  const prevModule = javaModules[moduleIndex - 1]
  return prevModule.lessons.every(l => completedLessons[l.id])
}
