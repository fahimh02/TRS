/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

// Extracted initial state
const initialUserState = {
  username: "",
  email: "",
  PasswordHash: "",
  isActive: true, 
};

const CreateUserModal = ({
  isOpen,
  onClose,
  handleCreateUser,
}: {
  isOpen: any;
  onClose: any;
  handleCreateUser: any;
}) => {
  const [newUser, setNewUser] = useState(initialUserState);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    handleCreateUser(newUser);
    setNewUser(initialUserState); // Reset the form after submission
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Create New User</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="Username"
            placeholder="Name"
            variant="bordered"
            size="sm"
            name="username"
            value={newUser.username}
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
            value={newUser.email}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type={isVisible ? "text" : "password"}
            label="Password"
            placeholder="Password"
            variant="bordered"
            size="sm"
            name="PasswordHash"
            value={newUser.PasswordHash}
            onChange={handleChange}
            labelPlacement="outside"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <BsEye className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <BsEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          {/* Add isActive checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={newUser.isActive}
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
            <span className="text-white font-[500]">Create</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;
