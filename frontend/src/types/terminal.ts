export interface TerminalHistoryItem {
  id: string;
  timestamp: number;
  type: 'command' | 'output' | 'error';
  content: string;
}

export interface TerminalState {
  input: string;
  history: TerminalHistoryItem[];
  commandHistory: string[];
  historyIndex: number;
}

export interface TerminalContextType {
  state: TerminalState;
  addToHistory: (item: Omit<TerminalHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  setInput: (input: string) => void;
  addToCommandHistory: (command: string) => void;
  setHistoryIndex: (index: number) => void;
}
