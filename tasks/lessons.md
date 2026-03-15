# HIS Project Lessons Learned

## Vite Configuration

**Lesson**: Hardcoded `base: '/HIS/'` in `vite.config.ts` breaks lazy-loaded routes in development.

**Why it happened**: The GitHub Pages base path was configured for production but applied to all environments, causing admin route imports to fail with 404s locally.

**Solution**: Use conditional base path:
```typescript
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === 'production' ? '/HIS/' : '/',
}))
```

**Rule**: Always use environment-aware base paths when deploying to subdirectories. Never hardcode production paths for all environments.

---

## SEO Implementation

**Lesson**: react-helmet-async requires HelmetProvider wrapper in app root.

**Pattern**:
1. Wrap app in `<HelmetProvider>` in `main.tsx`
2. Import `{ Helmet }` from `'react-helmet-async'` in each page
3. Add `<Helmet>` component with page-specific meta tags
4. Use fragment wrapper `<>...</>` when adding to existing components

**Rule**: SEO meta tags should be page-specific, not global. Each public page needs unique title and description.

---

## 404 Handling

**Lesson**: React Router catch-all routes must be last in the routes array.

**Pattern**:
```typescript
{
  element: <PublicLayout />,
  children: [
    // ... all other routes ...
    { path: '*', element: <NotFoundPage /> }, // MUST be last
  ],
}
```

**Rule**: The `path: '*'` catch-all route matches everything, so it must come after all specific routes to work correctly.

---

## Fragment Wrappers

**Lesson**: Adding `<Helmet>` to pages requires fragment wrapper when there's already a root element.

**Why**: JSX components must return a single root element. Adding `<Helmet>` alongside existing `<div>` breaks this rule.

**Solution**: Wrap in fragments:
```tsx
return (
  <>
    <Helmet>...</Helmet>
    <div>...</div>
  </>
)
```

**Rule**: When adding new top-level elements to existing components, wrap in `<>...</>` fragments.
