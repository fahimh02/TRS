import React from "react";
import { Button } from "@nextui-org/react";

interface ArticleInfo {
  id: number;
  name: string;
  length: number;
  created: Date;
  modified: Date;
  authorId: number;
  editorId: number;
  editorName: string;
  authorName: string;
  isActive: boolean; 
}

interface ArticleInfoTableProps {
  articles: ArticleInfo[];
  handleEditArticle: (article: ArticleInfo) => void;
  handleDeleteArticle: (id: number) => void;
}

const ArticleInfoTable: React.FC<ArticleInfoTableProps> = ({
  articles,
  handleEditArticle,
  handleDeleteArticle,
}) => {
  const confirmDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      handleDeleteArticle(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Length</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Author</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Modified</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Editor</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th> 
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50">
              <td className="text-left py-3 px-4 text-sm text-gray-700">{article.name}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{article.length}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(article.created).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{article.authorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(article.modified).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{article.editorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">
                {article.isActive ? "Active" : "Inactive"} 
              </td>
              <td className="text-left py-3 px-4 text-sm">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditArticle(article)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => confirmDelete(article.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleInfoTable;
