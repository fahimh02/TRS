import React from "react";
import { Button } from "@nextui-org/react";
import { StyleInfo } from "../../Context/StyleInfoContext"; // Adjust the import path according to your project structure

interface StyleInfosTableProps {
  styleInfos: StyleInfo[];
  handleEditStyleInfo: (styleInfo: StyleInfo) => void;
  handleDeleteStyleInfo: (id: number) => void;
}

const StyleInfosTable: React.FC<StyleInfosTableProps> = ({
  styleInfos,
  handleEditStyleInfo,
  handleDeleteStyleInfo,
}) => {
  const confirmDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this style information?")) {
      handleDeleteStyleInfo(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Style Code</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Style Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Style Number</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Thickness Fabric</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Season</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Buyer Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Size</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">General Allowance</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total Garments</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Modified</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {styleInfos.map((styleInfo) => (
            <tr key={styleInfo.id} className="hover:bg-gray-50">
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.styleCode}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.styleName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.styleNumber}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.styleDescription}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.thicknessFabric}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.season}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.buyerName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.size}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.generalAllowance}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{styleInfo.totalGarments}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(styleInfo.created).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(styleInfo.modified).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditStyleInfo(styleInfo)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => confirmDelete(styleInfo.id)}
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

export default StyleInfosTable;
