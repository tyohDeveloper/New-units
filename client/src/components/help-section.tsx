import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface HelpSectionProps {
  t: (key: string) => string;
}

export default function HelpSection({ t }: HelpSectionProps) {
  return (
    <Card className="w-full p-6 bg-card border-border/50">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-mono uppercase text-muted-foreground">{t('Help')}</Label>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Copyright © 2025 David Hoyt. MIT License - Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            GitHub: <a href="https://github.com/tyohDeveloper/New-units" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">https://github.com/tyohDeveloper/New-units</a>
          </p>
        </div>
      </div>
    </Card>
  );
}
