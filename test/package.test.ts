import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DefaultResourceLoader, SettingsManager } from "@earendil-works/pi-coding-agent";
import { afterEach, expect, it } from "vitest";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { pi: unknown; files: unknown; comchatx: { skills: Record<string, unknown> } };
const scratches: string[] = [];
afterEach(() => { for (const scratch of scratches.splice(0)) rmSync(scratch, { recursive: true, force: true }); });

const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]));

it("the pinned pi lists the package's skills as its manifest names them, with nothing it could not read, and no templates", async () => {
  const home = mkdtempSync(join(tmpdir(), "pi-package-"));
  scratches.push(home);
  const agentDir = join(home, "agent");
  const cwd = join(home, "project");
  for (const directory of [agentDir, cwd]) mkdirSync(directory);
  writeFileSync(join(agentDir, "settings.json"), JSON.stringify({ defaultProjectTrust: "always", packages: [ROOT] }));
  const loader = new DefaultResourceLoader({ cwd, agentDir, settingsManager: SettingsManager.create(cwd, agentDir) });
  await loader.reload();
  const { skills, diagnostics } = loader.getSkills();
  expect(diagnostics).toEqual([]);
  expect(manifest.pi).toEqual({ skills: ["./skills"] });
  // The Plugins page names a package's skills from its `comchatx` field alone.
  expect(skills.map((skill) => skill.name).sort()).toEqual(Object.keys(manifest.comchatx.skills).sort());
  for (const skill of skills) expect(skill.description.trim(), skill.name).not.toBe("");
  const { prompts, diagnostics: unread } = loader.getPrompts();
  expect([prompts, unread]).toEqual([[], []]);
});

it("ships its skills, its READMEs and its license, and nothing else", () => {
  type Packed = { files: { path: string }[] };
  // npm 11 answers a list of packs and npm 12 an object keyed by the package's name.
  const answer = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: ROOT, encoding: "utf8" })) as Packed[] | Record<string, Packed>;
  const packed = Array.isArray(answer) ? answer : Object.values(answer);
  const shipped = ["skills"].flatMap((directory) => walk(join(ROOT, directory)).map((path) => relative(ROOT, path)));
  expect(packed[0]!.files.map((file) => file.path).sort()).toEqual(["LICENSE", "README.md", "README.zh-CN.md", "package.json", ...shipped].sort());
  expect(manifest.files).toEqual(["skills", "README.zh-CN.md"]);
});

it("words each of the six fields the gate's manifest declares with a label in both languages, and a help line in both where it has one", () => {
  type Words = { en: string; zh: string };
  const fields = (manifest.comchatx as unknown as { source: { fields: Record<string, { label: Words; help?: Words }> } }).source.fields;
  expect(Object.keys(fields)).toEqual(["endpoint", "bucket", "region", "key_id", "secret_key", "public_base"]);
  for (const [field, { label, help, ...rest }] of Object.entries(fields)) {
    expect(rest, field).toEqual({});
    for (const words of [label, ...(help === undefined ? [] : [help])]) {
      expect(Object.keys(words).sort(), field).toEqual(["en", "zh"]);
      expect([words.en.trim(), words.zh.trim()].every((one) => one !== ""), field).toBe(true);
    }
  }
  expect(Object.entries(fields).filter(([, words]) => words.help === undefined).map(([field]) => field)).toEqual(["bucket", "secret_key"]);
});
