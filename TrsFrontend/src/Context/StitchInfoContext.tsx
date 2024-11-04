import React, {
  createContext,
  useState,
  ReactNode
} from "react";

export interface StitchInfo {
  id: number;
  name: string;
  created:string;
  modified:string;
  authorId:string;
  editorId:string;
  seamWidth:string;
  seawingAllowance:string;
  stitchName:string;
  stitchType:string;
  isActive:boolean;
}


export interface StitchInfosContextType {
  stitchInfos: StitchInfo[];
  setStitchInfos: React.Dispatch<React.SetStateAction<StitchInfo[]>>;
  addStitchInfo: (newStitchInfo: StitchInfo) => void;
  updateStitchInfo: (updatedStitchInfo: StitchInfo) => void;
  deleteStitchInfo: (id: number) => void;
}

const initialStitchInfosContext: StitchInfosContextType = {
  stitchInfos: [],
  setStitchInfos: () => {},
  addStitchInfo: () => {},
  updateStitchInfo: () => {},
  deleteStitchInfo: () => {},
};

export const StitchInfosContext =
  createContext<StitchInfosContextType>(initialStitchInfosContext);

 const StitchInfosProvider = ({ children }: { children: ReactNode }) => {
  const [stitchInfos, setStitchInfos] = useState<StitchInfo[]>([]);

  const addStitchInfo = (newStitchInfo: StitchInfo) => {
    setStitchInfos([...stitchInfos, newStitchInfo]);
  };

  const updateStitchInfo = (updatedStitchInfo: StitchInfo) => {
    const updatedStitchInfos = stitchInfos.map((stitchInfo) =>
      stitchInfo.id === updatedStitchInfo.id ? updatedStitchInfo : stitchInfo
    );
    setStitchInfos(updatedStitchInfos);
  };

  const deleteStitchInfo = (id: number) => {
    const updatedStitchInfos = stitchInfos.filter((stitchInfo) => stitchInfo.id !== id);
    setStitchInfos(updatedStitchInfos);
  };

  return (
    <StitchInfosContext.Provider
      value={{ stitchInfos, setStitchInfos, addStitchInfo, updateStitchInfo, deleteStitchInfo }}
      >
      {children}
    </StitchInfosContext.Provider>
  );
};
export default StitchInfosProvider;