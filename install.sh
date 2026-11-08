#!/usr/bin/env bash
# Install dsh-tv into a DeepSeek Harness profile.
#
# Usage:
#   ./install.sh                 # install into the active desktop profile
#   ./install.sh --profile web   # install into another profile name
#   DSH_PROFILE_DIR=/path ./install.sh
#
# It copies this package into <profile>/node_modules and appends the package to
# the profile's dsh.profile.bundles list, which composes cordis.patch.yml.
# Restart DeepSeek Harness afterwards. Idempotent: re-running only overwrites.
set -euo pipefail

PROFILE_NAME="desktop"
PROFILE_EXPLICIT=0
while [ $# -gt 0 ]; do
  case "$1" in
    --profile) PROFILE_NAME="${2:?--profile needs a value}"; PROFILE_EXPLICIT=1; shift 2 ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
DSH_HOME_DIR="${DSH_HOME:-$HOME/.dsh}"
if [ "$PROFILE_EXPLICIT" -eq 1 ]; then
  PROFILE_DIR="$DSH_HOME_DIR/profiles/$PROFILE_NAME"
else
  PROFILE_DIR="${DSH_PROFILE_DIR:-$DSH_HOME_DIR/profiles/$PROFILE_NAME}"
fi

if [ ! -f "$PROFILE_DIR/package.json" ]; then
  echo "error: no profile package.json at: $PROFILE_DIR" >&2
  echo "hint: pass --profile <name>, or set DSH_PROFILE_DIR." >&2
  exit 1
fi

TARGET="$PROFILE_DIR/node_modules/dsh-tv"
echo "plugin : $PLUGIN_DIR"
echo "profile: $PROFILE_DIR"
echo "target : $TARGET"

mkdir -p "$PROFILE_DIR/node_modules"
# Remove the previous plugin name so the old registration cannot collide.
rm -rf "$PROFILE_DIR/node_modules/dsh-sidebar-social"
rm -rf "$TARGET"
mkdir -p "$TARGET"
# Copy only what the runtime needs.
cp -R "$PLUGIN_DIR/lib" "$TARGET/lib"
[ -d "$PLUGIN_DIR/assets" ] && cp -R "$PLUGIN_DIR/assets" "$TARGET/assets" || true
cp "$PLUGIN_DIR/package.json" "$TARGET/package.json"
cp "$PLUGIN_DIR/cordis.patch.yml" "$TARGET/cordis.patch.yml"
[ -f "$PLUGIN_DIR/README.md" ] && cp "$PLUGIN_DIR/README.md" "$TARGET/README.md" || true

TODAY="$(date +%Y%m%d-%H%M%S)"
cp "$PROFILE_DIR/package.json" "$PROFILE_DIR/package.json.bak-$TODAY"

# Prefer PATH node; fall back to the runtime node shipped with the app.
NODE_BIN="$(command -v node || true)"
[ -z "$NODE_BIN" ] && NODE_BIN="/Applications/DeepSeek Harness.app/Contents/Resources/runtime/bin/node"
"$NODE_BIN" - "$PROFILE_DIR/package.json" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
pkg.dsh = pkg.dsh || {};
pkg.dsh.profile = pkg.dsh.profile || {};
const bundles = (Array.isArray(pkg.dsh.profile.bundles) ? pkg.dsh.profile.bundles : []).filter((n) => n !== "dsh-sidebar-social");
if (!bundles.includes("dsh-tv")) bundles.push("dsh-tv");
pkg.dsh.profile.bundles = bundles;
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
console.log("bundles ->", bundles.join(", "));
NODE

echo ""
echo "Installed. Now fully quit and relaunch DeepSeek Harness."
echo "Then open the right sidebar guide (⌘J / the panel button) and pick 「刷一刷」."
echo "If the guide does not list it, confirm the profile bundles line contains dsh-tv."
