import React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * One button, every appearance the site needs.
 *
 * A pill, in sentence case. Hover darkens the fill and nudges any trailing
 * arrow (`group-hover:translate-x-0.5` on the icon), and the press settles it
 * back down — enough to feel alive under a thumb without turning every call
 * to action into a bouncing toy.
 *
 * `ember` is the headline action: amber with ink type, the brightest thing
 * on any screen it is on, so use it once per view.
 */
const button = cva(
  [
    "group relative inline-flex select-none items-center justify-center gap-2.5 rounded-full",
    "font-sans font-semibold tracking-[-0.01em] whitespace-nowrap",
    "border transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out-quart",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
    "[&>svg]:transition-transform [&>svg]:duration-300 hover:[&>svg:last-child]:translate-x-0.5",
  ],
  {
    variants: {
      variant: {
        primary:
          "border-brand-600 bg-brand-600 text-white shadow-[0_8px_24px_-12px_var(--color-brand-600)] hover:border-brand-700 hover:bg-brand-700",
        ember:
          "border-ember-500 bg-ember-500 text-ink-950 shadow-[0_10px_30px_-12px_var(--color-ember-500)] hover:border-ember-400 hover:bg-ember-400",
        dark: "border-ink-950 bg-ink-950 text-white hover:border-ink-800 hover:bg-ink-800",
        outline:
          "border-ink-950/15 bg-white text-ink-950 hover:border-ink-950/30 hover:bg-ink-50",
        /* Reads on photography and on flat colour blocks */
        inverse:
          "border-white bg-white text-ink-950 hover:bg-ink-100",
        inverseOutline:
          "border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/20",
        ghost:
          "border-transparent bg-transparent text-content-muted hover:text-brand-700",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-5 text-[0.875rem]",
        lg: "h-13 px-7 text-[0.9375rem]",
        xl: "h-15 px-8 text-base",
        icon: "size-11 px-0",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  }
);

const Button = React.forwardRef(function Button(
  { className, variant, size, full, href, external, children, ...props },
  ref
) {
  const classes = cn(button({ variant, size, full }), className);

  if (href) {
    // Absolute/mailto/tel links leave the app, so they skip the router.
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link ref={ref} href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;
export { button as buttonVariants };
