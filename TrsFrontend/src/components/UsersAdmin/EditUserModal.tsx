/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

const EditUserModal = ({
  isOpen,
  onClose,
  handleEditUser,
  user,
}: {
  isOpen: any;
  onClose: any;
  handleEditUser: any;
  user: { username: string; email: string; role: string; PasswordHash: string; isActive: boolean };
}) => {
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    role: "",
    isActive: true, 
  });

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    handleEditUser(editedUser);
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit User
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="Username"
            placeholder="username"
            variant="bordered"
            size="sm"
            name="username"
            value={editedUser.username}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="email"
            label="Email"
            placeholder="Email"
            variant="bordered"
            size="sm"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="text"
            label="Role"
            placeholder="Role"
            variant="bordered"
            size="sm"
            name="role"
            value={editedUser.role}
            onChange={handleChange}
            labelPlacement="outside"
          />
          {/* Add isActive checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={editedUser.isActive}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label
              htmlFor="isActive"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-[#B3C300]" onClick={handleSubmit}>
            <span className="text-white font-[500]">Save changes</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
