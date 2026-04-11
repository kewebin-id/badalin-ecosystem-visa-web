'use client';

import { decrypt, encrypt } from '@/shared/utils';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cos_saved_credentials';

interface SavedCredential {
  email: string;
  password: string;
  lastUsed: string;
}

export const useRememberMe = () => {
  const [savedCredentials, setSavedCredentials] = useState<SavedCredential[]>([]);

  // Load saved credentials on mount
  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const decrypted = decrypt(stored) as string;
        const parsed = JSON.parse(decrypted) as SavedCredential[];
        setSavedCredentials(parsed);
      }
    } catch (error) {
      console.error('Failed to load saved credentials:', error);
      setSavedCredentials([]);
    }
  };

  const saveCredentials = (email: string, password: string) => {
    try {
      // Remove existing entry for this email
      const filtered = savedCredentials.filter((cred) => cred.email !== email);

      // Add new credential at the beginning (most recent)
      const newCredentials: SavedCredential[] = [
        {
          email,
          password,
          lastUsed: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 5); // Keep only last 5 accounts

      const encrypted = encrypt(JSON.stringify(newCredentials));
      localStorage.setItem(STORAGE_KEY, encrypted);
      setSavedCredentials(newCredentials);
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  };

  const getCredentialByEmail = (email: string): SavedCredential | undefined => {
    return savedCredentials.find((cred) => cred.email === email);
  };

  const removeCredentials = (email?: string) => {
    try {
      if (email) {
        // Remove specific email
        const filtered = savedCredentials.filter((cred) => cred.email !== email);
        const encrypted = encrypt(JSON.stringify(filtered));
        localStorage.setItem(STORAGE_KEY, encrypted);
        setSavedCredentials(filtered);
      } else {
        // Remove all credentials
        localStorage.removeItem(STORAGE_KEY);
        setSavedCredentials([]);
      }
    } catch (error) {
      console.error('Failed to remove credentials:', error);
    }
  };

  const getEmailList = (): string[] => {
    return savedCredentials.map((cred) => cred.email);
  };

  return {
    savedCredentials,
    saveCredentials,
    getCredentialByEmail,
    removeCredentials,
    getEmailList,
  };
};
