import React, { createContext, useState, ReactNode } from "react";

// User Interface
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created: Date;
  modified: Date;
  authorId: number;
  editorId: number;
  isActive:boolean;
}

// StitchInfo Interface
export interface StitchInfo {
  id: number;
  stitchType: string;
  stitchName: string;
  seamWidth: number;
  sewingAllowance: number;
  created: Date;
  modified: Date;
  authorId: number;
  editorId: number;
  authorName: string; // New field for author name
  editorName: string; // New field for editor name
  isActive:boolean;
}

// Contribution Interface
export interface Contribution {
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
  authorName: string; // New field for author name
  editorName: string; // New field for editor name
  isActive:boolean;
}

// Article Interface
export interface Article {
  id: number;
  name: string;
  length: number;
  created: Date;
  modified: Date;
  authorId: number;
  editorId: number;
  authorName: string; // New field for author name
  editorName: string; // New field for editor name
  isActive:boolean;
}

// Unit Interface
export interface Unit {
  id: number;
  name: string;
  description: string;
  created: string;
  modified: string;
  authorId: string;
  editorId: string;
  isActive:boolean;
}

// UsersContext Type
export interface UsersContextType {
  users: User[];
  stitchInfos: StitchInfo[];
  contributions: Contribution[];
  articles: Article[];
  units: Unit[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setStitchInfos: React.Dispatch<React.SetStateAction<StitchInfo[]>>;
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  addUser: (newUser: User) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (id: number) => void;
  addStitchInfo: (stitchInfo: StitchInfo) => void;
  updateStitchInfo: (stitchInfo: StitchInfo) => void;
  deleteStitchInfo: (id: number) => void;
  addContribution: (contribution: Contribution) => void;
  updateContribution: (contribution: Contribution) => void;
  deleteContribution: (id: number) => void;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
  addUnit: (newUnit: Unit) => void;
  updateUnit: (updatedUnit: Unit) => void;
  deleteUnit: (id: number) => void;
}

// Initial Context State
const initialUsersContext: UsersContextType = {
  users: [],
  stitchInfos: [],
  contributions: [],
  articles: [],
  units: [],
  setUsers: () => {},
  setStitchInfos: () => {},
  setContributions: () => {},
  setArticles: () => {},
  setUnits: () => {},
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  addStitchInfo: () => {},
  updateStitchInfo: () => {},
  deleteStitchInfo: () => {},
  addContribution: () => {},
  updateContribution: () => {},
  deleteContribution: () => {},
  addArticle: () => {},
  updateArticle: () => {},
  deleteArticle: () => {},
  addUnit: () => {},
  updateUnit: () => {},
  deleteUnit: () => {},
};

// Create Context
export const UsersContext = createContext<UsersContextType>(initialUsersContext);

// Main Provider Component
interface UserAdminProviderProps {
  children: ReactNode;
}

export const UserAdminProvider: React.FC<UserAdminProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stitchInfos, setStitchInfos] = useState<StitchInfo[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  // User methods
  const addUser = (newUser: User) => setUsers(prev => [...prev, newUser]);
  const updateUser = (updatedUser: User) => setUsers(prev => prev.map(user => (user.id === updatedUser.id ? updatedUser : user)));
  const deleteUser = (id: number) => setUsers(prev => prev.filter(user => user.id !== id));

  // StitchInfo methods
  const addStitchInfo = (stitchInfo: StitchInfo) => setStitchInfos(prev => [...prev, stitchInfo]);
  const updateStitchInfo = (updatedStitchInfo: StitchInfo) => setStitchInfos(prev => prev.map(stitchInfo => (stitchInfo.id === updatedStitchInfo.id ? updatedStitchInfo : stitchInfo)));
  const deleteStitchInfo = (id: number) => setStitchInfos(prev => prev.filter(stitchInfo => stitchInfo.id !== id));

  // Contribution methods
  const addContribution = (contribution: Contribution) => setContributions(prev => [...prev, contribution]);
  const updateContribution = (updatedContribution: Contribution) => setContributions(prev => prev.map(contribution => (contribution.id === updatedContribution.id ? updatedContribution : contribution)));
  const deleteContribution = (id: number) => setContributions(prev => prev.filter(contribution => contribution.id !== id));

  // Article methods
  const addArticle = (article: Article) => setArticles(prev => [...prev, article]);
  const updateArticle = (updatedArticle: Article) => setArticles(prev => prev.map(article => (article.id === updatedArticle.id ? updatedArticle : article)));
  const deleteArticle = (id: number) => setArticles(prev => prev.filter(article => article.id !== id));

  // Unit methods
  const addUnit = (newUnit: Unit) => setUnits(prev => [...prev, newUnit]);
  const updateUnit = (updatedUnit: Unit) => setUnits(prev => prev.map(unit => (unit.id === updatedUnit.id ? updatedUnit : unit)));
  const deleteUnit = (id: number) => setUnits(prev => prev.filter(unit => unit.id !== id));

  return (
    <UsersContext.Provider
      value={{
        users,
        stitchInfos,
        contributions,
        articles,
        units,
        setUsers,
        setStitchInfos,
        setContributions,
        setArticles,
        setUnits,
        addUser,
        updateUser,
        deleteUser,
        addStitchInfo,
        updateStitchInfo,
        deleteStitchInfo,
        addContribution,
        updateContribution,
        deleteContribution,
        addArticle,
        updateArticle,
        deleteArticle,
        addUnit,
        updateUnit,
        deleteUnit,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
