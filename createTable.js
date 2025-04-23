const db = require("./database/db");


db.query("CREATE DATABASE IF NOT EXISTS apnamarket_api", (err, result) => {
    if (err) throw err;
    console.log("Database created ");

    db.query("USE apnamarket_api", (err) => {
      if (err) throw err;


      const createTableProducts = `
      CREATE TABLE IF NOT EXISTS products (
      Id INT AUTO_INCREMENT PRIMARY KEY,
      Name TEXT,
      Image TEXT,
      Star INT,
      Descreption TEXT,
      Price INT,
      IsDraft INT
      )
      `;


      db.query(createTableProducts,(err, result) => {
        if (err) throw err;
        console.log("Table 'products' created ");
      })

      const createTableLogin = `CREATE TABLE IF NOT EXISTS user_login (
      Id INT AUTO_INCREMENT PRIMARY KEY,
      Name TEXT,
      Email VARCHAR(100),
      Password VARCHAR(100) 
      )
      `;

      db.query(createTableLogin,(err, result) => {
        if (err) throw err;
        console.log("Table 'login' created ");
      })



      const createTableOrder = `
      CREATE TABLE IF NOT EXISTS \`order\` (
         Id INT AUTO_INCREMENT PRIMARY KEY,
         Name TEXT,
         Image TEXT,
         star INT,
         Price INT,
         Qty INT
      )`;

      db.query(createTableOrder,(err, result) => {
        if (err) throw err;
        console.log("Table 'order' created ");
      });

      const createTableAddCart = `CREATE TABLE IF NOT EXISTS addcart (
        Id INT AUTO_INCREMENT PRIMARY KEY,
         name TEXT,
         star INT,
         price INT,
         qty INT,
         qtyPrice INT,
         image TEXT
      )`;

      db.query(createTableAddCart,(err, result) => {
        if (err) throw err;
        console.log("Table 'addcart' created ");
      });
      

    });
  });
