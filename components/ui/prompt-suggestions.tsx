"use client"

import * as React from 'react';
import { Button } from '@/components/ui/button';

interface PromptSuggestionsProps {
  label?: string;
  suggestions: string[];
  append: (message: { role: 'user'; content: string }) => void;
}

export function PromptSuggestions({ label, suggestions, append }: PromptSuggestionsProps) {
  return (
    <div className="space-y-3">
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => append({ role: 'user', content: suggestion })}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
