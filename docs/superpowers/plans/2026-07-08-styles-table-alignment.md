# Styles Table Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ERP styles list expose the same shared item-management columns and bulk update affordances as the parts list, while keeping style color information.

**Architecture:** Extend the styles list route to load the same support data that powers the parts list table, then update `StylesTable` to reuse the same inline-edit, filtering, and bulk-update patterns for shared item fields. Add a focused unit test around the default styles-table column coverage so future regressions are caught without needing a full UI harness.

**Tech Stack:** React Router, TanStack Table, Vitest, Biome, Carbon inline table editors

## Global Constraints

- Keep the change focused to the styles list route and styles table implementation.
- Follow the existing `PartsTable` UX for shared item fields instead of inventing new patterns.
- Preserve style-specific color visibility.
- Use TDD: write the failing test before production code changes.

---
