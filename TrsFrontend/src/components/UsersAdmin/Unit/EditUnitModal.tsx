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
import { Unit } from "../../../Context/UnitContext";

const EditUnitModal = ({
  isOpen,
  onClose,
  handleUpdateUnit,
  unitToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleUpdateUnit: (unit: Unit) => void;
  unitToEdit: Unit | null; // Expecting unit to edit or null
}) => {
  const [editUnit, setEditUnit] = useState<Unit | null>(null);

  useEffect(() => {
    setEditUnit(unitToEdit);
  }, [unitToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditUnit((prevUnit: any) =>
      prevUnit ? { ...prevUnit, [name]: type === "checkbox" ? checked : value } : null
    );
  };

  const handleSubmit = () => {
    if (editUnit) {
      handleUpdateUnit(editUnit);
      setEditUnit(null); // Reset the form after submission
      onClose();
    }
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Edit Unit</h2>
        </ModalHeader>
        <ModalBody>
          {editUnit && (
            <>
              <Input
                type="text"
                label="Unit Name"
                placeholder="Unit Name"
                variant="bordered"
                size="sm"
                name="name"
                value={editUnit.name}
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
                value={editUnit.description}
                onChange={handleChange}
                labelPlacement="outside"
              />

              {/* Checkbox field for isActive */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={editUnit.isActive}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button className="bg-[#B3C300]" onPress={handleSubmit}>
            <span className="text-white font-semibold">Update</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUnitModal;
