import React, { createContext, useState, ReactNode } from "react";
import axios from "../api/axios";

// Define the StyleInfo interface with additional fields
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
export interface StyleInfoContextType {
  styleInfos: StyleInfo[];
  fetchStyleInfos: () => Promise<void>;
  addStyleInfo: (styleInfo: StyleInfo) => void;
  updateStyleInfo: (styleInfo: StyleInfo) => void;
  deleteStyleInfo: (id: number) => void;
}

// Initial context values
const initialStyleInfoContext: StyleInfoContextType = {
  styleInfos: [],
  fetchStyleInfos: async () => {},
  addStyleInfo: () => {},
  updateStyleInfo: () => {},
  deleteStyleInfo: () => {},
};

// Create the context
export const StyleInfoContext = createContext<StyleInfoContextType>(initialStyleInfoContext);

// Define props for the provider component
interface StyleInfoProviderProps {
  children: ReactNode;
}

// Provider component implementation
export const StyleInfoProvider: React.FC<StyleInfoProviderProps> = ({ children }) => {
  const [styleInfos, setStyleInfos] = useState<StyleInfo[]>([]);

  // Fetch style information from the API
  const fetchStyleInfos = async () => {
    try {
      const response = await axios.get("/api/styles");
      setStyleInfos(response.data);
    } catch (error) {
      console.error("Error fetching style information:", error);
    }
  };

  // Add new style information
  const addStyleInfo = (newStyleInfo: StyleInfo) => {
    setStyleInfos((prev) => [...prev, newStyleInfo]);
  };

  // Update existing style information
  const updateStyleInfo = (updatedStyleInfo: StyleInfo) => {
    setStyleInfos((prev) =>
      prev.map((styleInfo) =>
        styleInfo.id === updatedStyleInfo.id ? updatedStyleInfo : styleInfo
      )
    );
  };

  // Delete style information by ID
  const deleteStyleInfo = (id: number) => {
    setStyleInfos((prev) => prev.filter((styleInfo) => styleInfo.id !== id));
  };

  return (
    <StyleInfoContext.Provider
      value={{
        styleInfos,
        fetchStyleInfos,
        addStyleInfo,
        updateStyleInfo,
        deleteStyleInfo,
      }}
    >
      {children}
    </StyleInfoContext.Provider>
  );
};

export default StyleInfoProvider;
