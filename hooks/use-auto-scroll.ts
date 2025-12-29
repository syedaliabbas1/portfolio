"use client"

import * as React from 'react';

export function useAutoScroll(dependencies: any[]) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  const scrollToBottom = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  React.useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [dependencies, shouldAutoScroll, scrollToBottom]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  const handleTouchStart = () => {
    // User started interacting, we might want to disable auto-scroll if they move away from bottom
  };

  return {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  };
}
