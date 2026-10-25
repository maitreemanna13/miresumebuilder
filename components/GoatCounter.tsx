"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    goatcounter?: { count: (vars?: { path?: string }) => void };
  }
}

// count.js records the initial page load on its own; client-side navigations
// don't reload the page, so count those manually.
export default function GoatCounter() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.goatcounter?.count({ path: pathname });
  }, [pathname]);

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter="https://miresumebuilder.goatcounter.com/count"
      strategy="afterInteractive"
    />
  );
}
