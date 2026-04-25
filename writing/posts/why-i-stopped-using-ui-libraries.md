---
title: Why I stopped using UI libraries and what I learned
date: Feb 2025
readTime: 8 min read
---

For most of my time as a developer, installing a UI library was the first thing I did in a new project. Not because I'd evaluated the options — just because it was the path of least resistance. Shadcn, Chakra, MUI, Radix — one of them would go in within the first ten minutes.

Then I built something without one. And I haven't gone back to that default since.

## What libraries are actually good at

I want to be clear before going further: UI libraries solve real problems. Accessibility is hard. Keyboard navigation, focus management, ARIA semantics, screen reader compatibility — getting all of this right from scratch is genuinely difficult and time-consuming.

Libraries like Radix solve this layer exceptionally well. The unstyled primitives pattern, where you get correct behaviour for free and write all the visual styles yourself, is a great model. I still use these.

What I stopped doing is reaching for a *fully styled* component library and treating its defaults as design decisions.

## The thing I was trading away

Every styled component library ships with opinions. Spacing scales, border-radii, shadow depths, transition durations, colour semantics. These opinions are reasonable defaults — they're not *wrong*.

But when you build with them, you're not making design decisions anymore. You're inheriting them.

The gaps between components — the exact margin between a label and an input, the colour of a secondary button on hover, the easing curve on a dropdown — stop being things you think about. They become whatever the library chose.

This matters more than it sounds. Because the specific combination of these micro-decisions is what makes a product feel *native to itself*. The product has a coherent spatial language, a consistent motion feel, a predictable density. When the components come from a library, that language is borrowed.

## What building from scratch taught me

When I first built a button component without reaching for a library, I had to make every decision.

What's the border-radius? I chose `6px`. Why? Because it felt right for the rest of the interface — not because I read it from a design token someone else defined. What's the hover state? I tried `opacity: 0.85`, then a lighter background, then a slight shadow. I ended up with a 2px border-offset on focus. Every one of those choices is now baked into my understanding of *that specific product*.

The outcome is a component that doesn't exist anywhere else. It belongs to the product.

There's also a secondary benefit: I now understand CSS deeply. Not just the properties — but the *sequencing* of layout decisions that makes an interface predictable. You can't borrow that understanding from a library.

## The maintenance concern is real

The honest counter-argument: building everything yourself takes longer and creates things you have to maintain.

This is true. A Select component with full keyboard support, positioning logic, and screen reader semantics is a week of work to do right. A date picker with locale awareness and range selection is longer. For a small team shipping fast, that cost is often too high.

The answer isn't "never use libraries." It's "know exactly what you're getting and what you're giving up."

For a personal project? Build everything. The learning is the point.

For a startup moving fast? Use headless primitives for the complex interactive components. Build the simple things — buttons, cards, typography, layout — yourself. You'll have the opinionated design language without the accessible-components tax.

## What I use now

- **Radix UI** (or Floating UI) for: modals, dropdowns, tooltips, popovers — anything that requires complex positioning or focus management
- **Nothing else** for visual components

The design tokens, the spacing scale, the colour system, the component APIs — all hand-written. It takes longer up front. But every interface I build now feels like it belongs to itself.

---

The thing I couldn't have understood before building from scratch: the friction of writing every detail from scratch is the thing that makes you care about every detail. You can't skim past a hover state you wrote yourself. You made it. You'll notice when it's wrong.

That attention compounds. And it shows.
