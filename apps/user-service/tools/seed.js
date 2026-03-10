const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function mapData(_data) {
  return _data.map((item) => {
    return Object.entries(item).reduce((acc, [key, value]) => {
      if (value?.$date) {
        acc[key] = new Date(value.$date);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  });
}

async function runMigration(client, migration) {
  if (!migration) return;

  for (const query of migration) {
    await client.query(query);
  }
}

async function insertRows(client, table, rows) {
  if (!rows.length) return;

  const columns = Object.keys(rows[0]);

  const values = rows.map((row, i) => {
    const start = i * columns.length;
    const params = columns.map((_, j) => `$${start + j + 1}`);
    return `(${params.join(',')})`;
  });

  const flatValues = rows.flatMap((row) => columns.map((c) => row[c]));

  const query = `
    INSERT INTO ${table} (${columns.join(',')})
    VALUES ${values.join(',')}
  `;

  await client.query(query, flatValues);
}

async function processFile(filePath, mode, client) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const seed = JSON.parse(raw);

  await runMigration(client, seed.migration);

  if (seed.permissions) {
    for (const name of seed.permissions) {
      await client.query(
        `INSERT INTO permissions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [name],
      );
    }
  }

  if (seed.roles) {
    for (const role of seed.roles) {
      const { rows } = await client.query(
        `
      INSERT INTO roles(name, description)
      VALUES($1,$2)
      ON CONFLICT(name)
      DO UPDATE SET description=EXCLUDED.description
      RETURNING id
      `,
        [role.name, role.description],
      );

      const roleId =
        rows[0]?.id ||
        (await client.query(`SELECT id FROM roles WHERE name=$1`, [role.name])).rows[0].id;

      let permissions = role.permissions;

      if (permissions === 'ALL') {
        const result = await client.query(`SELECT name FROM permissions`);
        permissions = result.rows.map((r) => r.name);
      }

      // DELETE permissions not in seed
      await client.query(
        `
      DELETE FROM role_permissions
      WHERE role_id = $1
      AND permission_id NOT IN (
        SELECT id FROM permissions WHERE name = ANY($2)
      )
      `,
        [roleId, permissions],
      );

      // INSERT missing permissions
      await client.query(
        `
      INSERT INTO role_permissions(role_id, permission_id)
      SELECT $1, id FROM permissions
      WHERE name = ANY($2)
      ON CONFLICT DO NOTHING
      `,
        [roleId, permissions],
      );
    }
  }
}

async function bootstrap() {
  const dirPath = process.argv[2];
  const mode = process.argv[3] || 'migrate';

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

    const files = fs.readdirSync(absoluteDir).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(absoluteDir, file);
      await processFile(filePath, mode, client);
    }

    console.log('🎉 All seeders executed successfully!');
  } catch (err) {
    console.error('❌ Error while seeding:', err);
  } finally {
    await client.end();
  }
}

bootstrap();
