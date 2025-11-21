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

  // Dimensional formula tracking for calculator
  interface DimensionalFormula {
    length?: number;
    mass?: number;
    time?: number;
    current?: number;
    temperature?: number;
    amount?: number;
    intensity?: number;
  }

  interface CalcValue {
    value: number;
    dimensions: DimensionalFormula;
  }

  // Calculator state
  const [calcValues, setCalcValues] = useState<Array<CalcValue | null>>([null, null, null, null]);
  const [calcOp1, setCalcOp1] = useState<'*' | '/' | null>(null);
  const [calcOp2, setCalcOp2] = useState<'*' | '/' | null>(null);

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

  // Helper: Map category to dimensional formula
  const getCategoryDimensions = (category: UnitCategory): DimensionalFormula => {
    const dimensionMap: Record<UnitCategory, DimensionalFormula> = {
      length: { length: 1 },
      mass: { mass: 1 },
      time: { time: 1 },
      current: { current: 1 },
      temperature: { temperature: 1 },
      amount: { amount: 1 },
      intensity: { intensity: 1 },
      area: { length: 2 },
      volume: { length: 3 },
      frequency: { time: -1 },
      speed: { length: 1, time: -1 },
      acceleration: { length: 1, time: -2 },
      force: { mass: 1, length: 1, time: -2 },
      pressure: { mass: 1, length: -1, time: -2 },
      energy: { mass: 1, length: 2, time: -2 },
      power: { mass: 1, length: 2, time: -3 },
      charge: { current: 1, time: 1 },
      potential: { mass: 1, length: 2, time: -3, current: -1 },
      capacitance: { mass: -1, length: -2, time: 4, current: 2 },
      resistance: { mass: 1, length: 2, time: -3, current: -2 },
      conductance: { mass: -1, length: -2, time: 3, current: 2 },
      inductance: { mass: 1, length: 2, time: -2, current: -2 },
      magnetic_flux: { mass: 1, length: 2, time: -2, current: -1 },
      magnetic_density: { mass: 1, time: -2, current: -1 },
      radioactivity: { time: -1 },
      radiation_dose: { length: 2, time: -2 },
      equivalent_dose: { length: 2, time: -2 },
      catalytic: { amount: 1, time: -1 },
      angle: {},
      solid_angle: {},
      digital: {},
      printing: { length: 1 },
      illuminance: { intensity: 1, length: -2 },
      torque: { mass: 1, length: 2, time: -2 },
      density: { mass: 1, length: -3 },
      flow: { length: 3, time: -1 },
      viscosity: { mass: 1, length: -1, time: -1 },
      surface_tension: { mass: 1, time: -2 },
      refractive_power: { length: -1 },
      sound_pressure: { mass: 1, length: -1, time: -2 }
    };
    return dimensionMap[category] || {};
  };

  // Helper: Multiply dimensional formulas
  const multiplyDimensions = (d1: DimensionalFormula, d2: DimensionalFormula): DimensionalFormula => {
    const result: DimensionalFormula = { ...d1 };
    for (const [dim, exp] of Object.entries(d2)) {
      const key = dim as keyof DimensionalFormula;
      result[key] = (result[key] || 0) + exp;
      if (result[key] === 0) delete result[key];
    }
    return result;
  };

  // Helper: Divide dimensional formulas
  const divideDimensions = (d1: DimensionalFormula, d2: DimensionalFormula): DimensionalFormula => {
    const result: DimensionalFormula = { ...d1 };
    for (const [dim, exp] of Object.entries(d2)) {
      const key = dim as keyof DimensionalFormula;
      result[key] = (result[key] || 0) - exp;
      if (result[key] === 0) delete result[key];
    }
    return result;
  };

  // Helper: Format dimensional formula as unit string
  const formatDimensions = (dims: DimensionalFormula): string => {
    const dimSymbols: Record<keyof DimensionalFormula, string> = {
      length: 'm',
      mass: 'kg',
      time: 's',
      current: 'A',
      temperature: 'K',
      amount: 'mol',
      intensity: 'cd'
    };

    const superscripts: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻'
    };

    const toSuperscript = (num: number): string => {
      return num.toString().split('').map(c => superscripts[c] || c).join('');
    };

    const parts: string[] = [];

    for (const [dim, exp] of Object.entries(dims)) {
      const symbol = dimSymbols[dim as keyof DimensionalFormula];
      if (!symbol) continue;

      if (exp === 1) {
        parts.push(symbol);
      } else {
        parts.push(symbol + toSuperscript(exp));
      }
    }

    return parts.join('⋅');
  };

  // Helper: Get derived unit symbol from dimensions
  const getDerivedUnit = (dims: DimensionalFormula): string => {
    const dimsStr = JSON.stringify(dims);
    
    const derivedUnits: Record<string, string> = {
      // Base units
      [JSON.stringify({ length: 1 })]: 'm',
      [JSON.stringify({ mass: 1 })]: 'kg',
      [JSON.stringify({ time: 1 })]: 's',
      [JSON.stringify({ current: 1 })]: 'A',
      [JSON.stringify({ temperature: 1 })]: 'K',
      [JSON.stringify({ amount: 1 })]: 'mol',
      [JSON.stringify({ intensity: 1 })]: 'cd',
      // Derived units
      [JSON.stringify({ length: 2 })]: 'm²',
      [JSON.stringify({ length: 3 })]: 'm³',
      [JSON.stringify({ time: -1 })]: 'Hz',
      [JSON.stringify({ length: 1, time: -1 })]: 'm/s',
      [JSON.stringify({ length: 1, time: -2 })]: 'm/s²',
      [JSON.stringify({ mass: 1, length: 1, time: -2 })]: 'N',
      [JSON.stringify({ mass: 1, length: -1, time: -2 })]: 'Pa',
      [JSON.stringify({ mass: 1, length: 2, time: -2 })]: 'J',
      [JSON.stringify({ mass: 1, length: 2, time: -3 })]: 'W',
      [JSON.stringify({ current: 1, time: 1 })]: 'C',
      [JSON.stringify({ mass: 1, length: 2, time: -3, current: -1 })]: 'V',
      [JSON.stringify({ mass: -1, length: -2, time: 4, current: 2 })]: 'F',
      [JSON.stringify({ mass: 1, length: 2, time: -3, current: -2 })]: 'Ω',
      [JSON.stringify({ mass: -1, length: -2, time: 3, current: 2 })]: 'S',
      [JSON.stringify({ mass: 1, length: 2, time: -2, current: -2 })]: 'H',
      [JSON.stringify({ mass: 1, length: 2, time: -2, current: -1 })]: 'Wb',
      [JSON.stringify({ mass: 1, time: -2, current: -1 })]: 'T',
      [JSON.stringify({ intensity: 1, length: -2 })]: 'lx',
      [JSON.stringify({ mass: 1, length: -3 })]: 'kg/m³',
      [JSON.stringify({ length: 3, time: -1 })]: 'm³/s',
      [JSON.stringify({ mass: 1, length: -1, time: -1 })]: 'Pa⋅s',
      [JSON.stringify({ mass: 1, time: -2 })]: 'N/m',
      [JSON.stringify({ length: -1 })]: 'm⁻¹',
      [JSON.stringify({ amount: 1, time: -1 })]: 'kat'
    };

    return derivedUnits[dimsStr] || '';
  };

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
    if (result !== null && toUnitData) {
      let formattedResult = result.toString();
      if (toUnit === 'deg_dms') formattedResult = formatDMS(result);
      if (toUnit === 'ft_in') formattedResult = formatFtIn(result);

      navigator.clipboard.writeText(formattedResult);
      const unitSymbol = toUnitData?.symbol || '';
      const prefixSymbol = (toUnitData?.allowPrefixes && toPrefixData?.id !== 'none') ? toPrefixData.symbol : '';
      
      // Add to calculator (first three fields only) - convert to SI base units
      const firstEmptyIndex = calcValues.findIndex((v, i) => i < 3 && v === null);
      if (firstEmptyIndex !== -1) {
        // Convert result to SI base units
        const baseUnitValue = result * toUnitData.factor * toPrefixData.factor;
        
        const newCalcValues = [...calcValues];
        newCalcValues[firstEmptyIndex] = {
          value: baseUnitValue,
          dimensions: getCategoryDimensions(activeCategory)
        };
        setCalcValues(newCalcValues);
      }
      
      toast({
        title: "Copied to clipboard",
        description: `${formattedResult} ${prefixSymbol}${unitSymbol}`,
      });
    }
  };

  // Calculate result field
  useEffect(() => {
    if (calcValues[0] && calcValues[1] && calcOp1) {
      let resultValue = calcValues[0].value;
      let resultDimensions = { ...calcValues[0].dimensions };
      
      if (calcOp1 === '*') {
        resultValue = resultValue * calcValues[1].value;
        resultDimensions = multiplyDimensions(resultDimensions, calcValues[1].dimensions);
      } else {
        resultValue = resultValue / calcValues[1].value;
        resultDimensions = divideDimensions(resultDimensions, calcValues[1].dimensions);
      }
      
      if (calcValues[2] && calcOp2) {
        if (calcOp2 === '*') {
          resultValue = resultValue * calcValues[2].value;
          resultDimensions = multiplyDimensions(resultDimensions, calcValues[2].dimensions);
        } else {
          resultValue = resultValue / calcValues[2].value;
          resultDimensions = divideDimensions(resultDimensions, calcValues[2].dimensions);
        }
      }
      
      setCalcValues(prev => {
        const newValues = [...prev];
        newValues[3] = {
          value: resultValue,
          dimensions: resultDimensions
        };
        return newValues;
      });
    } else if (calcValues[3] !== null) {
      setCalcValues(prev => {
        const newValues = [...prev];
        newValues[3] = null;
        return newValues;
      });
    }
  }, [calcValues[0], calcValues[1], calcValues[2], calcOp1, calcOp2]);

  const clearCalculator = () => {
    setCalcValues([null, null, null, null]);
    setCalcOp1(null);
    setCalcOp2(null);
  };

  const clearField1 = () => {
    setCalcValues(prev => {
      const newValues = [...prev];
      newValues[0] = null;
      return newValues;
    });
    setCalcOp1(null);
  };

  const clearField2 = () => {
    setCalcValues(prev => {
      const newValues = [...prev];
      newValues[1] = null;
      return newValues;
    });
    setCalcOp2(null);
  };

  const copyCalcResult = () => {
    if (calcValues[3]) {
      navigator.clipboard.writeText(calcValues[3].value.toString());
      toast({
        title: "Copied to clipboard",
        description: calcValues[3].value.toString(),
      });
    }
  };

  const formatFactor = (f: number) => {
    if (f === 1) return "1";
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

              <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-start">
                <div className="space-y-2">
                  {toUnitData?.description && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" /> {toUnitData.description}
                    </p>
                  )}
                  {result !== null && fromUnitData && toUnitData && (
                    <div className="p-2 rounded bg-muted/20 border border-border/50">
                      <div className="text-xs font-mono text-muted-foreground flex gap-2 items-center">
                        <span className="text-foreground font-bold">
                          1 {fromPrefixData.id !== 'none' ? fromPrefixData.name : ''}{fromUnitData.name}
                        </span>
                        <span>=</span>
                        <span className="text-foreground font-bold">
                          {Number(convert(1, fromUnit, toUnit, activeCategory, fromPrefixData.factor, toPrefixData.factor).toPrecision(6))} {toPrefixData.id !== 'none' ? toPrefixData.name : ''}{toUnitData.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
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

        {/* Mini Calculator */}
        <Card className="p-6 bg-card border-border/50">
          <Label className="text-xs font-mono uppercase text-muted-foreground mb-4 block">Calculator</Label>
          <div className="space-y-2">
            {/* Field 1 */}
            <div className="grid sm:grid-cols-[1fr_220px] gap-2">
              <div className="h-10 px-3 bg-muted/30 border border-border/50 rounded-md flex items-center justify-between min-w-0">
                <span className="text-sm font-mono text-foreground truncate">
                  {calcValues[0] ? Number(calcValues[0].value.toFixed(precision)).toString() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[0] ? formatDimensions(calcValues[0].dimensions) : ''}
                </span>
              </div>
              <div className="flex gap-1 justify-start">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCalcOp1('*')}
                  className={`text-sm ${calcOp1 === '*' ? 'text-accent font-bold' : ''}`}
                >
                  ×
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCalcOp1('/')}
                  className={`text-sm ${calcOp1 === '/' ? 'text-accent font-bold' : ''}`}
                >
                  /
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearField1}
                  disabled={!calcValues[0]}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Field 2 */}
            <div className="grid sm:grid-cols-[1fr_220px] gap-2">
              <div className="h-10 px-3 bg-muted/30 border border-border/50 rounded-md flex items-center justify-between min-w-0">
                <span className="text-sm font-mono text-foreground truncate">
                  {calcValues[1] ? Number(calcValues[1].value.toFixed(precision)).toString() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[1] ? formatDimensions(calcValues[1].dimensions) : ''}
                </span>
              </div>
              <div className="flex gap-1 justify-start">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCalcOp2('*')}
                  className={`text-sm ${calcOp2 === '*' ? 'text-accent font-bold' : ''}`}
                >
                  ×
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCalcOp2('/')}
                  className={`text-sm ${calcOp2 === '/' ? 'text-accent font-bold' : ''}`}
                >
                  /
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearField2}
                  disabled={!calcValues[1]}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Field 3 */}
            <div className="grid sm:grid-cols-[1fr_220px] gap-2">
              <div className="h-10 px-3 bg-muted/30 border border-border/50 rounded-md flex items-center justify-between min-w-0">
                <span className="text-sm font-mono text-foreground truncate">
                  {calcValues[2] ? Number(calcValues[2].value.toFixed(precision)).toString() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[2] ? formatDimensions(calcValues[2].dimensions) : ''}
                </span>
              </div>
            </div>

            {/* Result Field 4 */}
            <div className="grid sm:grid-cols-[1fr_220px] gap-2">
              <div className="h-10 px-3 bg-muted/20 border border-accent/50 rounded-md flex items-center justify-between min-w-0">
                <span className="text-sm font-mono text-primary font-bold truncate">
                  {calcValues[3] ? Number(calcValues[3].value.toFixed(precision)).toString() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[3] ? formatDimensions(calcValues[3].dimensions) : ''}
                </span>
              </div>
              <div className="flex gap-1 justify-start">
                {calcValues[3] && getDerivedUnit(calcValues[3].dimensions) && (
                  <div className="h-9 px-3 bg-muted/30 border border-border/50 rounded-md flex items-center">
                    <span className="text-xs font-mono text-muted-foreground">
                      {getDerivedUnit(calcValues[3].dimensions)}
                    </span>
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyCalcResult}
                  disabled={!calcValues[3]}
                  className="text-xs hover:text-accent gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCalculator}
                  className="text-xs hover:text-destructive gap-1"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}