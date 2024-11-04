import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { StitchInfo } from "../../../Context/UserAdminProvider";

interface ContributionInfo {
  stitchType: string;
  stitchName: string;
  stitchId: number;
  needle: string;
  bobbin: string;
  cover: string;
  total: string; 
  isActive: boolean; // Add isActive to the interface
}

interface EditContributionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleEditContributionInfo: (contributionInfo: ContributionInfo) => void;
  stitchInfos: StitchInfo[];
  contribution: ContributionInfo;
}

const EditContributionInfoModal: React.FC<EditContributionInfoModalProps> = ({
  isOpen,
  onClose,
  handleEditContributionInfo,
  stitchInfos,
  contribution
}) => {
  const [editedContributionInfo, setEditedContributionInfo] = useState<ContributionInfo>(contribution);

  useEffect(() => {
    setEditedContributionInfo(contribution);
  }, [contribution]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox change
    if (type === "checkbox") {
      setEditedContributionInfo((prevInfo) => ({ ...prevInfo, [name]: checked }));
      return;
    }

    setEditedContributionInfo((prevInfo) => {
      const updatedInfo = { ...prevInfo, [name]: value };

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

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStitch = stitchInfos.find(stitch => stitch.id === parseInt(event.target.value));
    if (selectedStitch) {
      setEditedContributionInfo({
        ...editedContributionInfo,
        stitchId: selectedStitch.id,
        stitchType: selectedStitch.stitchType,
        stitchName: selectedStitch.stitchName,
      });
    }
  };

  const handleSubmit = () => {
    handleEditContributionInfo(editedContributionInfo);
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Edit Contribution Info</h2>
        </ModalHeader>
        <ModalBody>
          <div>
            <label htmlFor="stitchType" className="block text-sm font-medium text-gray-700">
              Stitch Type
            </label>
            <select
              id="stitchType"
              name="stitchType"
              value={editedContributionInfo.stitchId}
              onChange={handleDropdownChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            >
              <option value="" disabled>Select a stitch type</option>
              {stitchInfos.map((stitch) => (
                <option key={stitch.id} value={stitch.id}>
                  {stitch.stitchType} - {stitch.stitchName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="needle" className="block text-sm font-medium text-gray-700">
              Needle
            </label>
            <Input
              id="needle"
              name="needle"
              value={editedContributionInfo.needle}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="bobbin" className="block text-sm font-medium text-gray-700">
              Bobbin
            </label>
            <Input
              id="bobbin"
              name="bobbin"
              value={editedContributionInfo.bobbin}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-gray-700">
              Cover
            </label>
            <Input
              id="cover"
              name="cover"
              value={editedContributionInfo.cover}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="total" className="block text-sm font-medium text-gray-700">
              Total
            </label>
            <Input
              id="total"
              name="total"
              value={editedContributionInfo.total}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          {/* Checkbox for isActive */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={editedContributionInfo.isActive}
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

export default EditContributionInfoModal;
