import { migrateProject } from '../services/migration.service.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function runMigrateCommand(): void
{
    migrateProject();
}
