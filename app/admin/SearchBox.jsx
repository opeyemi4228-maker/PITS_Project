"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

/**
 * The top bar's member search, with ⌘K / Ctrl+K to reach it from anywhere.
 *
 * Still a plain GET form to the members register, so it works without script
 * and lands on a shareable URL; the shortcut is the only thing the client adds.
 */
export default function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form action="/admin/members" method="get" role="search" className="group relative min-w-0 flex-1 lg:max-w-md">
      <Search
        size={19}
        strokeWidth={2}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4.5 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-ink-900"
      />
      <input
        ref={inputRef}
        type="search"
        name="q"
        placeholder="Search members"
        aria-label="Search members by name, number or phone"
        aria-keyshortcuts="Meta+K Control+K"
        className="h-13 w-full rounded-full border border-transparent bg-white pr-16 pl-12 text-[0.9375rem] text-ink-950 transition-[border-color,box-shadow,background-color] placeholder:text-ink-400 hover:border-ink-200 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/8 focus:outline-none lg:bg-ink-50 lg:focus:bg-white"
      />
      <kbd
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-0.5 rounded-lg border border-ink-200 bg-white px-2 py-1 font-sans text-[0.75rem] font-semibold text-ink-500 shadow-e1 sm:flex"
      >
        ⌘K
      </kbd>
    </form>
  );
}
