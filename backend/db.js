import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.AZURE_SQL_CONNECTION_STRING;

const poolPromise = new sql.ConnectionPool(connectionString)
  .connect()
  .then(pool => {
    console.log('✅ Connected to Azure SQL via connection string');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    throw err;
  });

export { sql, poolPromise };