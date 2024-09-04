import DatabaseConfig from './database.config';

export default () => ({
  database: {
    ...DatabaseConfig(),
  },
});
