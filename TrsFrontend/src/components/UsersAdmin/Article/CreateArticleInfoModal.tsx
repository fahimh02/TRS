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

interface CreateArticleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleCreateArticleInfo: (articleInfo: ArticleInfo) => void;
}

interface ArticleInfo {
  id?: number;
  name: string;
  length: number;
  created?: Date;
  modified?: Date;
  authorId?: number;
  editorId?: number;
  isActive: boolean;  
}


const initialArticleInfo: ArticleInfo = {
  name: "",
  length: 0,
  isActive: true,  
};

const CreateArticleInfoTable: React.FC<CreateArticleInfoModalProps> = ({
  isOpen,
  onClose,
  handleCreateArticleInfo,
}) => {
  const [newArticleInfo, setNewArticleInfo] = useState<ArticleInfo>(
    initialArticleInfo
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setNewArticleInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : name === "length" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    handleCreateArticleInfo(newArticleInfo);
    setNewArticleInfo(initialArticleInfo); 
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Create New Article Info</h2>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="Name"
            placeholder="Article Name"
            variant="bordered"
            size="sm"
            name="name"
            value={newArticleInfo.name}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="number"
            label="Length"
            placeholder="Article Length"
            variant="bordered"
            size="sm"
            name="length"
            value={String(newArticleInfo.length)}
            onChange={handleChange}
            labelPlacement="outside"
          />

          {/* Added Checkbox for Active */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={newArticleInfo.isActive}
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

export default CreateArticleInfoTable;
