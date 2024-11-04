/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CreateStitchInfoModal = ({
  isOpen,
  onClose,
  handleCreateStitchInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleCreateStitchInfo: (stitchInfo: any) => void;
}) => {
  const initialStitchInfo = {
    stitchType: "",
    stitchName: "",
    seamWidth: 0,
    seawingAllowance: 0,
    isActive: true, 
  };

  const [newStitchInfo, setNewStitchInfo] = useState(initialStitchInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewStitchInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    handleCreateStitchInfo(newStitchInfo);
    // Reset the form after submission
    setNewStitchInfo(initialStitchInfo);
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Create New Stitch Info</h2>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="Stitch Type"
            placeholder="Stitch Type"
            variant="bordered"
            size="sm"
            name="stitchType"
            value={newStitchInfo.stitchType}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="text"
            label="Stitch Name"
            placeholder="Stitch Name"
            variant="bordered"
            size="sm"
            name="stitchName"
            value={newStitchInfo.stitchName}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="text"
            label="Seam Width"
            placeholder="Seam Width"
            variant="bordered"
            size="sm"
            name="seamWidth"
            value={newStitchInfo.seamWidth?.toString() || ""}
            onChange={handleChange}
            labelPlacement="outside"
          />
          {/* Checkbox field for isActive */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={newStitchInfo.isActive}
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

export default CreateStitchInfoModal;
