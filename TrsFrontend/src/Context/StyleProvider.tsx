import React, { createContext, useState, ReactNode } from "react";

// Updated StyleInfo interface with additional fields
export interface StyleInfo {
  id: number;
  styleCode: string;
  styleName: string;
  styleNumber: string;
  styleDescription: string;
  thicknessFabric: string;
  season: string;
  buyerName: string;
  size: string;
  generalAllowance: string;
  totalGarments: number;
  created: Date;
  modified: Date;
}

// Interface for the context type
export interface StyleInfosContextType {
  styleInfos: StyleInfo[];
  setStyleInfos: React.Dispatch<React.SetStateAction<StyleInfo[]>>;
  addStyleInfo: (styleInfo: StyleInfo) => void;
  updateStyleInfo: (styleInfo: StyleInfo) => void;
  deleteStyleInfo: (id: number) => void;
}

// Initial context values
const initialStyleInfosContext: StyleInfosContextType = {
  styleInfos: [],
  setStyleInfos: () => {},
  addStyleInfo: () => {},
  updateStyleInfo: () => {},
  deleteStyleInfo: () => {},
};

// Create the context
export const StyleInfosContext = createContext<StyleInfosContextType>(initialStyleInfosContext);

// Define props for the provider component
interface StyleProviderProps {
  children: ReactNode;
}

// Provider component implementation
export const StyleProvider: React.FC<StyleProviderProps> = ({ children }) => {
  const [styleInfos, setStyleInfos] = useState<StyleInfo[]>([]);

  const addStyleInfo = (newStyleInfo: StyleInfo) =>
    setStyleInfos((prev) => [...prev, newStyleInfo]);

  const updateStyleInfo = (updatedStyleInfo: StyleInfo) =>
    setStyleInfos((prev) =>
      prev.map((styleInfo) =>
        styleInfo.id === updatedStyleInfo.id ? updatedStyleInfo : styleInfo
      )
    );

  const deleteStyleInfo = (id: number) =>
    setStyleInfos((prev) => prev.filter((styleInfo) => styleInfo.id !== id));

  return (
    <StyleInfosContext.Provider
      value={{
        styleInfos,
        setStyleInfos,
        addStyleInfo,
        updateStyleInfo,
        deleteStyleInfo,
      }}
    >
      {children}
    </StyleInfosContext.Provider>
  );
};

export default StyleProvider;
