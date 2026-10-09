#!/usr/bin/env bash
# PostToolUse: format file yang baru ditulis Claude dengan Biome.
# Hanya format (bukan check --write) agar import yang belum dipakai tidak ikut terhapus.
file=$(bun -e '
const s = await Bun.stdin.text();
let p = "";
try { p = JSON.parse(s).tool_input?.file_path ?? ""; } catch {}
process.stdout.write(p.replaceAll(String.fromCharCode(92), "/"));
')
[ -f "$file" ] || exit 0
cd "$CLAUDE_PROJECT_DIR" && ./node_modules/.bin/biome format --write --no-errors-on-unmatched "$file"
