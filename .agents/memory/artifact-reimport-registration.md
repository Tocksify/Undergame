---
name: Artifact registration lost on GitHub re-import
description: Fix for a fresh-imported repl where artifacts/*/.replit-artifact/artifact.toml files exist on disk (with real code already built out) but listArtifacts() returns empty and no workflows exist.
---

## Symptom
Project was imported from GitHub. `artifacts/<slug>/.replit-artifact/artifact.toml` files exist and look correct (matching a fully-built-out `replit.md`), but:
- `listArtifacts()` returns `[]`
- No workflows are configured (`.replit` has no workflow entries for the artifacts)
- `WorkflowsRestart` fails with "doesn't exist in config" for the expected `artifacts/<slug>: <service>` names

This happens because the platform's artifact registry is separate from the `artifact.toml` files committed to git — a fresh import doesn't automatically re-register them.

## Fix
Do NOT call `createArtifact()` again (it fails with `ARTIFACT_DIR_EXISTS` since the directory already exists, and won't touch existing files). Instead, force a no-op re-validation of each existing `artifact.toml` via `verifyAndReplaceArtifactToml`:

1. Copy each `artifacts/<slug>/.replit-artifact/artifact.toml` to a sibling `artifact.edit.toml` (unchanged content is fine).
2. Call `verifyAndReplaceArtifactToml({ tempFilePath, artifactTomlPath })` for each one.

One such call re-registered ALL artifacts in the project at once (not just the one targeted) and also added their workflow entries to `.replit`.

**Why:** the artifact.toml→registry sync only runs as a side effect of `verifyAndReplaceArtifactToml`'s validation pass, not on repl import/startup.

**How to apply:** whenever a re-imported/forked project has artifact.toml files on disk but `listArtifacts()` is empty and no matching workflows exist, run this re-validation trick before trying anything more invasive (recreating artifacts, hand-editing `.replit` workflow entries, etc.).
