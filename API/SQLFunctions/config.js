


const config = {
    user: 'DTAdministrator',
    password: 'Singapore$11',
    server: 'dtazuredb.database.windows.net',
    database: 'SGWIREPRD',
    pool: {
        max: 10,
        min: 2,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,// Use this if you're on Windows Azure
        packetSize: 16384,

    }
}

//
  module.exports.config= config;
