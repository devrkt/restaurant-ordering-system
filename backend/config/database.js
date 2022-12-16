import mysql from "mysql2";

// create the connection to database

const db_config = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "inf"

    // acquireTimeout: 10_000,
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 2,
    // enableKeepAlive: true,
    // keepAliveInitialDelay: 20_000
};

var db;

function handleDisconnect() {
  db = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  db.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  db.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();



export default db;