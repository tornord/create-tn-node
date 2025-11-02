#! /usr/bin/env node

import { dirname, join, resolve } from "path";

import { fileURLToPath } from "url";
import fs from "fs";
import prompts from "prompts";

const templatesFolder = resolve(dirname(fileURLToPath(import.meta.url)), "..", "templates");
const templateNames = fs
  .readdirSync(templatesFolder)
  .filter((f) => fs.lstatSync(join(templatesFolder, f)).isDirectory());

function getFilesInFolder(folder) {
  return fs.readdirSync(folder).filter((f) => !fs.lstatSync(join(folder, f)).isDirectory());
}

function copyFile(filePath, filename, srcFolder, destFolder, replace = true) {
  const f = join(destFolder, filePath, filename);
  if (!replace && fs.existsSync(f)) {
    return;
  }
  const content = fs.readFileSync(join(srcFolder, filePath, filename), "utf-8");
  if (!fs.existsSync(join(destFolder, filePath))) {
    fs.mkdirSync(join(destFolder, filePath), { recursive: true });
  }
  fs.writeFileSync(join(destFolder, filePath, filename), content, "utf-8");
}

function copyFolder(filePath, srcFolder, destFolder, replace = true) {
  const fs = getFilesInFolder(join(srcFolder, filePath));
  fs.forEach((f) => copyFile(filePath, f, srcFolder, destFolder, replace));
}

function copyTemplate(templateName, projectName) {
  const cwd = process.cwd();
  const srcFolder = join(templatesFolder, templateName);
  const destFolder = join(cwd, projectName);
  copyFolder(".", templatesFolder, destFolder, false);
  copyFolder(".", srcFolder, destFolder, false);
  copyFolder("src", srcFolder, destFolder, false);
  if (fs.existsSync(join(srcFolder, "static"))) {
    copyFolder("static", srcFolder, destFolder, false);
    if (fs.existsSync(join(srcFolder, "static", "draco"))) {
      copyFolder("draco", join(srcFolder, "static"), join(destFolder, "static"), false);
    }
  }
  if (fs.existsSync(join(srcFolder, ".github"))) {
    copyFolder(".github", srcFolder, destFolder, false);
  }
  copyFolder(".vscode", srcFolder, destFolder, false);
  fs.writeFileSync(join(destFolder, ".env"), "Secrets here\n", "utf-8");
  fs.writeFileSync(join(destFolder, ".npmrc"), "legacy-peer-deps=true\n", "utf-8");

  const packageJson = JSON.parse(fs.readFileSync(join(destFolder, "package.json"), "utf-8"));
  packageJson.name = projectName;
  fs.writeFileSync(join(destFolder, "package.json"), JSON.stringify(packageJson, null, 2), "utf-8");
}

async function main() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const { projectName, templateIndex } = await prompts([
    {
      type: "text",
      name: "projectName",
      message: `Project name`,
      initial: `test${date}`,
    },
    {
      type: "select",
      name: "templateIndex",
      message: "Project type",
      choices: templateNames,
    },
  ]);
  const templateName = templateNames[templateIndex];
  copyTemplate(templateName, projectName);
}

main();
