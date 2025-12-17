# Documentation Philosophy

## Overview

This document explains the purpose and philosophy behind the project's documentation approach, specifically the role of `.cursorrules` and the `docs/planning/` directory.

## Purpose of Documentation

Documentation in this project serves multiple critical functions:

1. **Guiding AI Assistants** - Providing clear context and rules for AI coding assistants (like Cursor)
2. **Preserving Decision Context** - Capturing the "why" behind technical decisions, not just the "what"
3. **Enabling Code Review** - Making decisions defensible and reviewable by lead engineers
4. **Onboarding** - Helping new developers understand project structure and conventions
5. **Maintenance** - Documenting trade-offs and considerations for future modifications

## `.cursorrules` - AI Assistant Guidelines

### Purpose

The `.cursorrules` file serves as a comprehensive guide for AI coding assistants (primarily Cursor) to generate code that aligns with:

- Spiral's frontend standards and expectations
- The project's architectural decisions
- Best practices for production-quality code
- Type safety and code quality requirements

### Key Functions

1. **Technology Constraints** - Enforces required tech stack (Next.js, TypeScript, Chakra UI, etc.)
2. **Project Structure** - Defines file organization and naming conventions
3. **Code Quality Rules** - Specifies testing requirements, DRY principles, folder structure philosophy
4. **Architectural Philosophy** - Guides separation of concerns, testability, composability
5. **Priority Order** - Establishes what matters most (correctness > architecture > type safety > readability)

### How It Works

- Cursor reads `.cursorrules` automatically when generating code
- Rules are structured hierarchically with clear priorities
- MUST/ SHOULD/ MUST NOT language provides clear guidance
- Rules are specific enough to be actionable but flexible enough for edge cases

### Maintenance

- Rules should be updated as the project evolves
- New patterns or conventions should be added when established
- Rules should reflect actual project practices, not aspirational ones

## `docs/planning/` - Decision Documentation

### Purpose

The `docs/planning/` directory contains detailed documentation of:

- **Technical decisions** - Why specific tools, patterns, or approaches were chosen
- **Implementation steps** - How features were built and configured
- **Reasoning** - Trade-offs, alternatives considered, and justifications
- **Evolution** - How the project setup evolved over time

### Structure

Each document follows a consistent pattern:

1. **Overview** - High-level summary of what was done
2. **Decision** - What was chosen and why (if applicable)
3. **Implementation Steps** - Detailed steps taken
4. **Reasoning** - Justification and trade-offs
5. **Files Created/Modified** - What changed
6. **Verification** - How success was confirmed
7. **Next Steps** - Future considerations

### Document Numbering

Documents are numbered sequentially:

- `00-` - Meta-documentation (this file, specs, plans)
- `01-` - Initial setup and foundational decisions
- `02+` - Subsequent features and enhancements

### Key Principles

1. **Copyable and Extensible** - Documentation should be useful for similar projects
2. **Defensible** - Decisions should be explainable during code review
3. **Realistic** - Documents actual decisions, not idealistic ones
4. **Context-Rich** - Includes alternatives considered and trade-offs
5. **Maintainable** - Updated as project evolves

## Relationship Between `.cursorrules` and `docs/planning/`

### `.cursorrules` → `docs/planning/`

- Rules in `.cursorrules` are often derived from decisions documented in `docs/planning/`
- Planning docs provide the "why" behind the rules
- When rules change, planning docs should be updated to explain the change

### `docs/planning/` → `.cursorrules`

- Planning docs capture decisions that inform rules
- Architectural decisions become rules for consistency
- Trade-offs documented in planning help refine rules

### Together They Provide

1. **Consistency** - Rules ensure consistent code generation
2. **Context** - Planning docs explain why rules exist
3. **Evolution** - Both can be updated as project matures
4. **Reviewability** - Clear documentation makes code review easier
5. **Maintainability** - Future developers understand decisions

## Documentation Best Practices

### When to Document

- **Major decisions** - Technology choices, architectural patterns
- **Non-obvious choices** - Things that might be questioned in review
- **Trade-offs** - When multiple valid approaches exist
- **Setup steps** - Complex configuration or setup processes
- **Breaking changes** - When conventions or patterns change

### What to Document

- **What** - What was done or decided
- **Why** - Reasoning and justification
- **Alternatives** - What else was considered
- **Trade-offs** - Benefits and drawbacks
- **How** - Implementation details (if non-obvious)

### What NOT to Document

- **Obvious choices** - Standard practices that don't need explanation
- **Temporary solutions** - Unless they're intentionally temporary
- **Overly detailed steps** - Focus on decisions, not every command run
- **Aspirational content** - Document what is, not what should be

## Benefits of This Approach

### For AI Assistants

- Clear rules prevent inconsistent code generation
- Context helps AI make better decisions
- Examples in planning docs guide AI understanding

### For Code Review

- Decisions are documented and defensible
- Trade-offs are explicit and reviewable
- Rules ensure consistency across contributions

### For Maintenance

- Future developers understand why things are the way they are
- Changes can be made with full context
- Patterns can be extended consistently

### For Onboarding

- New developers can understand project structure quickly
- Decisions are explained, not just assumed
- Patterns are documented and discoverable

## Conclusion

The combination of `.cursorrules` and `docs/planning/` creates a comprehensive documentation system that:

- Guides AI assistants to generate consistent, high-quality code
- Preserves the context and reasoning behind technical decisions
- Makes the codebase reviewable and maintainable
- Enables efficient onboarding and knowledge transfer

This approach treats documentation as a first-class concern, recognizing that well-documented code is more maintainable, reviewable, and extensible.
