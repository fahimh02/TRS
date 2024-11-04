import React, { createContext, useState, ReactNode } from "react";
import axios from "../api/axios";

export interface ContributionInfo {
  id: number;
  stitchType: string;
  needle: string;
  bobbin: string;
  cover: string;
  total: number;
  created: string;
  modified: string;
  authorId: number;
  editorId: number;
  authorName:string;
  editorName:string;
  isActive:boolean;
}

export interface ContributionInfoContextType {
  contributionInfos: ContributionInfo[];
  setContributionInfos: React.Dispatch<React.SetStateAction<ContributionInfo[]>>;
  addContributionInfo: (newContributionInfo: ContributionInfo) => void;
  updateContributionInfo: (updatedContributionInfo: ContributionInfo) => void;
  deleteContributionInfo: (id: number) => void;
}

const initialContributionInfoContext: ContributionInfoContextType = {
  contributionInfos: [],
  setContributionInfos: () => {},
  addContributionInfo: () => {},
  updateContributionInfo: () => {},
  deleteContributionInfo: () => {},
};

export const ContributionInfoContext = createContext<ContributionInfoContextType>(initialContributionInfoContext);

const ContributionInfoProvider = ({ children }: { children: ReactNode }) => {
  const [contributionInfos, setContributionInfos] = useState<ContributionInfo[]>([]);

  const addContributionInfo = async (newContributionInfo: ContributionInfo) => {
    try {
      const response = await axios.post("/api/admin/contribution", newContributionInfo);
      setContributionInfos([...contributionInfos, response.data]);
    } catch (error) {
      console.error("Error adding contribution info:", error);
    }
  };

  const updateContributionInfo = async (updatedContributionInfo: ContributionInfo) => {
    try {
      await axios.put(`/api/admin/contribution/${updatedContributionInfo.id}`, updatedContributionInfo);
      const updatedContributionInfos = contributionInfos.map((contributionInfo) =>
        contributionInfo.id === updatedContributionInfo.id ? updatedContributionInfo : contributionInfo
      );
      setContributionInfos(updatedContributionInfos);
    } catch (error) {
      console.error("Error updating contribution info:", error);
    }
  };

  const deleteContributionInfo = async (id: number) => {
    try {
      await axios.delete(`/api/admin/contribution/${id}`);
      const updatedContributionInfos = contributionInfos.filter((contributionInfo) => contributionInfo.id !== id);
      setContributionInfos(updatedContributionInfos);
    } catch (error) {
      console.error("Error deleting contribution info:", error);
    }
  };

  return (
    <ContributionInfoContext.Provider
      value={{ contributionInfos, setContributionInfos, addContributionInfo, updateContributionInfo, deleteContributionInfo }}
    >
      {children}
    </ContributionInfoContext.Provider>
  );
};

export default ContributionInfoProvider;
