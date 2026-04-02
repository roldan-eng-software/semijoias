---
name: google-analytics
description: Integrates Google Analytics (GA4) into a web project. Use this skill when the user mentions "Google Analytics", "analytics", "tracking", "metrics", or "GA4", or when they want to track user behavior on their website. It guides the agent to ask for the Tracking ID (e.g., G-XXXXXXXXXX) and then automatically inserts the tracking code in the correct files (Next.js Root Layout or HTML index.html).
---

# Google Analytics Skill

Professional integration guide for Google Analytics into web projects.

## Goal
To implement Google Analytics tracking consistently across different types of web projects, ensuring minimal impact on performance and following modern best practices.

## 1. Preparation: Gather the Tracking ID

If the user has not explicitly provided the Tracking ID (e.g., `G-1A2B3C4D5E`), the agent **MUST** ask for it before proceeding with implementation:

> "Para integrar o Google Analytics, eu preciso do seu **ID de acompanhamento (Tracking ID)** gerado pelo Google (ex: `G-XXXXXXXXXX`). Você poderia me fornecer este ID?"

---

## 2. Implementation by Framework

### Next.js (App Router) - Using `@next/third-parties` (Recommended)
This is the most efficient way as it optimizes script loading automatically.

1. **Check or Install Dependency**:
   ```bash
   npm install @next/third-parties
   ```

2. **Update `app/layout.tsx`**:
   Import and place the component. It should ideally be at the root, near the closing `</html>` tag.

   ```tsx
   import { GoogleAnalytics } from '@next/third-parties/google';

   export default function RootLayout({ children }) {
     return (
       <html lang="pt-BR">
         <body>{children}</body>
         <GoogleAnalytics gaId="G-XXXXXXXXXX" />
       </html>
     );
   }
   ```

### Next.js (App Router) - Manual Way (`next/script`)
Use this if the customer prefers not to add extra dependencies.

```tsx
import Script from 'next/script';

// Add within the <head> of layout.tsx or inside the body
return (
  <>
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
    />
    <Script id="google-analytics">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
      `}
    </Script>
  </>
);
```

### Vite / Plain HTML
Insert directly into the `<head>` of your `index.html`.

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 3. Best Practices & Optimization

1. **Environment Variables**: For security and flexibility, use an environment variable in `.env.local` (e.g., `NEXT_PUBLIC_GA_ID`) instead of hardcoding the ID.
2. **GDPR & LGPD**: If the project has a cookie consent management system (like the one provided by the **LGPD** skill), ensure that the GA script only fires *after* consent is granted or is configured with `consent_mode`.

---

## Verification Steps
1. Verify if the script is present in the rendered HTML source code.
2. If in a dev environment, check the browser console for `gtag` calls or use the "Google Tag Assistant" browser extension.
