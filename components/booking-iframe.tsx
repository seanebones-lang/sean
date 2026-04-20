"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type BookingIframeProps = {
  src: string;
  title: string;
};

export function BookingIframe({ src, title }: BookingIframeProps) {
  useEffect(() => {
    track("booking_iframe_opened");
  }, []);

  return (
    <iframe
      src={src}
      title={title}
      className="h-[min(100dvh,56rem)] min-h-[32rem] w-full bg-surface sm:min-h-[40rem] lg:h-[900px] lg:min-h-0"
      loading="lazy"
    />
  );
}
