/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Article interface defining the shape of each article.
export interface Article {
  Id: number;
  Name: string;
  Length: number;
  Created?: string; // Dates can be strings for flexibility with JSON or database
  Modified?: string;
  AuthorId?: string;
  EditorId?: string;
  isActive: boolean; // Field to track the active state of the article
}

// ArticleContextType interface defining the context structure.
interface ArticleContextType {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
}

// Initial state for the context to avoid undefined errors.
const initialArticleContext: ArticleContextType = {
  articles: [],
  setArticles: () => {},
  addArticle: () => {},
  updateArticle: () => {},
  deleteArticle: () => {},
};

// Create ArticleContext using the defined type.
export const ArticleContext = createContext<ArticleContextType>(initialArticleContext);

// Custom hook to use ArticleContext more easily within components.
export const useArticleContext = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticleContext must be used within an ArticleProvider');
  }
  return context;
};

// Props type for the provider to accept children components.
interface ArticleProviderProps {
  children: ReactNode;
}

// ArticleProvider component that manages article data and exposes it via context.
export const ArticleProvider: React.FC<ArticleProviderProps> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  // Function to add a new article to the list.
  const addArticle = (article: Article) => {
    setArticles((prevArticles) => [...prevArticles, article]);
  };

  // Function to update an existing article in the list.
  const updateArticle = (updatedArticle: Article) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.Id === updatedArticle.Id ? updatedArticle : article
      )
    );
  };

  // Function to delete an article by its ID.
  const deleteArticle = (id: number) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.Id !== id)
    );
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        setArticles,
        addArticle,
        updateArticle,
        deleteArticle,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export default ArticleProvider;
