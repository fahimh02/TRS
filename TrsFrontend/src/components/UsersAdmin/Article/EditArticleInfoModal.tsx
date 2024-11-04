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

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleEditArticle: (article: any) => void;
  article: {
    id: number;
    name: string;
    length: number;
    isActive: boolean;  // Added isActive field to article
    created?: string;
    modified?: string;
    authorId?: number;
    editorId?: number;
  };
}

const EditArticleInfoModal: React.FC<EditArticleModalProps> = ({
  isOpen,
  onClose,
  handleEditArticle,
  article,
}) => {
  const [editedArticle, setEditedArticle] = useState({
    name: "",
    length: 0,
    isActive: false,  // Added isActive field to state
  });

  useEffect(() => {
    if (article) {
      setEditedArticle({
        name: article.name,
        length: article.length,
        isActive: article.isActive,  // Initialize isActive from article
      });
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedArticle((prevArticle) => ({
      ...prevArticle,
      [name]: type === "checkbox" ? checked : name === "length" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    handleEditArticle({
      ...article,
      ...editedArticle,
    
    });
    onClose();
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Edit Article</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="Article Name"
            placeholder="Article Name"
            variant="bordered"
            size="sm"
            name="name"
            value={editedArticle.name}
            onChange={handleChange}
            labelPlacement="outside"
          />
          <Input
            type="number"
            label="Length"
            placeholder="Length"
            variant="bordered"
            size="sm"
            name="length"
            value={editedArticle.length?.toString() || ""}
            onChange={handleChange}
            labelPlacement="outside"
          />
          
          {/* Checkbox field for isActive */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={editedArticle.isActive}  // Updated to use editedArticle state
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

export default EditArticleInfoModal;
