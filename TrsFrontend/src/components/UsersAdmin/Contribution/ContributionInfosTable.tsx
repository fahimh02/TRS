import React from "react";
import { Button } from "@nextui-org/react";
import { ContributionInfo } from "../../../Context/ContributionInfoContext";

interface ContributionInfosTableProps {
  contributionInfos: ContributionInfo[];
  handleEditContributionInfo: (contributionInfo: ContributionInfo) => void;
  handleDeleteContributionInfo: (id: number) => void;
}

const ContributionInfosTable: React.FC<ContributionInfosTableProps> = ({
  contributionInfos,
  handleEditContributionInfo,
  handleDeleteContributionInfo,
}) => {
  const confirmDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this contribution information?")) {
      handleDeleteContributionInfo(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stitch Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Needle</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bobbin</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cover</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Author</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Modified</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Editor</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th> 
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contributionInfos.map((contributionInfo) => (
            <tr key={contributionInfo.id} className="hover:bg-gray-50">
              <td className="text-left py-3 px-4 text-sm text-gray-700">{contributionInfo.stitchType}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{contributionInfo.needle}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{contributionInfo.bobbin}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{contributionInfo.cover}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{contributionInfo.total}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(contributionInfo.created).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{contributionInfo.authorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(contributionInfo.modified).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{contributionInfo.editorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">
                {contributionInfo.isActive ? "Active" : "Inactive"} {/* Display active status */}
              </td>
              <td className="text-left py-3 px-4 text-sm">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditContributionInfo(contributionInfo)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => confirmDelete(contributionInfo.id)}
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

export default ContributionInfosTable;
