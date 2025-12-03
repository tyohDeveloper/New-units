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
           OmniUnit is a universal conversion tool with a unit aware calculator. It supports lots of units. Everything you want, and a bunch of stuff you've never heard of. It is SI focused, all iinformation is internally SI base unit expressions. It allows you to do a simple conversion or pasting in a full expression. Cut "127.2342 J⋅s⁻¹" from a paper and past it into the calulator and it will work or 7yd and it parse that too. The unit conversion tool is separated into SI areas to reduce confusion. Power has power related units. Watts, BTU, &c. No scrolling through bazillions of units to find the one you want. Archic and local units are also supported, but separately. You want tatami to m²? It's got you covered.

            It's localized for about a dozen languages and supports the main number formatting in the world. Korean, Spanish, Arabic, &c... You don't need to understand english to use it. It defaults to English number formats and en language. So you need to get at least that far into the app, otherwise it's readable.

          The app has four main panes, only two of which are visible at the same time. The default top is the unit coversion. The bottom pane is a rpn unit aware calculator. You can paste or type in just about anything and it will work. The coversions for the output of the calculators are limited to SI base and derived units. So shoot me if you want to convert it to lbs of E-85 gasoline, you'll need to bring that back to the conversion pane. 
            
            There are two additional panes. You can swap out the conversion pane with a build your own unit. You can paste in just about anything (like the calculator) and it will bring that a base expression. You can take it from there. There's also a very simple calculator that will handle most all unit arytmetic if you don't like RPN calculators.

            The app is a single, standalone .html file. It references no other files, has no links. You can bring it anywhere you have a browser and it will work. No network or packaging needed. I've also provide a github repository with the project. It's a bog standard Typescript/React project. I built it on Replit, but that's not required. Your free to use the .html file or source code anyway you want.

            This is the only hyperlink in the or external reference in the .html distribution. You can click on it or not. It's not part of the app.
          <p className="text-xs text-muted-foreground/70 mt-2">
            GitHub: <a href="https://github.com/tyohDeveloper/New-units" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">https://github.com/tyohDeveloper/New-units</a>
             Just a note, I used the Replit AI to build most of this. You can see it in code. I've done a bunch of testing and it has a set of unit tests. Mostly it thinks what it's doing is correct. As far as I know, it's correct. But your milage may vary.
</p>
        </div>
        <div className="border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Copyright © 2025 David Hoyt. MIT License - Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
          </p>
          </p>
        </div>
      </div>
    </Card>
  );
}
