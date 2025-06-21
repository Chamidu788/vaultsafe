'use client';

import { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { PasswordGenerator, type PasswordEntry } from '@/components/password-generator';
import { EncryptForm } from '@/components/encrypt-form';
import { DecryptForm } from '@/components/decrypt-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

function VaultSafeLogo() {
  return (
    <div className="flex items-center justify-center gap-3 text-primary">
      <ShieldCheck className="h-10 w-10" />
      <h1 className="text-4xl font-bold tracking-tight">VaultSafe</h1>
    </div>
  );
}

function AboutSection() {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="h-6 w-6" />
                    About VaultSafe & How It Works
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                    <h3 className="font-semibold text-card-foreground">How It Works</h3>
                    <p>
                        VaultSafe is a powerful, secure, and entirely client-side password management tool. All operations happen directly in your browser, ensuring your data remains private.
                    </p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                        <li><strong>Generate:</strong> Create one or more strong, random passwords based on your specified criteria like length and character types.</li>
                        <li><strong>Encrypt:</strong> Your generated passwords and any associated notes are encrypted using the robust AES-256 encryption standard with a master password that only you know.</li>
                        <li><strong>Export:</strong> The encrypted data is packaged into a secure <code className="font-mono text-xs bg-muted p-1 rounded-sm">.safe</code> file, which is downloaded directly to your device.</li>
                        <li><strong>Decrypt:</strong> To access your passwords, simply upload your <code className="font-mono text-xs bg-muted p-1 rounded-sm">.safe</code> file and provide your master password. The decryption process also occurs locally in your browser.</li>
                    </ol>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-card-foreground">Your Security is Paramount</h3>
                    <p>
                        <strong>We never store your data.</strong> VaultSafe is built on a "zero-knowledge" principle. Your master password, generated passwords, and notes are never transmitted over the internet or stored on any server. The entire process, from generation to encryption and decryption, happens securely on your own device.
                    </p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-card-foreground">Developed By</h3>
                     <p>
                        A project by <strong>MC Digital Innovate</strong> – <a href="https://mcdi.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">mcdi.vercel.app</a>.
                    </p>
                    <ul className="list-disc list-inside pl-2">
                        <li>Chamindu Kavishka – <a href="https://chamindu1.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">chamindu1.vercel.app</a></li>
                        <li>Maheshika Devindya – <a href="https://maheshika1.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">maheshika1.vercel.app</a></li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Home() {
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntry[]>([]);

  return (
    <main className="relative flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          <VaultSafeLogo />
          <p className="text-muted-foreground">
            Your personal fortress for creating and storing secure passwords.
          </p>
        </header>

        <div className="space-y-8">
          <PasswordGenerator 
            passwordEntries={passwordEntries} 
            setPasswordEntries={setPasswordEntries} 
          />
          <EncryptForm 
            passwordEntries={passwordEntries} 
          />
          <DecryptForm />
          <AboutSection />
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VaultSafe. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
