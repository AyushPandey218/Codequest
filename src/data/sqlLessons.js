// SQL Lesson Data for CodeQuest
// Using sql.js (SQLite WASM) for execution

export const sqlModules = [
  // ─── MODULE 1: The Basics ────────────────────────────────────────────────
  {
    id: 'sql-module-1',
    title: 'SQL Foundations',
    icon: '📊',
    color: 'from-blue-600 to-cyan-500',
    description: 'Learn how to retrieve data from a relational database using SELECT.',
    lessons: [
      {
        id: 'sql-1-1',
        title: 'The SELECT Statement',
        xp: 40,
        theory: `## The SELECT Statement 🔍

SQL (Structured Query Language) is used to communicate with databases. The most common task is retrieving data.

### Basic Syntax
To get data from a table, use \`SELECT\` followed by the column names, and \`FROM\` followed by the table name.

\`\`\`sql
SELECT name, city FROM users;
\`\`\`

To select **all** columns, use the asterisk (\`*\`):
\`\`\`sql
SELECT * FROM products;
\`\`\``,
        starterCode: `-- The table 'users' has: id, name, email, country
SELECT * FROM users;`,
        setupSQL: `
          CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, country TEXT);
          INSERT INTO users VALUES (1, 'Alice', 'alice@example.com', 'USA');
          INSERT INTO users VALUES (2, 'Bob', 'bob@example.com', 'UK');
          INSERT INTO users VALUES (3, 'Charlie', 'charlie@example.com', 'Canada');
        `,
        challenge: {
          prompt: 'Write a query to select only the `name` and `country` columns from the `users` table.',
          hint: 'SELECT name, country FROM users;',
          testFn: (output) => {
            // Simple string check for output or JSON result check
            return output.toLowerCase().includes('alice') && output.toLowerCase().includes('usa') && !output.toLowerCase().includes('email');
          },
        }
      }
    ]
  },

  // ─── MODULE 2: Filtering Data ─────────────────────────────────────────────
  {
    id: 'sql-module-2',
    title: 'Filtering with WHERE',
    icon: '🎯',
    color: 'from-purple-600 to-indigo-500',
    description: 'Master the WHERE clause to narrow down your results.',
    lessons: [
      {
        id: 'sql-2-1',
        title: 'Filtering Basics',
        xp: 50,
        theory: `## The WHERE Clause 🎯

The \`WHERE\` clause is used to filter records that fulfill a specific condition.

\`\`\`sql
SELECT * FROM users WHERE country = 'USA';
\`\`\`

### Comparison Operators:
- \`=\` : Equals
- \`!= \` or \`<> \` : Not equals
- \`> \`, \`< \`, \`>= \`, \`<= \` : Comparisons
- \`AND\`, \`OR\`, \`NOT\` : Logical operators`,
        starterCode: `SELECT * FROM users;`,
        setupSQL: `
          CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, country TEXT);
          INSERT INTO users VALUES (1, 'Alice', 25, 'USA');
          INSERT INTO users VALUES (2, 'Bob', 30, 'UK');
          INSERT INTO users VALUES (3, 'Charlie', 22, 'USA');
          INSERT INTO users VALUES (4, 'Diana', 28, 'Germany');
        `,
        challenge: {
          prompt: 'Select all users from the `users` table where the `country` is "USA".',
          hint: "SELECT * FROM users WHERE country = 'USA';",
          testFn: (output) => {
            return output.toLowerCase().includes('alice') && output.toLowerCase().includes('charlie') && !output.toLowerCase().includes('bob');
          },
        }
      }
    ]
  },

  // ─── MODULE 3: Data Definition (DDL) ──────────────────────────────────────
  {
    id: 'sql-module-3',
    title: 'Data Definition (DDL)',
    icon: '🏗️',
    color: 'from-green-600 to-teal-500',
    description: 'Learn how to create and manage the structure of your database.',
    lessons: [
      {
        id: 'sql-3-1',
        title: 'Creating Tables',
        xp: 60,
        theory: `## Creating Tables 🏗️

The \`CREATE TABLE\` statement is used to create a new table in a database.

### Syntax
\`\`\`sql
CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    column3 datatype,
   ....
);
\`\`\`

### Common Data Types:
- \`INTEGER\`: Whole numbers.
- \`TEXT\`: Character strings.
- \`REAL\`: Floating point numbers.
- \`BLOB\`: Binary data.

### Example:
\`\`\`sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    grade REAL
);
\`\`\``,
        starterCode: `-- Create a table named 'employees'
-- with columns: id (INTEGER PRIMARY KEY), name (TEXT), position (TEXT)`,
        setupSQL: ``,
        challenge: {
          prompt: 'Create a table named `employees` with three columns: `id` (INTEGER and PRIMARY KEY), `name` (TEXT), and `position` (TEXT).',
          hint: 'CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, position TEXT);',
          testFn: (output) => {
            return output.toLowerCase().includes('success') || output.toLowerCase().includes('executed');
          },
        }
      },
      {
        id: 'sql-3-2',
        title: 'Column Constraints',
        xp: 50,
        theory: `## Column Constraints 🛡️

Constraints are used to specify rules for the data in a table.

### Common Constraints:
- \`NOT NULL\`: Ensures that a column cannot have a NULL value.
- \`UNIQUE\`: Ensures that all values in a column are different.
- \`PRIMARY KEY\`: A combination of NOT NULL and UNIQUE. Uniquely identifies each row.
- \`DEFAULT\`: Sets a default value for a column when no value is specified.

### Example:
\`\`\`sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active'
);
\`\`\``,
        starterCode: `-- Create a table 'users' with:
-- id (INTEGER PRIMARY KEY)
-- email (TEXT, NOT NULL and UNIQUE)
-- joined_at (TEXT, DEFAULT to current date)`,
        setupSQL: ``,
        challenge: {
          prompt: 'Create a table named `users` with three columns: `id` (INTEGER PRIMARY KEY), `email` (TEXT that is NOT NULL and UNIQUE), and `joined_at` (TEXT with a DEFAULT value of "2024-01-01").',
          hint: 'CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, joined_at TEXT DEFAULT "2024-01-01");',
          testFn: (output) => {
            return output.toLowerCase().includes('success') || output.toLowerCase().includes('executed');
          },
        }
      },
      {
        id: 'sql-3-3',
        title: 'Dropping Tables',
        xp: 40,
        theory: `## Dropping Tables 🗑️

The \`DROP TABLE\` statement is used to delete an existing table in a database. **Warning**: This will remove the table and all its data permanently!

### Syntax
\`\`\`sql
DROP TABLE table_name;
\`\`\``,
        starterCode: `DROP TABLE temp_logs;`,
        setupSQL: `CREATE TABLE temp_logs (id INTEGER, message TEXT);`,
        challenge: {
          prompt: 'Delete the `temp_logs` table from the database.',
          hint: 'DROP TABLE temp_logs;',
          testFn: (output) => {
             return output.toLowerCase().includes('success');
          },
        }
      }
    ]
  },

  // ─── MODULE 4: Data Manipulation (DML) ────────────────────────────────────
  {
    id: 'sql-module-4',
    title: 'Data Manipulation (DML)',
    icon: '✍️',
    color: 'from-orange-600 to-red-500',
    description: 'Learn how to insert, update, and delete data in your tables.',
    lessons: [
      {
        id: 'sql-4-1',
        title: 'Inserting Data',
        xp: 50,
        theory: `## Inserting Data ✍️

The \`INSERT INTO\` statement is used to add new rows of data to a table.

### Syntax
\`\`\`sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
\`\`\`

If you are adding values for all the columns of the table, you do not need to specify the column names:
\`\`\`sql
INSERT INTO table_name
VALUES (value1, value2, ...);
\`\`\``,
        starterCode: `INSERT INTO products (id, name, price) VALUES (1, 'Laptop', 999);
SELECT * FROM products;`,
        setupSQL: `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);`,
        challenge: {
          prompt: 'Add a new product to the `products` table with ID `2`, Name `"Mouse"`, and Price `25`. Then select all rows to see your result.',
          hint: "INSERT INTO products VALUES (2, 'Mouse', 25); SELECT * FROM products;",
          testFn: (output) => {
            return output.toLowerCase().includes('mouse') && output.toLowerCase().includes('25');
          },
        }
      },
      {
        id: 'sql-4-2',
        title: 'Updating Data',
        xp: 50,
        theory: `## Updating Data 🔄

The \`UPDATE\` statement is used to modify existing records in a table.

### Syntax
\`\`\`sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
\`\`\`

**Note**: Be careful when updating records. If you omit the \`WHERE\` clause, all records will be updated!`,
        starterCode: `UPDATE users SET age = 26 WHERE name = 'Alice';
SELECT * FROM users WHERE name = 'Alice';`,
        setupSQL: `
          CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER);
          INSERT INTO users VALUES (1, 'Alice', 25);
          INSERT INTO users VALUES (2, 'Bob', 30);
        `,
        challenge: {
          prompt: 'Update Bob\'s age to 31 in the `users` table.',
          hint: "UPDATE users SET age = 31 WHERE name = 'Bob'; SELECT * FROM users WHERE name = 'Bob';",
          testFn: (output) => {
            return output.toLowerCase().includes('bob') && output.toLowerCase().includes('31');
          },
        }
      },
      {
        id: 'sql-4-3',
        title: 'Deleting Data',
        xp: 40,
        theory: `## Deleting Data ❌

The \`DELETE\` statement is used to delete existing records in a table.

### Syntax
\`\`\`sql
DELETE FROM table_name WHERE condition;
\`\`\`

**Note**: If you omit the \`WHERE\` clause, all records in the table will be deleted!`,
        starterCode: `DELETE FROM tasks WHERE id = 1;
SELECT * FROM tasks;`,
        setupSQL: `
          CREATE TABLE tasks (id INTEGER PRIMARY KEY, task TEXT);
          INSERT INTO tasks VALUES (1, 'Buy milk');
          INSERT INTO tasks VALUES (2, 'Clean room');
        `,
        challenge: {
          prompt: 'Remove the task with ID `1` from the `tasks` table.',
          hint: "DELETE FROM tasks WHERE id = 1; SELECT * FROM tasks;",
          testFn: (output) => {
            return !output.toLowerCase().includes('buy milk') && output.toLowerCase().includes('clean room');
          },
        }
      }
    ]
  },

  // ─── MODULE 5: Joins & Relationships ──────────────────────────────────────
  {
    id: 'sql-module-5',
    title: 'Joins & Relationships',
    icon: '🔗',
    color: 'from-blue-700 to-indigo-600',
    description: 'Learn how to combine data from multiple tables using JOINs.',
    lessons: [
      {
        id: 'sql-5-1',
        title: 'Inner Join',
        xp: 70,
        theory: `## Inner Join 🔗

An \`INNER JOIN\` is used to combine rows from two or more tables, based on a related column between them.

### Syntax
\`\`\`sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
\`\`\`

### Example:
If we have an \`orders\` table and a \`customers\` table, we can join them on \`customer_id\`.
\`\`\`sql
SELECT orders.id, customers.name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;
\`\`\``,
        starterCode: `SELECT orders.id, customers.name, orders.amount
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;`,
        setupSQL: `
          CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
          CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL);
          INSERT INTO customers VALUES (1, 'Alice');
          INSERT INTO customers VALUES (2, 'Bob');
          INSERT INTO orders VALUES (101, 1, 50.0);
          INSERT INTO orders VALUES (102, 2, 30.0);
          INSERT INTO orders VALUES (103, 1, 20.0);
        `,
        challenge: {
          prompt: 'Retrieve the `id` from the `orders` table and the `name` from the `customers` table for all orders. Join the tables using `customer_id` and `id`.',
          hint: "SELECT orders.id, customers.name FROM orders INNER JOIN customers ON orders.customer_id = customers.id;",
          testFn: (output) => {
            return output.toLowerCase().includes('alice') && output.toLowerCase().includes('101') && output.toLowerCase().includes('bob') && output.toLowerCase().includes('102');
          },
        }
      }
    ]
  },

  // ─── MODULE 6: Aggregate Functions ────────────────────────────────────────
  {
    id: 'sql-module-6',
    title: 'Aggregate Functions',
    icon: '📊',
    color: 'from-pink-600 to-rose-500',
    description: 'Learn how to perform calculations on multiple rows using aggregates.',
    lessons: [
      {
        id: 'sql-6-1',
        title: 'COUNT, SUM, and AVG',
        xp: 60,
        theory: `## Aggregate Functions 📊

Aggregate functions perform a calculation on a set of values and return a single value.

### Common Functions:
- \`COUNT()\`: Returns the number of rows.
- \`SUM()\`: Returns the total sum of a numeric column.
- \`AVG()\`: Returns the average value of a numeric column.
- \`MIN()\` / \`MAX()\`: Returns the smallest/largest value.

### Example:
\`\`\`sql
SELECT COUNT(*) FROM users;
SELECT AVG(price) FROM products;
\`\`\``,
        starterCode: `SELECT COUNT(*) FROM sales;
SELECT SUM(amount) FROM sales;`,
        setupSQL: `
          CREATE TABLE sales (id INTEGER PRIMARY KEY, product_id INTEGER, amount REAL);
          INSERT INTO sales VALUES (1, 101, 150.0);
          INSERT INTO sales VALUES (2, 102, 200.0);
          INSERT INTO sales VALUES (3, 101, 50.0);
        `,
        challenge: {
          prompt: 'Calculate the **total sum** of the `amount` column in the `sales` table.',
          hint: 'SELECT SUM(amount) FROM sales;',
          testFn: (output) => {
            return output.includes('400');
          },
        }
      }
    ]
  },

  // ─── MODULE 7: Grouping Data ──────────────────────────────────────────────
  {
    id: 'sql-module-7',
    title: 'Grouping Data',
    icon: '📂',
    color: 'from-amber-600 to-yellow-500',
    description: 'Learn how to group records and filter groups using GROUP BY and HAVING.',
    lessons: [
      {
        id: 'sql-7-1',
        title: 'GROUP BY',
        xp: 70,
        theory: `## Grouping Data 📂

The \`GROUP BY\` statement groups rows that have the same values into summary rows. It is often used with aggregate functions.

### Syntax
\`\`\`sql
SELECT column_name, COUNT(*)
FROM table_name
GROUP BY column_name;
\`\`\`

### Example:
To find how many users are from each country:
\`\`\`sql
SELECT country, COUNT(*) FROM users GROUP BY country;
\`\`\``,
        starterCode: `SELECT product_id, SUM(amount) FROM sales GROUP BY product_id;`,
        setupSQL: `
          CREATE TABLE sales (id INTEGER PRIMARY KEY, product_id INTEGER, amount REAL);
          INSERT INTO sales VALUES (1, 101, 150.0);
          INSERT INTO sales VALUES (2, 102, 200.0);
          INSERT INTO sales VALUES (3, 101, 50.0);
          INSERT INTO sales VALUES (4, 102, 100.0);
        `,
        challenge: {
          prompt: 'Group the `sales` by `product_id` and find the **total sum** of `amount` for each product.',
          hint: 'SELECT product_id, SUM(amount) FROM sales GROUP BY product_id;',
          testFn: (output) => {
            return output.includes('101 | 200') && output.includes('102 | 300');
          },
        }
      }
    ]
  },

  // ─── MODULE 8: Sorting & Limiting ─────────────────────────────────────────
  {
    id: 'sql-module-8',
    title: 'Sorting & Limiting',
    icon: '📑',
    color: 'from-cyan-600 to-blue-500',
    description: 'Learn how to sort your results and limit the number of rows returned.',
    lessons: [
      {
        id: 'sql-8-1',
        title: 'ORDER BY & LIMIT',
        xp: 50,
        theory: `## Sorting and Limiting 📑

### ORDER BY
The \`ORDER BY\` keyword is used to sort the result-set in ascending (default) or descending order.
\`\`\`sql
SELECT * FROM products ORDER BY price DESC;
\`\`\`

### LIMIT
The \`LIMIT\` clause is used to specify the number of records to return.
\`\`\`sql
SELECT * FROM products LIMIT 5;
\`\`\``,
        starterCode: `SELECT * FROM products ORDER BY price DESC;`,
        setupSQL: `
          CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);
          INSERT INTO products VALUES (1, 'Laptop', 1200.0);
          INSERT INTO products VALUES (2, 'Mouse', 25.0);
          INSERT INTO products VALUES (3, 'Keyboard', 75.0);
          INSERT INTO products VALUES (4, 'Monitor', 300.0);
        `,
        challenge: {
          prompt: 'Retrieve all products from the `products` table, sorted by `price` in **descending** order, and limit the result to the top **2** most expensive products.',
          hint: 'SELECT * FROM products ORDER BY price DESC LIMIT 2;',
          testFn: (output) => {
            return output.toLowerCase().includes('laptop') && output.toLowerCase().includes('monitor') && !output.toLowerCase().includes('mouse');
          },
        }
      }
    ]
  }
];

// Helper Functions
export const getAllSQLLessonIds = () => {
  return sqlModules.flatMap(m => m.lessons.map(l => l.id))
}

export const getSQLLesson = (moduleId, lessonId) => {
  const module = sqlModules.find(m => m.id === moduleId)
  if (!module) return null
  return module.lessons.find(l => l.id === lessonId) || null
}

export const getSQLModuleProgress = (moduleId, completedLessons) => {
  const module = sqlModules.find(m => m.id === moduleId)
  if (!module) return { completed: 0, total: 0 }
  const completed = module.lessons.filter(l => completedLessons[l.id]).length
  return { completed, total: module.lessons.length }
}

export const isSQLModuleUnlocked = (moduleIndex, completedLessons) => {
  if (moduleIndex === 0) return true
  const prevModule = sqlModules[moduleIndex - 1]
  return prevModule.lessons.every(l => completedLessons[l.id])
}
