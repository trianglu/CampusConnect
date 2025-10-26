# CampusConnect

CampusConnect is a web application built with Node.js, Express, and MongoDB to connect students and organizations within a university ecosystem.  
It provides an interactive platform for events, announcements, and communication between campus members.

---

## Features

- User authentication using sessions and bcrypt hashing  
- Modular Express app with MVC architecture  
- File uploads supported via Multer  
- Flash messages for feedback  
- Rate limiting and session security  
- MongoDB integration for data storage  
- Middleware for route protection and validation  

---

## Project Structure

CampusConnect/

│

├── controllers/      # Request logic

├── middleware/       # Custom middlewares

├── models/           # Mongoose schemas

├── public/           # Static assets

├── routes/           # Route definitions

├── views/            # EJS templates

├── app.js            # Main application file

├── package.json      # Dependencies and scripts

└── .gitignore

---

## Installation & Setup

1. **Clone the repository**
   bash:

   git clone https://github.com/trianglu/CampusConnect.git

   cd CampusConnect


3. **Install dependencies**

   bash:
   npm install

4. **Create an environment file**
   Create a .env file in the root directory and add:

   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key

5. **Run the app**

   bash:
   node app.js
   
   or (if using nodemon)

   bash:
   npx nodemon app.js

6. **Visit**

   http://localhost:3000

---

## 📦 Dependencies

| Package              | Description                         |
| -------------------- | ----------------------------------- |
| bcrypt               | Password hashing for authentication |
| connect-flash        | Flash messages for notifications    |
| connect-mongo        | Store sessions in MongoDB           |
| ejs                  | Template engine for views           |
| express              | Web framework for Node.js           |
| express-rate-limit   | Rate limiter for security           |
| express-session      | Session management                  |
| express-validator    | Input validation                    |
| method-override      | Supports HTTP verbs like PUT/DELETE |
| mongoose             | MongoDB object modeling             |
| morgan               | HTTP request logger                 |
| multer               | File upload handling                |
| path                 | Utility for handling file paths     |

---

## Development Scripts

Since your package.json doesn’t define scripts yet, you can add these for convenience:
json:
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}

Then you can run:

bash:
npm run dev

---

## Technologies Used

* **Node.js** & **Express.js** — Backend framework
* **MongoDB** & **Mongoose** — Database
* **EJS** — Server-side templating
* **Multer** — File upload
* **Bootstrap/CSS** — UI styling (if applicable)

---


1. Fork the repository
2. Create your feature branch: git checkout -b feature/YourFeature
3. Commit your changes: git commit -m "Add YourFeature"
4. Push to the branch: git push origin feature/YourFeature
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**trianglu**
GitHub: [@trianglu](https://github.com/trianglu)

---
