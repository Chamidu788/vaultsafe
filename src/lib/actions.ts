'use server';

import { encrypt, decrypt } from './crypto';
import { z } from 'zod';

export type EncryptedEntry = {
  password: string;
  note: string;
  timestamp: string;
};

export type DecryptState = {
  status: 'error' | 'success' | 'idle';
  message?: string;
  data?: EncryptedEntry[];
  attemptsLeft?: number;
};

const passwordsSchema = z.array(z.object({
    password: z.string().min(1, "Password cannot be empty."),
    note: z.string().optional(),
})).min(1, "At least one password is required.");

const encryptSchema = z.object({
  passwords: z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      const validation = passwordsSchema.safeParse(parsed);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        const errorMessage = firstError ? `Invalid input: ${firstError.message}` : "Invalid password entry data.";
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: errorMessage });
        return z.NEVER;
      }
      return validation.data;
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid passwords format.' });
      return z.NEVER;
    }
  }),
  masterPassword: z.string().min(8, "Master password must be at least 8 characters."),
});

export async function encryptAndDownload(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());
  const existingFile = formData.get('existingFile') as File | null;

  const validatedFields = encryptSchema.safeParse(formValues);

  if (!validatedFields.success) {
    const firstError = validatedFields.error.errors[0]?.message;
    return {
      status: 'error' as const,
      message: firstError || "Invalid data provided.",
    };
  }
  
  const { passwords, masterPassword } = validatedFields.data;

  let dataToEncrypt: EncryptedEntry[] = [];

  if (existingFile && existingFile.size > 0) {
    if (!existingFile.name.endsWith('.safe')) {
       return {
          status: 'error' as const,
          message: 'Invalid file type. Please upload a .safe file.',
        };
    }
    const fileBuffer = Buffer.from(await existingFile.arrayBuffer());
    try {
      const decryptedJson = decrypt(fileBuffer, masterPassword);
      const parsedData = JSON.parse(decryptedJson);
      if (!Array.isArray(parsedData)) {
          throw new Error("Corrupted file: data is not an array.");
      }
      dataToEncrypt = parsedData;
    } catch (error) {
      return {
        status: 'error' as const,
        message: 'Failed to decrypt existing file. Check master password or file is not corrupted.',
      };
    }
  }
  
  const newEntries: EncryptedEntry[] = passwords.map(entry => ({
    password: entry.password,
    note: entry.note || '',
    timestamp: new Date().toISOString(),
  }));
  
  dataToEncrypt.push(...newEntries);
  
  const encryptedBuffer = encrypt(JSON.stringify(dataToEncrypt), masterPassword);
  
  return {
    status: 'success' as const,
    fileData: encryptedBuffer.toString('base64'),
  };
}

const decryptSchema = z.object({
  file: z.any()
    .refine((file) => file?.size > 0, "File is required.")
    .refine((file) => file?.name?.endsWith('.safe'), "Invalid file type. Please upload a .safe file."),
  masterPassword: z.string().min(1, "Master password is required."),
});

export async function decryptFile(
  prevState: DecryptState,
  formData: FormData
): Promise<DecryptState> {
  if (prevState.attemptsLeft !== undefined && prevState.attemptsLeft <= 0) {
    return { status: 'error', message: 'Maximum attempts reached.', attemptsLeft: 0, data: undefined };
  }

  const validatedFields = decryptSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
     const firstError = validatedFields.error.errors[0]?.message;
     return { status: 'error', message: firstError || "Invalid form data.", data: undefined, attemptsLeft: prevState.attemptsLeft };
  }

  const { file, masterPassword } = validatedFields.data;

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  try {
    const decryptedJson = decrypt(fileBuffer, masterPassword);
    const data = JSON.parse(decryptedJson) as EncryptedEntry[];
    return { status: 'success', message: 'File decrypted successfully!', data, attemptsLeft: 5 };
  } catch (error) {
    const attemptsLeft = (prevState.attemptsLeft ?? 5) - 1;
    let message = 'Decryption failed. Incorrect master password or corrupted file.';
    if (attemptsLeft <= 0) {
      message = 'Maximum attempts reached. Please refresh the page to try again.'
    }
    return { status: 'error', message, data: undefined, attemptsLeft };
  }
}
