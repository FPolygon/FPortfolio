import { createContext } from "react";
import { TerminalContextType } from "../types/terminal";

export const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined,
);
