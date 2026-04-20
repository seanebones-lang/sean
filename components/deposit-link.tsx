"use client";

import { track } from "@vercel/analytics";

type DepositLinkProps = {
  href: string;
  label: string;
};

export function DepositLink({ href, label }: DepositLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("deposit_clicked")}
      className="electric-ring inline-flex w-fit touch-manipulation items-center justify-center rounded-full border border-electric px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:text-electric"
    >
      {label}
    </a>
  );
}
