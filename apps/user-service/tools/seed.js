const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration(client, migration) {
  if (!migration || !Array.isArray(migration)) return;

  for (const query of migration) {
    try {
      await client.query(query);
    } catch (error) {
      console.error('❌ Migration query failed:');
      console.error(query);
      throw error;
    }
  }
}

async function fixDefaultIds(client) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await client.query(`
    ALTER TABLE permissions
    ALTER COLUMN id SET DEFAULT gen_random_uuid()
  `);

  await client.query(`
    ALTER TABLE roles
    ALTER COLUMN id SET DEFAULT gen_random_uuid()
  `);
}

async function seedPermissions(client, permissions) {
  if (!permissions || !Array.isArray(permissions)) return;

  for (const name of permissions) {
    await client.query(
      `
      INSERT INTO permissions (id, name, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, now(), now())
      ON CONFLICT (name) DO UPDATE SET
        updated_at = now()
      `,
      [name],
    );
  }
}

async function seedRoles(client, roles) {
  if (!roles || !Array.isArray(roles)) return;

  for (const role of roles) {
    const { rows } = await client.query(
      `
      INSERT INTO roles (id, name, description, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, now(), now())
      ON CONFLICT (name)
      DO UPDATE SET
        description = EXCLUDED.description,
        updated_at = now()
      RETURNING id
      `,
      [role.name, role.description],
    );

    let roleId = rows[0]?.id;

    if (!roleId) {
      const result = await client.query(
        `
        SELECT id
        FROM roles
        WHERE name = $1
        `,
        [role.name],
      );

      roleId = result.rows[0]?.id;
    }

    if (!roleId) {
      throw new Error(`Role not found after insert: ${role.name}`);
    }

    let permissions = role.permissions;

    if (permissions === 'ALL') {
      const result = await client.query(`
        SELECT name
        FROM permissions
      `);

      permissions = result.rows.map((row) => row.name);
    }

    if (!Array.isArray(permissions)) {
      throw new Error(`Invalid permissions for role: ${role.name}`);
    }

    await client.query(
      `
      DELETE FROM role_permissions
      WHERE role_id = $1
      AND permission_id NOT IN (
        SELECT id
        FROM permissions
        WHERE name = ANY($2::text[])
      )
      `,
      [roleId, permissions],
    );

    await client.query(
      `
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT $1, id
      FROM permissions
      WHERE name = ANY($2::text[])
      ON CONFLICT DO NOTHING
      `,
      [roleId, permissions],
    );
  }
}

async function processFile(filePath, client) {
  console.log(`🚀 Running seeder: ${path.basename(filePath)}`);

  const raw = fs.readFileSync(filePath, 'utf8');
  const seed = JSON.parse(raw);

  await client.query('BEGIN');

  try {
    await runMigration(client, seed.migration);

    await fixDefaultIds(client);

    await seedPermissions(client, seed.permissions);

    await seedRoles(client, seed.roles);

    await client.query('COMMIT');

    console.log(`✅ Seeder completed: ${path.basename(filePath)}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

async function bootstrap() {
  const dirPath = process.argv[2];

  if (!dirPath) {
    console.error('❌ Please provide a seeder directory path');
    process.exit(1);
  }

  const absoluteDir = path.resolve(dirPath);

  if (!fs.existsSync(absoluteDir)) {
    console.error(`❌ Seeder directory not found: ${absoluteDir}`);
    process.exit(1);
  }

  const client = new Client({
    connectionString:
      process.env.POSTGRES_URI || 'postgresql://postgres:postgres@localhost:5432/user_db',
  });

  try {
    await client.connect();

    const files = fs
      .readdirSync(absoluteDir)
      .filter((file) => file.endsWith('.json'))
      .sort();

    for (const file of files) {
      const filePath = path.join(absoluteDir, file);
      await processFile(filePath, client);
    }

    console.log('🎉 All seeders executed successfully!');
  } catch (error) {
    console.error('❌ Error while seeding:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

bootstrap();
