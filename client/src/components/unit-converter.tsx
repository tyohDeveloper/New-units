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
  const [precision, setPrecision] = useState<number>(8);
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

  const formatDMS = (decimal: number): string => {
    const d = Math.floor(Math.abs(decimal));
    const mFloat = (Math.abs(decimal) - d) * 60;
    const m = Math.floor(mFloat);
    const s = (mFloat - m) * 60;
    const sign = decimal < 0 ? "-" : "";
    
    const sNum = Number(s.toFixed(precision));
    const sStr = sNum.toString();
    const [sInt, sDec] = sStr.split('.');
    const sDisplay = `${sInt.padStart(2, '0')}${sDec ? '.' + sDec : ''}`;

    return `${sign}${d}:${m.toString().padStart(2, '0')}:${sDisplay}`;
  };

  const parseDMS = (dms: string): number => {
    if (!dms.includes(':')) return parseFloat(dms);
    const parts = dms.split(':').map(p => parseFloat(p));
    let val = 0;
    if (parts.length > 0) val += parts[0];
    if (parts.length > 1) val += (parts[0] >= 0 ? parts[1] : -parts[1]) / 60;
    if (parts.length > 2) val += (parts[0] >= 0 ? parts[2] : -parts[2]) / 3600;
    return val;
  };

  const formatFtIn = (decimalFeet: number): string => {
    const sign = decimalFeet < 0 ? "-" : "";
    const absVal = Math.abs(decimalFeet);
    const ft = Math.floor(absVal);
    const inches = (absVal - ft) * 12;

    const inNum = Number(inches.toFixed(precision));
    const inStr = inNum.toString();
    const [inInt, inDec] = inStr.split('.');
    const inDisplay = `${inInt.padStart(2, '0')}${inDec ? '.' + inDec : ''}`;

    return `${sign}${ft}:${inDisplay}`;
  };

  const parseFtIn = (ftIn: string): number => {
    if (!ftIn.includes(':')) return parseFloat(ftIn);
    const parts = ftIn.split(':').map(p => parseFloat(p));
    let val = 0;
    if (parts.length > 0) val += parts[0];
    if (parts.length > 1) val += (parts[0] >= 0 ? parts[1] : -parts[1]) / 12;
    return val;
  };

  // Calculate result
  useEffect(() => {
    if (!inputValue || !fromUnit || !toUnit) {
      setResult(null);
      return;
    }

    let val: number;
    if (fromUnit === 'deg_dms') {
      val = parseDMS(inputValue);
      if (isNaN(val)) { setResult(null); return; }
    } else if (fromUnit === 'ft_in') {
      val = parseFtIn(inputValue);
      if (isNaN(val)) { setResult(null); return; }
    } else {
      if (isNaN(parseFloat(inputValue))) { setResult(null); return; }
      val = parseFloat(inputValue);
    }
    
    // Determine prefix factors (1 if not supported or none selected)
    // For special units (DMS/FtIn), we ignore prefixes
    const isSpecialFrom = fromUnit === 'deg_dms' || fromUnit === 'ft_in';
    const isSpecialTo = toUnit === 'deg_dms' || toUnit === 'ft_in';

    const fromFactor = (fromUnitData?.allowPrefixes && fromPrefixData && !isSpecialFrom) ? fromPrefixData.factor : 1;
    const toFactor = (toUnitData?.allowPrefixes && toPrefixData && !isSpecialTo) ? toPrefixData.factor : 1;

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
      let formattedResult = result.toString();
      if (toUnit === 'deg_dms') formattedResult = formatDMS(result);
      if (toUnit === 'ft_in') formattedResult = formatFtIn(result);

      navigator.clipboard.writeText(formattedResult);
      const unitSymbol = toUnitData?.symbol || '';
      const prefixSymbol = (toUnitData?.allowPrefixes && toPrefixData?.id !== 'none') ? toPrefixData.symbol : '';
      toast({
        title: "Copied to clipboard",
        description: `${formattedResult} ${prefixSymbol}${unitSymbol}`,
      });
    }
  };

  const formatFactor = (f: number) => {
    if (f === 1) return "Base Unit";
    if (f >= 10000 || f <= 0.0001) return `×${f.toExponential(2)}`;
    return `×${Number(f.toPrecision(4))}`;
  };

  // Helper to determine input placeholder
  const getPlaceholder = () => {
    if (fromUnit === 'deg_dms') return "dd:mm:ss";
    if (fromUnit === 'ft_in') return "ft:in";
    return "0";
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:px-8 md:pb-8 md:pt-1 grid md:grid-cols-[260px_1fr] gap-8">
      
      {/* Sidebar */}
      <nav className="space-y-2 h-fit sticky top-0 overflow-y-auto max-h-[calc(100vh-2rem)] pr-2 -mt-1">
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.name} className="space-y-1">
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 px-2 font-bold">{group.name}</h2>
            <div className="space-y-0">
              {group.categories.map((catId) => {
                const cat = CONVERSION_DATA.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as UnitCategory)}
                    className={`w-full text-left px-3 py-[1px] rounded-sm text-xs font-medium transition-all duration-200 border-l-2 flex items-center justify-between group ${
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
      <div className="space-y-4 -mt-1">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{categoryData.name}</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">
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
              <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2">
                <Input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-2xl font-mono h-16 px-4 bg-background/50 border-border focus:border-accent focus:ring-accent/20 transition-all text-left w-full min-w-0"
                  placeholder={getPlaceholder()}
                />
                
                {/* Prefix Dropdown */}
                <Select 
                  value={fromPrefix} 
                  onValueChange={setFromPrefix}
                  disabled={!fromUnitData?.allowPrefixes}
                >
                  <SelectTrigger className="h-16 w-[130px] bg-background/30 border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                    <SelectValue placeholder="Prefix" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] w-[200px]">
                    {PREFIXES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-mono text-xs min-h-[2rem]">
                        <span className="font-bold mr-2 w-6 inline-block text-right">{p.symbol}</span>
                        <span className="opacity-70">{p.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={fromUnit} onValueChange={(val) => { setFromUnit(val); setFromPrefix('none'); }}>
                  <SelectTrigger className="h-16 w-[220px] bg-background/30 border-border font-medium shrink-0">
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
              
              <div className="grid sm:grid-cols-[1fr_220px] gap-2">
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
              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase text-muted-foreground">To</Label>
                <Select 
                  value={precision.toString()} 
                  onValueChange={(val) => setPrecision(parseInt(val))}
                >
                  <SelectTrigger className="h-6 w-[100px] text-xs bg-transparent border-border/50">
                    <SelectValue placeholder="Digits" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4,5,6,7,8].map(n => (
                      <SelectItem key={n} value={n.toString()} className="text-xs">
                        {n} Decimals
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2">
                <div className="h-16 px-4 bg-muted/30 border border-border/50 rounded-md flex items-center overflow-x-auto text-left justify-start w-full min-w-0">
                  <span className="text-2xl font-mono text-primary break-all whitespace-nowrap">
                    {result !== null 
                      ? (toUnit === 'deg_dms' 
                          ? formatDMS(result) 
                          : toUnit === 'ft_in'
                            ? formatFtIn(result)
                            : Number(result.toFixed(precision)).toString()) 
                      : '...'}
                  </span>
                </div>

                {/* Prefix Dropdown */}
                <Select 
                  value={toPrefix} 
                  onValueChange={setToPrefix}
                  disabled={!toUnitData?.allowPrefixes}
                >
                  <SelectTrigger className="h-16 w-[130px] bg-background/30 border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                    <SelectValue placeholder="Prefix" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] w-[200px]">
                    {PREFIXES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-mono text-xs min-h-[2rem]">
                        <span className="font-bold mr-2 w-6 inline-block text-right">{p.symbol}</span>
                        <span className="opacity-70">{p.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={toUnit} onValueChange={(val) => { setToUnit(val); setToPrefix('none'); }}>
                  <SelectTrigger className="h-16 w-[220px] bg-background/30 border-border font-medium shrink-0">
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

              <div className="grid sm:grid-cols-[1fr_220px] gap-2">
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