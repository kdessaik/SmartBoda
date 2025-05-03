const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.VITE_Database_Host,
  user: process.env.VITE_Database_username,
  password: process.env.VITE_Database_password,
  database: process.env.VITE_Database,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database.');
  }
});

exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM usertable', (err, results) => {
        if (err) {
          console.error('Error fetching users:', err);
          resolve({
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Database error' }),
          });
        } else {
          resolve({
            statusCode: 200,
            body: JSON.stringify({ success: true, data: results }),
          });
        }
      });
    });
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ success: false, message: 'Method not allowed' }),
  };
};