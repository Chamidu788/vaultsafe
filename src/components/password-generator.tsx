'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/utils';
import { Copy, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface PasswordEntry {
  id: number;
  password: string;
  note: string;
}

interface PasswordGeneratorProps {
  passwordEntries: PasswordEntry[];
  setPasswordEntries: (entries: PasswordEntry[]) => void;
}

export function PasswordGenerator({ passwordEntries, setPasswordEntries }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(3);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();

  const createNewPassword = useCallback(() => {
      return generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleGeneratePasswords = useCallback(() => {
    const numToGen = Math.max(0, count);
    if (numToGen === 0) {
        setPasswordEntries([]);
        return;
    }
    const newEntries: PasswordEntry[] = Array.from({ length: numToGen }, (_, i) => ({
        id: Date.now() + i,
        password: createNewPassword(),
        note: ''
    }));
    setPasswordEntries(newEntries);
  }, [count, createNewPassword, setPasswordEntries]);
  
  useEffect(() => {
      handleGeneratePasswords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNoteChange = (id: number, note: string) => {
    setPasswordEntries(
      passwordEntries.map(entry => entry.id === id ? { ...entry, note } : entry)
    );
  };

  const handleRefreshOne = (id: number) => {
      setPasswordEntries(passwordEntries.map(entry => entry.id === id ? {...entry, password: createNewPassword()} : entry));
  };
  
  const handleAddOne = () => {
      const newEntry: PasswordEntry = {
          id: Date.now(),
          password: createNewPassword(),
          note: ''
      };
      setPasswordEntries([...passwordEntries, newEntry]);
  };
  
  const handleRemoveOne = (id: number) => {
      setPasswordEntries(passwordEntries.filter(entry => entry.id !== id));
  };

  useEffect(() => {
      setCount(passwordEntries.length);
  }, [passwordEntries.length]);

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard!',
      });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>1. Generate Passwords</CardTitle>
        <CardDescription>Create strong, unique passwords tailored to your needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="length">Password Length</Label>
                    <span className="font-bold text-primary">{length}</span>
                </div>
                <Slider
                    id="length"
                    min={8}
                    max={64}
                    step={1}
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                    aria-label="Password length slider"
                />
            </div>
            <div className="space-y-2">
                 <Label htmlFor="count">Number of Passwords</Label>
                 <Input 
                    id="count" 
                    type="number"
                    min="0"
                    max="50"
                    value={count} 
                    onChange={e => setCount(parseInt(e.target.value, 10) || 0)}
                    className="h-10"
                 />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))} />
            <Label htmlFor="uppercase">Uppercase</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))} />
            <Label htmlFor="lowercase">Lowercase</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))} />
            <Label htmlFor="numbers">Numbers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))} />
            <Label htmlFor="symbols">Symbols</Label>
          </div>
        </div>
        
        <Button onClick={handleGeneratePasswords} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4"/>
            Generate {count > 0 ? count : ''} Password{count === 1 ? '' : 's'}
        </Button>

        <ScrollArea className="h-64 w-full rounded-md border">
           <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[45%]">Password</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right pr-12">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {passwordEntries.length > 0 ? passwordEntries.map(entry => (
                        <TableRow key={entry.id}>
                            <TableCell className="font-mono text-sm">
                               {entry.password}
                            </TableCell>
                            <TableCell>
                                <Input 
                                    value={entry.note} 
                                    onChange={(e) => handleNoteChange(entry.id, e.target.value)} 
                                    placeholder="Add a note..."
                                    className="h-9"
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(entry.password)} aria-label="Copy password">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRefreshOne(entry.id)} aria-label="Generate new password">
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveOne(entry.id)} aria-label="Remove password">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                No passwords generated. Adjust count and click generate.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleAddOne}>
            <Plus className="mr-2 h-4 w-4"/>
            Add Another Password
        </Button>
      </CardFooter>
    </Card>
  );
}
