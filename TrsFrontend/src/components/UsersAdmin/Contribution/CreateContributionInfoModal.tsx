import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { StitchInfo } from "../../../Context/UserAdminProvider";

interface ContributionInfo {
  stitchType: number;
  stitchName: string;
  stitchId: number;
  needle: string;
  bobbin: string;
  cover: string;
  total: string; 
  isActive: boolean;  // Add isActive to the interface
}

interface CreateContributionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleCreateContributionInfo: (contributionInfo: ContributionInfo) => void;
  stitchInfos: StitchInfo[];
}

const CreateContributionInfoModal: React.FC<CreateContributionInfoModalProps> = ({
  isOpen,
  onClose,
  handleCreateContributionInfo,
  stitchInfos
}) => {
  const initialContributionInfo: ContributionInfo = {
    stitchType: 0,
    stitchId: 0,
    stitchName: "",
    needle: "",
    bobbin: "",
    cover: "",
    total: "0",
    isActive: true, 
  };

  const [newContributionInfo, setNewContributionInfo] = useState<ContributionInfo>(initialContributionInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContributionInfo((prevInfo) => {
      const updatedInfo = { ...prevInfo, [name]: value };

      // Calculate total if needle, bobbin, or cover changes
      if (name === "needle" || name === "bobbin" || name === "cover") {
        const needleValue = parseFloat(updatedInfo.needle) || 0;
        const bobbinValue = parseFloat(updatedInfo.bobbin) || 0;
        const coverValue = parseFloat(updatedInfo.cover) || 0;
        const total = needleValue + bobbinValue + coverValue;
        updatedInfo.total = total.toString(); 
      }

      return updatedInfo;
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContributionInfo((prevInfo) => ({
      ...prevInfo,
      isActive: e.target.checked,
    }));
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewContributionInfo({ ...newContributionInfo, stitchId: parseFloat(event.target.value) });
  };

  const handleSubmit = () => {
    handleCreateContributionInfo(newContributionInfo);
    // Reset the form after submission
    setNewContributionInfo(initialContributionInfo);
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Create New Contribution Info</h2>
        </ModalHeader>
        <ModalBody>
          <div>
            <label htmlFor="stitchType" className="block text-sm font-medium text-gray-700">
              Stitch Type
            </label>
            <select
              id="stitchType"
              name="stitchType"
              value={newContributionInfo.stitchId}
              onChange={handleDropdownChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            >
              <option value="">Select a stitch type</option>
              {stitchInfos.map((stitch) => (
                <option key={stitch.id} value={stitch.id}>
                  {stitch.stitchType} - {stitch.stitchName}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="text"
            label="Needle"
            placeholder="Needle"
            variant="bordered"
            size="sm"
            name="needle"
            value={newContributionInfo.needle}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="text"
            label="Bobbin"
            placeholder="Bobbin"
            variant="bordered"
            size="sm"
            name="bobbin"
            value={newContributionInfo.bobbin}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="text"
            label="Cover"
            placeholder="Cover"
            variant="bordered"
            size="sm"
            name="cover"
            value={newContributionInfo.cover}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Total
            </label>
            <input
              type="text"
              value={newContributionInfo.total}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100"
            />
          </div>

          {/* Checkbox for isActive */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={newContributionInfo.isActive}
              onChange={handleCheckboxChange}
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
            <span className="text-white font-semibold">Create</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateContributionInfoModal;
