# Contributing to RouteMate

Thank you for your interest in contributing to RouteMate! We are excited to build a "Pocket-Friendly" travel planner with you.

## How Can I Contribute?

### Reporting Bugs
- Use the **Bug Report** template.
- Provide a clear description and steps to reproduce.

### Suggesting Features
- Use the **Feature Request** template.
- Explain the "Pocket-Friendly" value prop of the feature.

### Pull Requests
1. **Fork the repo** and create your branch from `main`.
2. **Setup environment**: Use the `Settings` UI in the app to add your **OpenRouter API Key** for testing.
3. **Commit Messages**: We use [Conventional Commits](https://www.conventionalcommits.org/).
4. **Test your changes**: 
    - Verify on mobile viewport (500x855).
    - If modifying data flow, verify real-time reactivity (LiveQuery).
    - If modifying sorting logic, verify chronological flow using the "Human-First" 6-rank engine.
5. **Submit your PR**: The automated system will create a Release PR if your changes are merged.


## Style Guide

- **TypeScript**: Always use strict typing. Avoid `any` at all costs.
- **The Sole Button Standard**: Always use the `.btn-primary` utility for primary actions. Do not use ad-hoc button styles.
- **The 24px Rule**: All cards and major containers must use `rounded-[24px]`.
- **Animations**: Use `framer-motion` for all micro-interactions. Prefer spring-based physics over linear easing.
- **Headers**: Maintain the synchronized `pt-[var(--header-pt)]` rhythm for all navigation-level headers.

## Attribution

By contributing, you agree that your contributions will be licensed under the MIT License.
