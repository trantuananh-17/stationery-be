const { join, resolve } = require('path');
const { readFileSync } = require('fs');

/**
 * `paths` của tsconfig.base.json không còn khai `baseUrl` (đã bị TypeScript đánh dấu
 * deprecated), nhưng resolver của webpack lại đọc alias qua chính `baseUrl` đó.
 * Sinh alias trực tiếp từ `paths` để tsconfig vẫn là nguồn sự thật duy nhất.
 */
const workspaceRoot = __dirname;

const tsconfig = JSON.parse(
  readFileSync(join(workspaceRoot, 'tsconfig.base.json'), 'utf-8').replace(
    /^\s*\/\/.*$/gm,
    '',
  ),
);

const paths = tsconfig.compilerOptions?.paths ?? {};

const tsconfigAliases = Object.entries(paths).reduce((aliases, [pattern, targets]) => {
  const alias = pattern.replace(/\/\*$/, '');
  const target = targets[0].replace(/\/\*$/, '');

  aliases[alias] = resolve(workspaceRoot, target);

  return aliases;
}, {});

module.exports = { tsconfigAliases };
