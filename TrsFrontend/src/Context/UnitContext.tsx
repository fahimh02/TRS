import React, { createContext, useState, ReactNode } from "react";

export interface Unit {
  id: number;
  name: string;
  description:string;
  created: Date;
  modified: Date;
  authorId: number;
  editorId: number;
  isActive:boolean;
}

export interface UnitsContextType {
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  addUnit: (newUnit: Unit) => void;
  updateUnit: (updatedUnit: Unit) => void;
  deleteUnit: (id: number) => void;
}

const initialUnitsContext: UnitsContextType = {
  units: [],
  setUnits: () => {},
  addUnit: () => {},
  updateUnit: () => {},
  deleteUnit: () => {},
};

export const UnitsContext = createContext<UnitsContextType>(initialUnitsContext);

const UnitsProvider = ({ children }: { children: ReactNode }) => {
  const [units, setUnits] = useState<Unit[]>([]);

  const addUnit = (newUnit: Unit) => {
    setUnits([...units, newUnit]);
  };

  const updateUnit = (updatedUnit: Unit) => {
    const updatedUnits = units.map((unit) =>
      unit.id === updatedUnit.id ? updatedUnit : unit
    );
    setUnits(updatedUnits);
  };

  const deleteUnit = (id: number) => {
    const updatedUnits = units.filter((unit) => unit.id !== id);
    setUnits(updatedUnits);
  };

  return (
    <UnitsContext.Provider value={{ units, setUnits, addUnit, updateUnit, deleteUnit }}>
      {children}
    </UnitsContext.Provider>
  );
};

export default UnitsProvider;
