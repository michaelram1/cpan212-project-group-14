'use client';
import { createContext, useContext, useState } from 'react';

const SelectionContext = createContext(null);
export function TripSelectionProvider({ children }) {
  const [selectedTripId, setSelectedTripId] = useState(null);
  return <SelectionContext.Provider value={{ selectedTripId, setSelectedTripId }}>{children}</SelectionContext.Provider>;
}
export function useSelectedTrip() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('useSelectedTrip requires TripSelectionProvider');
  return context;
}
