const { defineConfig } = require("cypress");
const sql = require("mssql");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      const DBCONFIG = {
        user: "sa",
        password: "Mystrong_password123",
        server: "localhost",
        database: "master",
        options: {
          encrypt: false,
          trustServerCertificate: true
        }
      }
      on("task", {
        async deleteUser( { username } ) {
          try {
            let pool = await sql.connect(DBCONFIG);
            const query = `DELETE FROM UserMaster WHERE Username = '${username}'`;
            const result = await pool.request().query(query);
            return result.rowsAffected;
          } catch (error) {
            console.error("SQL error:", error);
            throw error;
          } finally {
            await sql.close();
          }
        },

        async createUser({ firstName, lastName, username, password, gender, userTypeId }) {
          try {
            let pool = await sql.connect(DBCONFIG);
            const query = `INSERT INTO UserMaster VALUES ('${firstName}', '${lastName}', '${username}', '${password}', '${gender}', ${userTypeId})`;
            const result = await pool.request().query(query);
            return result.rowsAffected;
          } catch (error) {
            console.error("SQL error:", error);
            throw error;
          } finally {
            await sql.close();
          }
        }
      })
    },
  },
});
