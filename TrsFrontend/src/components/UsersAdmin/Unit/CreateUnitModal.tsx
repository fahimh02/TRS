import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Unit } from "../../../Context/UnitContext";

const CreateUnitModal = ({
  isOpen,
  onClose,
  handleCreateUnit,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleCreateUnit: (unit: Unit) => void;
}) => {
  const initialUnit: Unit = {
    id: 0, 
    name: "",
    description: "",
    created: new Date(), 
    modified: new Date(), 
    authorId: 0, 
    editorId: 0, 
    isActive: true,
  };

  const [newUnit, setNewUnit] = useState<Unit>(initialUnit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setNewUnit((prevUnit) => ({
      ...prevUnit,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    handleCreateUnit(newUnit);
    setNewUnit(initialUnit); // Reset the form after submission
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Create New Unit</h2>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="Unit Name"
            placeholder="Unit Name"
            variant="bordered"
            size="sm"
            name="name"
            value={newUnit.name}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="text"
            label="Description"
            placeholder="Description"
            variant="bordered"
            size="sm"
            name="description"
            value={newUnit.description}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={newUnit.isActive}
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
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button className="bg-[#B3C300]" onPress={handleSubmit}>
            <span className="text-white font-semibold">Create</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUnitModal;
