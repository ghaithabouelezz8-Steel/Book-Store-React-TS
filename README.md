# Book-Store-React-TS 

A full-stack e-commerce bookstore application with secure user login, a working shopping cart, and a safe checkout system that handles book stock automatically.

##  Tech Stack

- **Frontend:** React (TypeScript), Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, TypeScript, TSX (for auto-restarting the server)
- **Database & ORM:** PostgreSQL, Prisma ORM

---

##  Cool Features under the Hood

1. **Safe Checkout Transactions:** Uses Prisma's `$transaction` tool. When a user buys books, the backend checks the database to make sure the books are actually in stock and verifies the real price. If any book is sold out, the whole order stops automatically so your database numbers never break.
2. **Matching Types:** The frontend and backend are completely synced. The frontend user data keys match the backend perfectly, which fixes those annoying `undefined` errors where the app forgets who is logged in.
3. **Saved Logins:** When you refresh the page, the website remembers you are logged in by checking your browser's local storage so you don't get kicked out.

---

##  How to Setup and Run Locally

### 1. Clone the Project & Set up Environment Keys
Clone the repo and go into the folder:

  git clone https://github.com/ghaithabouelezz8-Steel/Book-Store-React-TS.git
  cd Book-Store-React-TS

Create a file named `.env` inside your `backend` folder and add your database link and JWT login token secret:

  DATABASE_URL="postgresql://username:password@your-neon-host/dbname?sslmode=require"
  JWT_SECRET="write_any_long_secret_password_here"
  PORT=5000

### 2. Start the Backend Server
Open your terminal, go to the backend folder, install the tools, run your database setup, and start the server:

  cd backend
  npm install
  npx prisma migrate dev --name init
  npx prisma generate
  npx tsx watch src/index.ts

### 3. Start the Frontend Website
Open a second terminal window, go to the frontend folder, install the packages, and run the development server:

  cd frontend
  npm install
  npm run dev

---

##  Quick Fixes for Common Bugs

If you change anything in your database models or notice your frontend login/cart behaving weirdly, just run this quick cleanup:

  # 1. Update your database types
  cd backend
  npx prisma generate

  # 2. Clear out the frontend cache and restart
  cd ../frontend
  rm -rf node_modules/.vite
  npm run dev

 Pro-Tip: If you change things in your database, open your browser, press F12 to open Developer Tools, go to the Console, type 'localStorage.clear();' and hit Enter. This clears out old, broken session data so you can log in fresh!
