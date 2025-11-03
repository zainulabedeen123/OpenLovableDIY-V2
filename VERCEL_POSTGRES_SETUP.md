# Vercel Postgres Integration Setup Guide

This guide will help you set up Vercel Postgres for your OpenLovable application.

## 🚀 Quick Start

### Step 1: Create a Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project or create a new one
3. Navigate to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres** as the database type
6. Choose your preferred region (select the one closest to your users)
7. Click **Create**

### Step 2: Get Your Connection String

After creating the database:

1. In the Vercel Dashboard, go to your database
2. Click on the **Settings** tab
3. Under **Connection String**, you'll see several options:
   - `POSTGRES_URL` - Use this for production
   - `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)
   - `POSTGRES_PRISMA_URL` - For Prisma ORM

4. Copy the `POSTGRES_URL` value

### Step 3: Configure Environment Variables

#### For Local Development:

1. Create or update your `.env.local` file in the project root:

```env
# Vercel Postgres Connection
POSTGRES_URL="your-postgres-url-here"
```

2. Replace `"your-postgres-url-here"` with the connection string you copied

#### For Production (Vercel):

The environment variables are automatically added when you create the database in Vercel. No manual configuration needed!

### Step 4: Restart Your Development Server

```bash
npm run dev
```

## 🎯 Features

Once configured, you can:

### 1. **View Tables**
- See all tables in your database
- Refresh the list anytime

### 2. **Create Tables**
- Use the visual table builder
- Add columns with different data types:
  - TEXT
  - INTEGER
  - SERIAL (auto-incrementing)
  - BOOLEAN
  - TIMESTAMP
  - VARCHAR(255)
  - JSONB
- Set constraints (PRIMARY KEY, NOT NULL, UNIQUE, etc.)

### 3. **Execute SQL Queries**
- Run any SQL query directly
- View results in JSON format
- See row counts and execution status

## 📝 Example Usage

### Creating a Users Table

1. Go to Dashboard → Database Management
2. Click on **Create Table** tab
3. Enter table name: `users`
4. Add columns:
   - `id` - SERIAL - PRIMARY KEY (already added by default)
   - `name` - VARCHAR(255) - NOT NULL
   - `email` - VARCHAR(255) - UNIQUE NOT NULL
   - `created_at` - TIMESTAMP - DEFAULT CURRENT_TIMESTAMP
5. Click **Create Table**

### Running a Query

1. Go to **Run Query** tab
2. Enter your SQL:
```sql
INSERT INTO users (name, email, created_at) 
VALUES ('John Doe', 'john@example.com', NOW());
```
3. Click **Execute Query**

### Viewing Data

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

## 🔒 Security Features

- **Authentication Required**: All database operations require user authentication
- **Dangerous Operations Blocked**: Operations like `DROP DATABASE` are prevented
- **SQL Injection Protection**: Parameterized queries are used where possible
- **Connection Pooling**: Automatic connection management via Vercel

## 🛠️ API Endpoints

The following API endpoints are available:

- `POST /api/database/execute-query` - Execute any SQL query
- `POST /api/database/create-table` - Create a new table
- `GET /api/database/list-tables` - List all tables
- `GET /api/database/table-schema?tableName=xxx` - Get table schema
- `GET /api/database/connection-status` - Check database connection

## 📊 Common SQL Examples

### Create a Blog Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id INTEGER,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create a Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Insert Data
```sql
INSERT INTO products (name, description, price, stock, category)
VALUES 
  ('Laptop', 'High-performance laptop', 999.99, 10, 'Electronics'),
  ('Mouse', 'Wireless mouse', 29.99, 50, 'Accessories');
```

### Query Data
```sql
-- Get all products
SELECT * FROM products;

-- Get products by category
SELECT * FROM products WHERE category = 'Electronics';

-- Get products with low stock
SELECT * FROM products WHERE stock < 20 ORDER BY stock ASC;

-- Count products by category
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category;
```

### Update Data
```sql
UPDATE products 
SET stock = stock - 1 
WHERE id = 1;
```

### Delete Data
```sql
DELETE FROM products WHERE id = 5;
```

## 🔧 Troubleshooting

### "Database Not Connected" Error

**Solution:**
1. Make sure you've added `POSTGRES_URL` to your `.env.local` file
2. Restart your development server
3. Check that the connection string is correct

### "Unauthorized" Error

**Solution:**
- Make sure you're logged in with Google
- The dashboard requires authentication to access database features

### Query Execution Fails

**Solution:**
1. Check your SQL syntax
2. Make sure the table/column names exist
3. Check the error message for specific details

## 🌐 Production Deployment

When deploying to Vercel:

1. The `POSTGRES_URL` environment variable is automatically configured
2. No additional setup needed
3. Your database is ready to use in production!

## 📚 Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

## 💡 Tips

1. **Use Transactions**: For multiple related operations, use transactions to ensure data consistency
2. **Index Your Queries**: Add indexes on frequently queried columns for better performance
3. **Backup Regularly**: Vercel provides automatic backups, but consider additional backup strategies for critical data
4. **Monitor Usage**: Keep an eye on your database usage in the Vercel dashboard

---

**Need Help?** Check the [Vercel Support](https://vercel.com/support) or open an issue in the repository.

