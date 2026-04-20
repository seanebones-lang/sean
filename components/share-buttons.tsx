"use client";

import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select input
    }
  };

  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:text-electric"
        aria-label="Share on Facebook"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:text-electric"
        aria-label="Share on X"
      >
        X / Twitter
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-muted-foreground hover:text-electric"
        aria-label="Copy link"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
