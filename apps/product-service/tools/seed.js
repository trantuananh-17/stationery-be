import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

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

async function seedCategories(client, rows) {
  const slugMap = new Map();

  for (const row of rows) {
    const parentId = row.parentSlug ? slugMap.get(row.parentSlug) : null;

    const result = await client.query(
      `
      INSERT INTO categories(name, slug, parent_id, position, is_active)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT(slug)
      DO UPDATE SET
        name = EXCLUDED.name,
        parent_id = EXCLUDED.parent_id,
        position = EXCLUDED.position,
        is_active = EXCLUDED.is_active
      RETURNING id
      `,
      [row.name, row.slug, parentId, row.position || 0, row.isActive ?? true],
    );

    slugMap.set(row.slug, result.rows[0].id);
  }
}

async function seedAttributes(client, rows) {
  for (const row of rows) {
    await client.query(
      `
      INSERT INTO attributes(name, slug, type, sort_order, is_active)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT(slug)
      DO UPDATE SET
        name = EXCLUDED.name,
        sort_order = EXCLUDED.sort_order,
        is_active = EXCLUDED.is_active,
        type = EXCLUDED.type
      `,
      [row.name, row.slug, row.type, row.sortOrder || 0, row.isActive ?? true],
    );
  }
}

async function seedAttributeValues(client, rows) {
  for (const row of rows) {
    const attr = await client.query(`SELECT id FROM attributes WHERE slug = $1`, [
      row.attributeSlug,
    ]);

    if (!attr.rows.length) {
      console.warn(`⚠️ Attribute not found: ${row.attributeSlug}`);
      continue;
    }

    const attributeId = attr.rows[0].id;

    await client.query(
      `
      INSERT INTO attribute_values(attribute_id, value, slug, sort_order)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT(attribute_id, slug)
      DO UPDATE SET
        value = EXCLUDED.value,
        sort_order = EXCLUDED.sort_order
      `,
      [attributeId, row.value, row.slug, row.sortOrder || 0],
    );
  }
}

async function processFile(filePath, client) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const seed = JSON.parse(raw);

  await runMigration(client, seed.migration);

  if (seed.collection === 'categories') {
    await seedCategories(client, seed.data);
    return;
  }

  if (seed.collection === 'attributes') {
    await seedAttributes(client, seed.data);
    return;
  }

  if (seed.collection === 'attribute_values') {
    await seedAttributeValues(client, seed.data);
    return;
  }

  if (seed.collection && seed.data) {
    const rows = mapData(seed.data);
    await insertRows(client, seed.collection, rows);
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
      process.env.POSTGRES_URI || 'postgresql://postgres:postgres@localhost:5432/product_db',
  });

  try {
    await client.connect();

    const files = fs
      .readdirSync(absoluteDir)
      .filter((f) => f.endsWith('.json'))
      .sort();

    for (const file of files) {
      const filePath = path.join(absoluteDir, file);
      console.log(`🌱 Running seed: ${file}`);
      await processFile(filePath, client);
    }

    console.log('🎉 All seeders executed successfully!');
  } catch (err) {
    console.error('❌ Error while seeding:', err);
  } finally {
    await client.end();
  }
}

bootstrap();
