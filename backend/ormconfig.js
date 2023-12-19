import { DataSource } from 'typeorm';

const argv = process.argv;

const fArgsIdx = argv.findIndex((arg) => arg === '-d');

if (fArgsIdx < 0) {
  console.error('SHOULD PROVIDE PATH TO ormconfig.ts FILE');
  process.exit(-1);
}

const initial = async () => {
  const config = require(`${process.cwd()}/${argv.at(fArgsIdx + 1)}`).pg
    .options;
  const connection = await new DataSource({
    ...config,
    database: 'postgres',
    logging: undefined,
    name: 'initial',
  }).initialize();

  const query = connection.createQueryRunner();
  await query.createDatabase(config.database, true);
  await query.release();
  await connection.destroy();

  const schemaConnection = await new DataSource(config).initialize();
  const schemaQuery = schemaConnection.createQueryRunner();
  await schemaQuery.createSchema(config['schema'], true);
  await schemaQuery.release();
  await schemaConnection.destroy();
};

initial().then(() =>
  childProcess.execSync(`typeorm-ts-node-commonjs ${argv.slice(2).join(' ')}`, {
    encoding: 'utf8',
    stdio: ['inherit', 'inherit', 'inherit'],
  }),
);
