// Auditoria: componentes JSX usados vs. imports/definicoes locais
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src');
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.jsx?$/.test(e.name) && !/\.test\./.test(e.name)) files.push(p);
  }
})(SRC);

const HTML_OK = /^[a-z]/;
let problems = 0;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');

  // nomes disponiveis: imports (default, named, namespace) + declaracoes locais
  const available = new Set(['React', 'Fragment']);

  for (const m of code.matchAll(/import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"]/g)) {
    const clause = m[1];
    const named = clause.match(/\{([\s\S]*?)\}/);
    if (named) {
      for (const part of named[1].split(',')) {
        const name = part.trim().split(/\s+as\s+/).pop().trim();
        if (name) available.add(name);
      }
    }
    const bare = clause.replace(/\{[\s\S]*?\}/g, '').replace(/,/g, ' ').trim();
    for (const tok of bare.split(/\s+/)) {
      const t = tok.replace(/^\*\s*as\s*/, '').trim();
      if (t && t !== '*' && t !== 'as') available.add(t);
    }
  }

  for (const m of code.matchAll(/(?:function|const|let|class)\s+([A-Z][A-Za-z0-9_]*)/g)) available.add(m[1]);
  // props destructuring renomeado, ex: { icon: Icon }
  for (const m of code.matchAll(/:\s*([A-Z][A-Za-z0-9_]*)\s*[,}]/g)) available.add(m[1]);

  // tags JSX usadas
  const used = new Set();
  for (const m of code.matchAll(/<([A-Z][A-Za-z0-9_.]*)/g)) used.add(m[1].split('.')[0]);

  for (const tag of used) {
    if (HTML_OK.test(tag)) continue;
    if (!available.has(tag)) {
      console.log(`### FALTANDO  ${path.relative(SRC, file)}  ->  <${tag}>`);
      problems++;
    }
  }
}

console.log(problems === 0
  ? `OK: nenhum componente JSX indefinido em ${files.length} arquivos.`
  : `\n${problems} problema(s) encontrado(s).`);
