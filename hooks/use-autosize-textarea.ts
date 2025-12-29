"use client"

import * as React from 'react';

interface UseAutosizeTextAreaProps {
  ref: React.RefObject<HTMLTextAreaElement>;
  maxHeight?: number;
  dependencies: any[];
}

export function useAutosizeTextArea({ ref, maxHeight, dependencies }: UseAutosizeTextAreaProps) {
  React.useEffect(() => {
    if (ref.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the content
      ref.current.style.height = "0px";
      const scrollHeight = ref.current.scrollHeight;

      // We then set the height directly, potentially capping it the max height
      if (maxHeight && scrollHeight > maxHeight) {
        ref.current.style.height = maxHeight + "px";
      } else {
        ref.current.style.height = scrollHeight + "px";
      }
    }
  }, [ref, dependencies, maxHeight]);
}
