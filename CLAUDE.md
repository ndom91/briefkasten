## Project Overview

This is a modern booksmarks and RSS feed reader app built with the following
technologies:

- **SvelteKit 2.0** with **Svelte 5** (runes) and **TypeScript strict mode**
- **Tailwind CSS 4.0** with **shadcn-svelte** UI components
- **pnpm** as package manager

## Code Standards & Preferences

### Code Style

- **No semicolons** (configured in Prettier)
- **2 spaces indentation** (not tabs)
- **TypeScript strict mode** - always maintain type safety
- **SIMPLE solutions** - avoid overengineering
- **Only minimal comments** unless explicitly requested
- **No Emojis**

### Package Management

- **Always use `pnpm`** instead of npm or yarn
- **Never use `npx`** - use `pnpm dlx` instead

### Interactive Commands

- **NEVER run interactive commands** - always ask user to run them
- Interactive commands include:
  - `pnpm create svelte`
  - `pnpm dlx shadcn-svelte@latest init`
  - `pnpm dev` (development server)
  - `pnpm preview` (preview server)
  - Any command that starts a server
  - Any deployment commands
- Always tell the user what options to select for interactive commands

### File Organization

- Keep components in `apps/web/src/lib/components/`
- Keep utilities in `apps/web/src/lib/utils/`
- Static assets in `apps/web/static/`

## Development Workflow

### Available Scripts

```bash
pnpm dev          # Start dev server (user runs this)
pnpm build        # Build for production
pnpm test:e2e     # E2E tests
pnpm lint:fix     # Lint code
pnpm format:fix   # Format code
pnpm check --output machine  # TypeScript check
```


## Technology-Specific Guidelines

### SvelteKit & Svelte 5

- Use **runes** (`$state`, `$derived`, `$effect`) instead of legacy reactive declarations
- Prefer `let { children } = $props()` over `$$slots`
- Use `{@render children?.()}` for slot rendering

### Tailwind CSS

- Use **Tailwind CSS 4.0** features
- Configure for production optimization
- Use utility classes, avoid custom CSS when possible
- Dark mode support ready but not implemented by default

### shadcn-svelte

- Add components with `pnpm dlx shadcn-svelte@latest add <component>`
- Components are in `src/lib/components/ui/`
- Use tree-shakeable imports
- Customize components as needed

### TypeScript

- **Strict mode always enabled**
- Use proper typing for all functions and components
- No `any` types - use proper interfaces
- Type all props with `$props<{...}>()`

## Common Pitfalls to Avoid

2. **Don't run interactive commands** - always ask user
3. **Don't add unnecessary dependencies** - keep it simple
4. **Don't break TypeScript strict mode** - maintain type safety
5. **Don't create overengineered solutions** - prefer simplicity
7. **Don't say you're done without running linting and type checking**

## When Making Changes

1. **Read this file first** to understand project structure
2. **Maintain existing patterns** and conventions
3. **Test thoroughly**
5. **Use the todo system** for complex multi-step tasks

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
