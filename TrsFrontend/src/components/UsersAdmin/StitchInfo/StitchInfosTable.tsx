import React from "react";
import { Button } from "@nextui-org/react";

interface StitchInfo {
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
  isActive: boolean; // New field for active status
}

interface StitchInfosTableProps {
  stitchInfos: StitchInfo[];
  handleEditStitchInfo: (stitchInfo: StitchInfo) => void;
  handleDeleteStitchInfo: (id: number) => void;
}

const StitchInfosTable: React.FC<StitchInfosTableProps> = ({
  stitchInfos,
  handleEditStitchInfo,
  handleDeleteStitchInfo,
}) => {
  const confirmDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this stitch information?")) {
      handleDeleteStitchInfo(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stitch Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stitch Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Seam Width</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Author</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Modified</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Editor</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th> {/* New column for active status */}
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stitchInfos.map((stitchInfo) => (
            <tr key={stitchInfo.id} className="hover:bg-gray-50">
              <td className="text-left py-3 px-4 text-sm text-gray-700">{stitchInfo.stitchType}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{stitchInfo.stitchName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{stitchInfo.seamWidth}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(stitchInfo.created).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{stitchInfo.authorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(stitchInfo.modified).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{stitchInfo.editorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">
                {stitchInfo.isActive ? "Active" : "Inactive"} {/* Display active status */}
              </td>
              <td className="text-left py-3 px-4 text-sm">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditStitchInfo(stitchInfo)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => confirmDelete(stitchInfo.id)}
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

export default StitchInfosTable;
