const { spawn } = require('child_process');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL no existe.');
  process.exit(1);
}

try {
  const db = new URL(databaseUrl);

  process.env.DB_DIALECT = 'postgres';
  process.env.DB_HOST = db.hostname;
  process.env.DB_PORT = db.port || '5432';
  process.env.DB_DATABASE = decodeURIComponent(db.pathname.replace(/^\//, ''));
  process.env.DB_USER = decodeURIComponent(db.username);
  process.env.DB_PASSWORD = decodeURIComponent(db.password);

  console.log('PostgreSQL de Blitz configurado para NocoBase.');
  console.log(`DB_HOST=${process.env.DB_HOST}`);
  console.log(`DB_PORT=${process.env.DB_PORT}`);
  console.log(`DB_DATABASE=${process.env.DB_DATABASE}`);

  const child = spawn('/app/docker-entrypoint.sh', [], {
    stdio: 'inherit',
    env: process.env
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 1);
    }
  });

  process.on('SIGTERM', () => child.kill('SIGTERM'));
  process.on('SIGINT', () => child.kill('SIGINT'));

} catch (error) {
  console.error('ERROR al preparar PostgreSQL para NocoBase:', error.message);
  process.exit(1);
}
