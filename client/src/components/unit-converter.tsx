import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONVERSION_DATA, UnitCategory, convert, PREFIXES } from '@/lib/conversion-data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Copy, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromPrefix, setFromPrefix] = useState<string>('none');
  const [toPrefix, setToPrefix] = useState<string>('none');
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const CATEGORY_GROUPS = [
    {
      name: "Base Quantities",
      categories: ['length', 'mass', 'time', 'current', 'temperature', 'amount', 'intensity']
    },
    {
      name: "Mechanics",
      categories: ['area', 'volume', 'speed', 'acceleration', 'force', 'pressure', 'energy', 'power', 'torque', 'flow', 'density', 'viscosity', 'surface_tension']
    },
    {
      name: "Electricity & Magnetism",
      categories: ['charge', 'potential', 'capacitance', 'resistance', 'conductance', 'inductance', 'magnetic_flux', 'magnetic_density']
    },
    {
      name: "Radiation & Physics",
      categories: ['radioactivity', 'radiation_dose', 'equivalent_dose', 'catalytic', 'angle', 'solid_angle', 'frequency', 'sound_pressure', 'refractive_power']
    },
    {
      name: "Specialized",
      categories: ['digital', 'printing', 'illuminance']
    }
  ];

  const categoryData = CONVERSION_DATA.find(c => c.id === activeCategory)!;

  // Reset units when category changes
  useEffect(() => {
    if (categoryData) {
      // Default to first two units if available
      setFromUnit(categoryData.units[0]?.id || '');
      // Try to set a sensible second default (like m to ft) if possible, otherwise just 2nd unit
      const defaultTo = categoryData.units.find(u => u.id !== categoryData.units[0]?.id)?.id || categoryData.units[0]?.id;
      setToUnit(defaultTo || '');
      setFromPrefix('none');
      setToPrefix('none');
    }
  }, [activeCategory]);

  const fromUnitData = categoryData.units.find(u => u.id === fromUnit);
  const toUnitData = categoryData.units.find(u => u.id === toUnit);
  const fromPrefixData = PREFIXES.find(p => p.id === fromPrefix) || PREFIXES.find(p => p.id === 'none') || PREFIXES[0];
  const toPrefixData = PREFIXES.find(p => p.id === toPrefix) || PREFIXES.find(p => p.id === 'none') || PREFIXES[0];

  // Calculate result
  useEffect(() => {
    if (!inputValue || isNaN(parseFloat(inputValue)) || !fromUnit || !toUnit) {
      setResult(null);
      return;
    }
    const val = parseFloat(inputValue);
    
    // Determine prefix factors (1 if not supported or none selected)
    const fromFactor = (fromUnitData?.allowPrefixes && fromPrefixData) ? fromPrefixData.factor : 1;
    const toFactor = (toUnitData?.allowPrefixes && toPrefixData) ? toPrefixData.factor : 1;

    const res = convert(val, fromUnit, toUnit, activeCategory, fromFactor, toFactor);
    setResult(res);
  }, [inputValue, fromUnit, toUnit, activeCategory, fromPrefix, toPrefix, fromUnitData, toUnitData]);

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempPrefix = fromPrefix;
    setFromUnit(toUnit);
    setFromPrefix(toPrefix);
    setToUnit(tempUnit);
    setToPrefix(tempPrefix);
  };

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      const unitSymbol = toUnitData?.symbol || '';
      const prefixSymbol = (toUnitData?.allowPrefixes && toPrefixData?.id !== 'none') ? toPrefixData.symbol : '';
      toast({
        title: "Copied to clipboard",
        description: `${result} ${prefixSymbol}${unitSymbol}`,
      });
    }
  };

  const formatFactor = (f: number) => {
    if (f === 1) return "Base Unit";
    if (f >= 10000 || f <= 0.0001) return `×${f.toExponential(2)}`;
    return `×${Number(f.toPrecision(4))}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 grid md:grid-cols-[280px_1fr] gap-8">
      
      {/* Sidebar */}
      <nav className="space-y-4 h-fit sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.name} className="space-y-1">
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 px-2 font-bold">{group.name}</h2>
            <div className="space-y-[1px]">
              {group.categories.map((catId) => {
                const cat = CONVERSION_DATA.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as UnitCategory)}
                    className={`w-full text-left px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 border-l-2 flex items-center justify-between group ${
                      activeCategory === cat.id 
                        ? 'bg-accent/10 border-accent text-accent-foreground' 
                        : 'hover:bg-muted/50 border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                    {activeCategory === cat.id && (
                      <motion.div layoutId="active-indicator" className="w-1 h-1 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Main Converter */}
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{categoryData.name}</h1>
          <p className="text-muted-foreground mt-2 text-sm font-mono">
            Base unit: <span className="text-primary">{categoryData.baseUnit}</span>
          </p>
        </div>

        <Card className="p-6 md:p-8 bg-card border-border/50 shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="grid gap-8 relative z-10">
            
            {/* Input Section */}
            <div className="grid gap-4">
              <Label className="text-xs font-mono uppercase text-muted-foreground">From</Label>
              <div className="grid sm:grid-cols-[1fr_auto_140px] gap-2">
                <Input 
                  type="number" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-2xl md:text-3xl font-mono h-16 px-4 bg-background/50 border-border focus:border-accent focus:ring-accent/20 transition-all"
                  placeholder="0"
                />
                
                {/* Prefix Dropdown */}
                <Select 
                  value={fromPrefix} 
                  onValueChange={setFromPrefix}
                  disabled={!fromUnitData?.allowPrefixes}
                >
                  <SelectTrigger className="h-16 w-[100px] bg-background/30 border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Prefix" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PREFIXES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-mono text-xs min-h-[2rem]">
                        <span className="font-bold mr-2 w-4 inline-block text-right">{p.symbol}</span>
                        <span className="opacity-70">{p.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={fromUnit} onValueChange={(val) => { setFromUnit(val); setFromPrefix('none'); }}>
                  <SelectTrigger className="h-16 bg-background/30 border-border font-medium">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {categoryData.units.map((u) => (
                      <SelectItem key={u.id} value={u.id} className="font-mono text-sm">
                        <span className="font-bold mr-2">{u.symbol}</span>
                        <span className="opacity-70">{u.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">Base Factor</div>
                  <div className="font-mono text-sm text-foreground/80 truncate" title={fromUnitData ? (fromUnitData.factor * fromPrefixData.factor).toString() : ''}>
                    {fromUnitData ? formatFactor(fromUnitData.factor * fromPrefixData.factor) : '-'}
                  </div>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">SI Base Units</div>
                  <div className="font-mono text-sm text-foreground/80 truncate">
                    {categoryData.baseSISymbol || '-'}
                  </div>
                </div>
              </div>

              {fromUnitData?.description && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" /> {fromUnitData.description}
                </p>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={swapUnits}
                className="rounded-full w-10 h-10 border-border bg-background hover:border-accent hover:text-accent transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* Output Section */}
            <div className="grid gap-4">
              <Label className="text-xs font-mono uppercase text-muted-foreground">To</Label>
              <div className="grid sm:grid-cols-[1fr_auto_140px] gap-2">
                <div className="h-16 px-4 bg-muted/30 border border-border/50 rounded-md flex items-center overflow-x-auto">
                  <span className="text-2xl md:text-3xl font-mono text-primary break-all">
                    {result !== null ? Number(result.toPrecision(10)).toString() : '...'}
                  </span>
                </div>

                {/* Prefix Dropdown */}
                <Select 
                  value={toPrefix} 
                  onValueChange={setToPrefix}
                  disabled={!toUnitData?.allowPrefixes}
                >
                  <SelectTrigger className="h-16 w-[100px] bg-background/30 border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Prefix" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PREFIXES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-mono text-xs min-h-[2rem]">
                        <span className="font-bold mr-2 w-4 inline-block text-right">{p.symbol}</span>
                        <span className="opacity-70">{p.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={toUnit} onValueChange={(val) => { setToUnit(val); setToPrefix('none'); }}>
                  <SelectTrigger className="h-16 bg-background/30 border-border font-medium">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {categoryData.units.map((u) => (
                      <SelectItem key={u.id} value={u.id} className="font-mono text-sm">
                        <span className="font-bold mr-2">{u.symbol}</span>
                        <span className="opacity-70">{u.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">Base Factor</div>
                  <div className="font-mono text-sm text-foreground/80 truncate" title={toUnitData ? (toUnitData.factor * toPrefixData.factor).toString() : ''}>
                    {toUnitData ? formatFactor(toUnitData.factor * toPrefixData.factor) : '-'}
                  </div>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">SI Base Units</div>
                  <div className="font-mono text-sm text-foreground/80 truncate">
                    {categoryData.baseSISymbol || '-'}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start">
                {toUnitData?.description ? (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" /> {toUnitData.description}
                  </p>
                ) : <div />}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyResult}
                  className="text-xs hover:text-accent gap-2"
                >
                  <Copy className="w-3 h-3" /> Copy Result
                </Button>
              </div>
            </div>

          </div>
        </Card>

        {/* Formula Display */}
        {result !== null && fromUnitData && toUnitData && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border p-4 bg-card/50 text-sm font-mono text-muted-foreground"
          >
            <div className="flex gap-2 items-center">
              <span className="text-foreground font-bold">
                1 {fromPrefixData.id !== 'none' ? fromPrefixData.name : ''}{fromUnitData.name}
              </span>
              <span>=</span>
              <span className="text-foreground font-bold">
                {Number(convert(1, fromUnit, toUnit, activeCategory, fromPrefixData.factor, toPrefixData.factor).toPrecision(6))} {toPrefixData.id !== 'none' ? toPrefixData.name : ''}{toUnitData.name}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}