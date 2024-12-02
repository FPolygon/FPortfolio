import React, { useState, useCallback, useMemo } from 'react';
import { TerminalState, TerminalHistoryItem } from '../types/terminal';
import { MAX_HISTORY_LENGTH, MAX_COMMAND_HISTORY } from '../constants/terminal';
import { generateId } from '../utils/terminal';
import { TerminalContext } from './terminalContext';

// Terminal Provider component for managing terminal state and history
export const TerminalProvider: React.FC<{
  children: React.ReactNode;
  maxHistory?: number;
  maxCommandHistory?: number;
}> = ({
  children,
  maxHistory = MAX_HISTORY_LENGTH,
  maxCommandHistory = MAX_COMMAND_HISTORY,
}) => {
  // Initialize terminal state
  const [state, setState] = useState<TerminalState>({
    input: '',
    history: [],
    commandHistory: [],
    historyIndex: -1,
  });

  // Add new item to terminal history with size limit enforcement
  const addToHistory = useCallback(
    (item: Omit<TerminalHistoryItem, 'id' | 'timestamp'>) => {
      setState(prev => {
        const newItem: TerminalHistoryItem = {
          ...item,
          id: generateId(),
          timestamp: Date.now(),
        };

        const newHistory = [...prev.history, newItem];
        if (newHistory.length > maxHistory) {
          newHistory.splice(0, newHistory.length - maxHistory);
        }
        return {
          ...prev,
          history: newHistory,
        };
      });
    },
    [maxHistory]
  );

  // Clear terminal history
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
    }));
  }, []);

  // Update current input value
  const setInput = useCallback((input: string) => {
    setState(prev => ({
      ...prev,
      input,
    }));
  }, []);

  // Add command to command history with size limit enforcement
  const addToCommandHistory = useCallback(
    (command: string) => {
      setState(prev => {
        const newCommandHistory = [...prev.commandHistory, command];
        if (newCommandHistory.length > maxCommandHistory) {
          newCommandHistory.splice(
            0,
            newCommandHistory.length - maxCommandHistory
          );
        }
        return {
          ...prev,
          commandHistory: newCommandHistory,
          historyIndex: -1,
        };
      });
    },
    [maxCommandHistory]
  );

  // Update history index with bounds checking
  const setHistoryIndex = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      historyIndex: Math.min(
        Math.max(index, -1),
        prev.commandHistory.length - 1
      ),
    }));
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      state,
      addToHistory,
      clearHistory,
      setInput,
      addToCommandHistory,
      setHistoryIndex,
    }),
    [
      state,
      addToHistory,
      clearHistory,
      setInput,
      addToCommandHistory,
      setHistoryIndex,
    ]
  );

  return (
    <TerminalContext.Provider value={contextValue}>
      {children}
    </TerminalContext.Provider>
  );
};
