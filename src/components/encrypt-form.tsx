'use client';

import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { encryptAndDownload } from '@/lib/actions';
import type { PasswordEntry } from '@/components/password-generator';

interface EncryptFormProps {
  passwordEntries: Omit<PasswordEntry, 'id'>[];
}

export function EncryptForm({ passwordEntries }: EncryptFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleEncrypt = async (formData: FormData) => {
    const entriesToSave = passwordEntries.filter(p => p.password);

    if (entriesToSave.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please generate at least one password first.',
      });
      return;
    }

    const dataForAction = entriesToSave.map(({ password, note }) => ({ password, note }));
    formData.set('passwords', JSON.stringify(dataForAction));

    const result = await encryptAndDownload(formData);

    if (result.status === 'success' && result.fileData) {
      const byteCharacters = atob(result.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vaultsafe_passwords.safe';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success!',
        description: 'Your encrypted .safe file has been downloaded.',
      });
      formRef.current?.reset();
    } else if (result.status === 'error') {
       toast({
        variant: 'destructive',
        title: 'Encryption Failed',
        description: result.message,
      });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>2. Encrypt & Export</CardTitle>
        <CardDescription>Secure your password(s). Add to an existing .safe file or create a new one.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleEncrypt} className="space-y-4">
          <div>
            <Label htmlFor="masterPasswordEncrypt">Master Password</Label>
            <Input id="masterPasswordEncrypt" name="masterPassword" type="password" required />
          </div>
          <div>
            <Label htmlFor="existingFile">Existing .safe File (Optional)</Label>
            <Input id="existingFile" name="existingFile" type="file" accept=".safe" />
          </div>
          <Button type="submit" className="w-full" disabled={passwordEntries.length === 0}>
            <Lock className="mr-2 h-4 w-4" />
            Encrypt & Export .safe File
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
