import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

const EditStitchInfoModal = ({
  isOpen,
  onClose,
  handleEditStitchInfo,
  stitchInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleEditStitchInfo: (stitchInfo: {
    id: number;
    stitchName: string;
    stitchType: string;
    seamWidth: string;
    isActive: boolean; // Added isActive
    created: string;
    modified: string;
    authorId: number;
    editorId: number;
  }) => void;
  stitchInfo: {
    id: number;
    stitchName: string;
    stitchType: string;
    seamWidth: string;
    isActive: boolean; // Added isActive
    created: string;
    modified: string;
    authorId: number;
    editorId: number;
  };
}) => {
  const [editedStitchInfo, setEditedStitchInfo] = useState({
    stitchName: stitchInfo.stitchName,
    stitchType: stitchInfo.stitchType,
    seamWidth: stitchInfo.seamWidth,
    isActive: stitchInfo.isActive, // Initialize with isActive
  });

  useEffect(() => {
    if (stitchInfo) {
      setEditedStitchInfo({
        stitchName: stitchInfo.stitchName,
        stitchType: stitchInfo.stitchType,
        seamWidth: stitchInfo.seamWidth,
        isActive: stitchInfo.isActive, // Update on stitchInfo change
      });
    }
  }, [stitchInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setEditedStitchInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    // Ensure all required fields are provided
    handleEditStitchInfo({
      ...stitchInfo, // Maintain existing fields
      ...editedStitchInfo, // Update with edited fields
    });
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Stitch Information
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="  Stitch Type"
      
            placeholder="Stitch Type"
            variant="bordered"
            size="sm"
            name="stitchType"
         
            value={editedStitchInfo.stitchType}
       
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
            value={editedStitchInfo.stitchName}
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
            value={editedStitchInfo.seamWidth}
            onChange={handleChange}
            labelPlacement="outside"
          />
          {/* Checkbox field for isActive */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={editedStitchInfo.isActive} // Bind checkbox to state
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button className="bg-[#B3C300]" onPress={handleSubmit}>
            <span className="text-white font-[500]">Save Changes</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditStitchInfoModal;
