---
name: next-js-landing-page
description: Instruction guide for creating modern, high-conversion landing pages using the Next.js, TailwindCSS, and DaisyUI stack. Trigger this skill whenever the user mentions building a landing page, website, or needs help with premium web design using DaisyUI components, even if they don't explicitly ask for a "landing page." This skill ensures the agent asks pertinent development questions and suggests appropriate DaisyUI components based on the project's requirements.
---

# Next.js & DaisyUI Landing Page Creator

Expert skill for building high-quality, responsive, and visually stunning landing pages using the **Next.js + TailwindCSS + DaisyUI** stack.

## 1. Discovery Phase (Mandatory First Step)

When the user indicates they want to build or plan a landing page, your first action is to **ask questions** to determine the structure. Do NOT start generating code without this initial understanding.

### Pertinent Questions to ask

- **Core Purpose**: What is the primary goal? (e.g., SaaS signup, product showcase, event waitlist, personal portfolio)
- **Target Audience**: Who is the landing page for? (e.g., developers, enterprise buyers, students)
- **Required Sections**: Which sections do you need? (e.g., Hero, Features, Testimonials, Pricing, FAQ, Footer)
- **Aesthetic Preference**: Do you have a specific DaisyUI theme or brand color palette in mind? (e.g., 'dark', 'light', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset')
- **Conversion Goal**: What is the primary CTA (Call to Action)?

## 2. Planning and Component Selection

Based on the user's responses, you MUST suggest specific sections and their corresponding **DaisyUI components**. Propose a layout that matches the purpose.

### DaisyUI Component Suggestions

- **Navigation (Sticky/Glassmorphism)**:
  - `Navbar` with `backdrop-blur` and `bg-opacity`.
  - `Dropdown` for mobile menus.
  - `Theme Controller` for light/dark mode toggling.
- **Hero Section (The Hook)**:
  - `Hero` component. Use `hero-content` with `flex-col lg:flex-row-reverse` for a modern split look.
  - `Button` with `btn-primary` or `btn-gradient` (custom) for the main CTA.
- **Features & Benefits**:
  - `Grid` with `Card` components.
  - Use `Card` with `figure` for icons/images.
  - `Badge` for "New" or "Hot" feature tags.
- **Social Proof / Trust**:
  - `Avatar Group` for "Joined by 1000+ users".
  - `Card` with `bordered` or `shadow-xl` for testimonials.
  - `Stats` component for showing counts (e.g., "5k+ Downloads").
- **Pricing & Plans**:
  - `Card` with `bg-base-200` and `border-primary` for the "Recommended" plan.
  - `Table` for detailed feature comparisons.
- **Interactive Elements**:
  - `Collapse` (Accordion) for FAQs.
  - `Steps` for "How it works" or onboarding sequences.
  - `Carousel` for image galleries or testimonials.
  - `Modal` for "Sign up" or "Contact Us" forms.
- **Footer**:
  - `Footer` with multiple columns for navigation, social links, and legal info.

## 3. Implementation Workflow

Follow these steps to build the landing page effectively:

1. **Configuration**: Verify `tailwind.config.js` has `daisyui` in `plugins` and define the `themes` array.
2. **Base Layout**: Implement a `layout.tsx` using Next.js App Router.
3. **Component Architecture**: Create a `/components` directory. Build atomic components like `Header.tsx`, `Hero.tsx`, `Features.tsx`, and `Footer.tsx`.
4. **Responsive Design**: Use `md:` and `lg:` prefixes on DaisyUI and Tailwind classes to ensure mobile responsiveness.
5. **Micro-animations**: Suggest adding `framer-motion` for entry animations (e.g., `initial={{ opacity: 0, y: 20 }}`).

## 4. Design Guidelines for Visual Excellence

- **Semantic Colors**: Leverage DaisyUI's `primary`, `secondary`, and `accent` to create a cohesive brand identity.
- **Glassmorphism**: Combine `bg-base-100/70` with `backdrop-blur` for a premium, modern feel.
- **Gradients**: Enhance DaisyUI buttons with custom Tailwind gradients (e.g., `bg-gradient-to-r from-primary to-secondary`).
- **Typography**: Recommend modern fonts (Inter, Outfit) and use `text-5xl` to `text-7xl` for Hero headings.
- **Spacing**: Use generous `py-20` or `py-32` for section vertical spacing to avoid a cramped look.
