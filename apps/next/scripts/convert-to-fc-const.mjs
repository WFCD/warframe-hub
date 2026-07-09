#!/usr/bin/env node
/**
 * Convert `export default function Foo` / `function Foo` React components
 * to `const Foo: FC<Props> = ...; export default Foo;`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';

const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.vercel' || name === 'dist' || name === 'scripts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

function parseFile(code, file) {
  return parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
    sourceFilename: file,
  });
}

function isPascalCase(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function fcTypeAnnotation(params) {
  const param = params[0];
  if (param?.typeAnnotation && t.isTSTypeAnnotation(param.typeAnnotation)) {
    return t.tsTypeAnnotation(
      t.tsTypeReference(
        t.identifier('FC'),
        t.tsTypeParameterInstantiation([param.typeAnnotation.typeAnnotation]),
      ),
    );
  }
  return t.tsTypeAnnotation(t.tsTypeReference(t.identifier('FC')));
}

function constComponentDecl(name, params, body, async) {
  const id = t.identifier(name);
  id.typeAnnotation = fcTypeAnnotation(params);
  return t.variableDeclaration('const', [
    t.variableDeclarator(id, t.arrowFunctionExpression(params, body, async)),
  ]);
}

function ensureFcImport(ast) {
  for (const node of ast.program.body) {
    if (!t.isImportDeclaration(node) || node.source.value !== 'react') continue;
    const hasFc = node.specifiers.some(
      (s) => t.isImportSpecifier(s) && t.isIdentifier(s.imported) && s.imported.name === 'FC',
    );
    if (hasFc) return;
    node.specifiers.push(t.importSpecifier(t.identifier('FC'), t.identifier('FC')));
    node.importKind = node.importKind === 'type' || node.specifiers.every((s) => t.isImportSpecifier(s) && s.importKind === 'type')
      ? 'type'
      : node.importKind;
    return;
  }

  ast.program.body.unshift(
    t.importDeclaration([t.importSpecifier(t.identifier('FC'), t.identifier('FC'))], t.stringLiteral('react')),
  );
  ast.program.body[0].importKind = 'type';
}

function transformFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parseFile(code, file);
  } catch (err) {
    console.warn(`skip parse error: ${file}`, err.message);
    return false;
  }

  let changed = false;

  traverse(ast, {
    ExportDefaultDeclaration(pathNode) {
      const decl = pathNode.node.declaration;
      if (!t.isFunctionDeclaration(decl) || !decl.id || !isPascalCase(decl.id.name)) return;
      if (decl.id.name === 'createClientPage') return;

      const { name } = decl.id;
      pathNode.replaceWithMultiple([
        constComponentDecl(name, decl.params, decl.body, decl.async),
        t.exportDefaultDeclaration(t.identifier(name)),
      ]);
      changed = true;
    },
    FunctionDeclaration(pathNode) {
      const { node } = pathNode;
      if (!node.id || !isPascalCase(node.id.name)) return;
      if (pathNode.parentPath.isExportDefaultDeclaration()) return;

      pathNode.replaceWith(constComponentDecl(node.id.name, node.params, node.body, node.async));
      changed = true;
    },
  });

  if (!changed) return false;

  ensureFcImport(ast);

  const output = generate(ast, { retainLines: true }, code).code;
  fs.writeFileSync(file, output);
  return true;
}

const files = walk(root);
let count = 0;
for (const file of files) {
  if (transformFile(file)) {
    count += 1;
    console.log(path.relative(root, file));
  }
}
console.log(`Converted ${count} files.`);
