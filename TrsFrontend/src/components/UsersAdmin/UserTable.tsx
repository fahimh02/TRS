import React from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created?: Date | null;
  modified?: Date | null;
  authorId?: number | null;
  editorId?: number | null;
  authorName?: string | null;  
  editorName?: string | null;  
  isActive: boolean;  
}

interface UsersTableProps {
  users: User[];
  handleDeleteUser: (id: number) => void;
  handleEditUser: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, handleDeleteUser, handleEditUser }) => {
  const confirmDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      handleDeleteUser(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Username</th>
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Email</th>
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Role</th>
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Created</th>
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Modified</th>
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Author</th>
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Editor</th>
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Status</th> 
            <th className="py-3 px-4 text-sm font-medium text-left text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">{user.username}</td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">{user.email}</td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">{user.role}</td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">{user.created ? new Date(user.created).toLocaleDateString() : "N/A"}</td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">{user.modified ? new Date(user.modified).toLocaleDateString() : "N/A"}</td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">{user.authorName || "N/A"}</td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">{user.editorName || "N/A"}</td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">
                {user.isActive ? "Active" : "Inactive"} 
              </td>
              <td className="py-3 px-4 text-sm font-small text-left text-gray-600">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
