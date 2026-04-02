---
name: website-landing-page
description: Expert skill for creating modern, high-conversion landing pages that are efficient, fluid, and highly animated. Triggers when the user asks to build a landing page, website, or needs help with premium web design, animations (Framer Motion, GSAP, CSS), or character-driven interactive UI. Focuses on premium aesthetics, "alive" feeling, and vibrant, attractive color palettes.
---

# WebSite-Landing-Page Skill

This skill is designed to guide the creation of state-of-the-art landing pages that feel premium, fluid, and alive. Follow these instructions to ensure every landing page produced meets the highest standards of modern web design and interactive user experience.

## 1. Design & Aesthetic Pillars

### Premium Typography & Layout

- **Font Selection**: Use modern Sans-Serif fonts like **Outfit**, **Inter**, **Roboto**, or **Sora** for a professional and sleek look.
- **Hierarchy**: Maintain clear visual hierarchy with bold, punchy headers (`H1` should be unmistakable) and readable, well-spaced body text.
- **Negative Space**: Use generous padding and margins to let elements breathe. Avoid clutter.
- **Z-pattern & F-pattern**: Design for how users scan pages to maximize conversion.

### Vibrant Color Palettes

- **Gradients**: Use mesh gradients or smooth linear/radial gradients (e.g., `background: linear-gradient(135deg, #6366f1, #a855f7);`) instead of flat colors.
- **Glassmorphism**: Use translucent backgrounds with backdrop blur to create depth (`backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.1);`).
- **Dark Mode Sensitivity**: Ensure color palettes work beautifully in both light and dark modes, prioritizing high contrast for readability and glowing accents for visual interest.

## 2. The "Alive" Feel & Fluid Animations

### Animation Frameworks

- **CSS Transitions**: For simple, performant hover effects.
- **Framer Motion (React)**: For layout transitions, drag-to-reveal, and complex entry animations.
- **GSAP (JS)**: For high-performance, scroll-triggered, and complex sequence animations.

### High-Impact Animations

- **Staggered Entry**: Animate elements into view with a slight delay between them to create a "wave" effect.
- **Parallax Effects**: Subtle layering where the background moves slower than the foreground to add depth during scroll.
- **Animated Characters**: Use **Lottie** (JSON animations) or **SVG SMIL/CSS Animations** for characters and illustrations that feel alive.
- **Smooth Scroll**: Implement smooth scrolling and anchor links to maintain flow.

## 3. Interactive Component Guidelines

### Animated Icons & Buttons

- **Micro-interactions**: Every button should have a visual response (scale up/down, glow, color shift) when hovered or clicked.
- **Icon Morphing**: Use animated SVGs where icons morph or path-trace when the user interacts with them.
- **Magnetic Buttons**: Create buttons that slightly "pull" toward the cursor when nearby.

### Character-Driven Interaction

- **Floating Assistants**: Subtle, floating animated characters that guide the user's eye to call-to-actions.
- **Reactive Characters**: Characters that "look" at the mouse position or react to scroll depth.

## 4. Performance & Efficiency

### SEO & Speed

- **Semantic HTML5**: Use `<header>`, `<main>`, `<section>`, `<footer>`, `<aside>` correctly.
- **Image Optimization**: Use WebP/AVIF formats and lazy loading for off-screen assets.
- **Minified CSS/JS**: Ensure the final bundle is lean and fast-loading.
- **Accessibility (a11y)**: Focus on reachability (ARIA labels, keyboard navigation) without compromising design.

## 5. Implementation Workflow

### Step 1: Foundation (CSS Variables & Design System)

Define your color tokens, spacing, and typography in a central CSS file or component.

### Step 2: Hero Section (The Hook)

The above-the-fold content must be visually arresting. Use a large headline, a compelling CTA, and a high-quality visual or animated element.

### Step 3: Social Proof & Features

Use interactive grids and carousels to showcase benefits and testimonials.

### Step 4: Polish & Micro-interactions

Add the "final layer" of animations—hover states, scroll reveals, and the "alive" character animations.

### Step 5: Final Optimization

Check responsiveness across all breakpoints (Mobile first!) and run SEO checks.

---

## Example Structure for a Hero Section (Tailwind/CSS)

```html
<header id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
  <!-- Mesh Gradient Background -->
  <div class="absolute inset-0 opacity-20 pointer-events-none">
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500 blur-[120px] animate-pulse delay-700"></div>
  </div>

  <div class="container mx-auto px-6 relative z-10 text-center">
    <h1 class="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6 stagger-in">
      Design That Breathes.
    </h1>
    <p class="text-xl text-slate-300 max-w-2xl mx-auto mb-10 stagger-in">
      Experience the next generation of fluid, animated landing pages designed to convert and captivate.
    </p>
    <div class="flex gap-4 justify-center stagger-in">
      <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
        Get Started
      </button>
      <button class="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white rounded-full font-semibold transition-all backdrop-blur-sm">
        Learn More
      </button>
    </div>
  </div>
</header>
```

---

*Always strive to WOW the user with a design that feels premium, modern, and uniquely interactive.*
