"use client";

import { Component, type ReactNode } from "react";

export class PreviewErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Preview rendering failed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-red-600">
          <p className="font-medium">The preview couldn&apos;t be rendered.</p>
          <p className="text-red-500">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
