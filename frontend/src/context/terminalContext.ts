import { createContext } from 'react';
import { TerminalContextType } from '@/types';

export const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined
);
