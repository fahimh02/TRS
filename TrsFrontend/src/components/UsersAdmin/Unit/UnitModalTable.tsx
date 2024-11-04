import React from "react";
import { Button } from "@nextui-org/react";

interface Unit {
  id: number;
  name: string;
  description: string;
  created: Date;
  modified: Date;
  authorId: string;
  editorId: string;
  authorName: string; // Field for author name
  editorName: string; // Field for editor name
  isActive: boolean;
}

interface UnitTableProps {
  units: Unit[];
  handleEditUnit: (unit: Unit) => void;
  handleDeleteUnit: (id: number) => void;
}

const UnitTable: React.FC<UnitTableProps> = ({
  units,
  handleEditUnit,
  handleDeleteUnit,
}) => {
  const confirmDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this unit?")) {
      handleDeleteUnit(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Unit Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Author</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Modified</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Editor</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {units.map((unit) => (
            <tr key={unit.id} className="hover:bg-gray-50">
              <td className="text-left py-3 px-4 text-sm text-gray-700">{unit.name}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{unit.description}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(unit.created).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{unit.authorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{new Date(unit.modified).toLocaleDateString()}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">{unit.editorName}</td>
              <td className="text-left py-3 px-4 text-sm text-gray-700">
                {unit.isActive ? "Active" : "Inactive"}
              </td>
              <td className="text-left py-3 px-4 text-sm">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditUnit(unit)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => confirmDelete(unit.id)}
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

export default UnitTable;
