import fs from "fs";
import path from "path";
import * as ts from "typescript";

interface TypeUsage {
  typeName: string;
  definedIn: string;
  usedIn: string[];
  isExported: boolean;
}

function findTypeUsages(rootDir: string): TypeUsage[] {
  const typeUsages: Map<string, TypeUsage> = new Map();
  const program = ts.createProgram(getAllTypeScriptFiles(rootDir), {});
  const typeChecker = program.getTypeChecker();

  // First pass: collect all defined types
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.includes("node_modules")) {
      ts.forEachChild(sourceFile, (node) => {
        if (
          ts.isTypeAliasDeclaration(node) ||
          ts.isInterfaceDeclaration(node)
        ) {
          const typeName = node.name.text;
          const isExported = hasExportModifier(node);
          typeUsages.set(typeName, {
            typeName,
            definedIn: sourceFile.fileName,
            usedIn: [],
            isExported,
          });
        }
      });
    }
  }

  // Second pass: find all type usages
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.includes("node_modules")) {
      ts.forEachChild(sourceFile, (node) => {
        findTypeReferences(node, sourceFile.fileName, typeUsages, typeChecker);
      });
    }
  }

  return Array.from(typeUsages.values());
}

function getAllTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllTypeScriptFiles(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false;
  const modifiers = ts.getModifiers(node);
  return (
    modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    ) ?? false
  );
}

function findTypeReferences(
  node: ts.Node,
  fileName: string,
  typeUsages: Map<string, TypeUsage>,
  typeChecker: ts.TypeChecker,
) {
  if (ts.isTypeReferenceNode(node)) {
    const typeName = node.typeName.getText();
    const typeUsage = typeUsages.get(typeName);
    if (typeUsage && !typeUsage.usedIn.includes(fileName)) {
      typeUsage.usedIn.push(fileName);
    }
  }

  ts.forEachChild(node, (child) =>
    findTypeReferences(child, fileName, typeUsages, typeChecker),
  );
}

function analyzeUnusedTypes(rootDir: string) {
  const usages = findTypeUsages(rootDir);

  console.log("\nType Usage Analysis Results:");
  console.log("===========================\n");

  // Find unused types
  const unusedTypes = usages.filter((type) => type.usedIn.length === 0);
  console.log("Potentially Unused Types:");
  console.log("----------------------");
  if (unusedTypes.length === 0) {
    console.log("No unused types found.");
  } else {
    unusedTypes.forEach((type) => {
      console.log(`\n${type.typeName}`);
      console.log(`Defined in: ${type.definedIn}`);
      console.log(`Exported: ${type.isExported ? "Yes" : "No"}`);
    });
  }

  // Find types with single usage
  const singleUsageTypes = usages.filter((type) => type.usedIn.length === 1);
  console.log("\nTypes Used Only Once:");
  console.log("-------------------");
  singleUsageTypes.forEach((type) => {
    console.log(`\n${type.typeName}`);
    console.log(`Defined in: ${type.definedIn}`);
    console.log(`Used in: ${type.usedIn[0]}`);
  });

  // Most used types
  const mostUsedTypes = [...usages]
    .sort((a, b) => b.usedIn.length - a.usedIn.length)
    .slice(0, 5);

  console.log("\nMost Used Types:");
  console.log("---------------");
  mostUsedTypes.forEach((type) => {
    console.log(`\n${type.typeName}`);
    console.log(`Used in ${type.usedIn.length} files`);
  });
}

// Usage example
const projectRoot = process.argv[2] || "./src";
analyzeUnusedTypes(projectRoot);
