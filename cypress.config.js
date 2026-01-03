const { defineConfig } = require("cypress");
const sql = require("mssql");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      on('task', {
        async deleteUser(username) {
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

          try {
            let pool = await sql.connect(DBCONFIG);
            const query = `DELETE FROM UserMaster WHERE Username = '${username}'`;
            const result = await pool.request().query(query);
            return result.rowsAffected;
          } catch (error) {
            console.error("Erro no SQL:", error);
            throw error;
          } finally {
            await sql.close();
          }
        }
      })
    },
  },
});
