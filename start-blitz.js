const { spawn } = require('child_process');

const env = process.env;
const databaseUrl = env['DATABASE' + '_URL'];

if (!databaseUrl) {
  console.error('ERROR: No se ha recibido la conexion PostgreSQL de Blitz.');
  process.exit(1);
}

try {
  const db = new URL(databaseUrl);

  const vars = {
    ['DB' + '_DIALECT']: 'postgres',
    ['DB' + '_HOST']: db.hostname,
    ['DB' + '_PORT']: db.port || '5432',
    ['DB' + '_DATABASE']: decodeURIComponent(db.pathname.replace(/^\//, '')),
    ['DB' + '_USER']: decodeURIComponent(db.username),
    ['DB' + '_PASSWORD']: decodeURIComponent(db.password)
  };

  Object.assign(env, vars);

  console.log('PostgreSQL de Blitz preparado para NocoBase.');

  const child = spawn('/app/docker-entrypoint.sh', [], {
    stdio: 'inherit',
    env
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
  console.error('ERROR preparando PostgreSQL:', error.message);
  process.exit(1);
}
