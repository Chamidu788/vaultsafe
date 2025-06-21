'use client';

import { useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Unlock, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import { decryptFile, type DecryptState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const initialState: DecryptState = {
  status: 'idle',
  attemptsLeft: 5,
};

export function DecryptForm() {
  const [state, formAction] = useActionState(decryptFile, initialState);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>3. Decrypt & View</CardTitle>
        <CardDescription>Upload your .safe file and enter your master password to reveal its contents.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="file">Encrypted .safe File</Label>
            <Input id="file" name="file" type="file" required accept=".safe" />
          </div>
          <div>
            <Label htmlFor="masterPasswordDecrypt">Master Password</Label>
            <Input id="masterPasswordDecrypt" name="masterPassword" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={state.status === 'error' && state.attemptsLeft !== undefined && state.attemptsLeft <= 0}>
            <Unlock className="mr-2 h-4 w-4" />
            {state.status === 'error' && state.attemptsLeft !== undefined && state.attemptsLeft <= 0 ? "Attempts Exhausted" : "Decrypt & View"}
          </Button>
        </form>
      </CardContent>

      {(state.status === 'error' || state.status === 'success') && (
        <CardFooter className="flex-col items-start gap-4">
          {state.status === 'error' && state.message && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Decryption Failed</AlertTitle>
              <AlertDescription>
                {state.message}
                {state.attemptsLeft !== undefined && state.attemptsLeft > 0 && ` You have ${state.attemptsLeft} attempts left.`}
              </AlertDescription>
            </Alert>
          )}

          {state.status === 'success' && state.data && (
            <>
              <Alert variant="default" className="w-full border-green-500 text-green-700 [&>svg]:text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Decryption Successful!</AlertTitle>
                <AlertDescription>Your decrypted passwords are shown below.</AlertDescription>
              </Alert>
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Note</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead className="text-right">Saved On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.note || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="font-mono flex items-center justify-between gap-2">
                              <span>{item.password}</span>
                              <Button variant="ghost" size="icon" className="shrink-0" onClick={() => copyToClipboard(item.password)} aria-label="Copy password">
                                  <Copy className="h-4 w-4" />
                              </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{new Date(item.timestamp).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
