// import React, { useState, useEffect } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

// // Define the interface for StyleInfo
// interface StyleInfo {
//   id: number;
//   name: string;
//   description: string;
//   styleCode: string;
//   styleName: string;
//   styleNumber: string;
//   styleDescription: string;
//   thicknessFabric: string;
//   season: string;
//   buyerName: string;
//   size: string;
//   generalAllowance: string;
//   totalGarments: number;
//   created: string;
//   modified: string;
//   authorId: number;
//   editorId: number;
// }

// interface EditStyleInfoModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   handleEditStyleInfo: (styleInfo: StyleInfo) => void;
//   styleInfo: StyleInfo;
// }

// const EditStyleInfoModal: React.FC<EditStyleInfoModalProps> = ({
//   isOpen,
//   onClose,
//   handleEditStyleInfo,
//   styleInfo,
// }) => {
//   const [editedStyleInfo, setEditedStyleInfo] = useState<StyleInfo>(styleInfo);

//   useEffect(() => {
//     setEditedStyleInfo(styleInfo);
//   }, [styleInfo]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditedStyleInfo((prevInfo) => ({
//       ...prevInfo,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     handleEditStyleInfo(editedStyleInfo);
//     onClose();
//   };

//   return (
//     <Modal size="md" isOpen={isOpen} onClose={onClose}>
//       <ModalContent>
//         <ModalHeader className="flex flex-col gap-1">
//           Edit Style Information
//         </ModalHeader>
//         <ModalBody>
//           <Input
//             type="text"
//             label="Name"
//             placeholder="Name"
//             variant="bordered"
//             size="sm"
//             name="name"
//             value={editedStyleInfo.name}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Description"
//             placeholder="Description"
//             variant="bordered"
//             size="sm"
//             name="description"
//             value={editedStyleInfo.description}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Style Code"
//             placeholder="Style Code"
//             variant="bordered"
//             size="sm"
//             name="styleCode"
//             value={editedStyleInfo.styleCode}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Style Name"
//             placeholder="Style Name"
//             variant="bordered"
//             size="sm"
//             name="styleName"
//             value={editedStyleInfo.styleName}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Style Number"
//             placeholder="Style Number"
//             variant="bordered"
//             size="sm"
//             name="styleNumber"
//             value={editedStyleInfo.styleNumber}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Style Description"
//             placeholder="Style Description"
//             variant="bordered"
//             size="sm"
//             name="styleDescription"
//             value={editedStyleInfo.styleDescription}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Thickness Fabric"
//             placeholder="Thickness Fabric"
//             variant="bordered"
//             size="sm"
//             name="thicknessFabric"
//             value={editedStyleInfo.thicknessFabric}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Season"
//             placeholder="Season"
//             variant="bordered"
//             size="sm"
//             name="season"
//             value={editedStyleInfo.season}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Buyer Name"
//             placeholder="Buyer Name"
//             variant="bordered"
//             size="sm"
//             name="buyerName"
//             value={editedStyleInfo.buyerName}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Size"
//             placeholder="Size"
//             variant="bordered"
//             size="sm"
//             name="size"
//             value={editedStyleInfo.size}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="General Allowance"
//             placeholder="General Allowance"
//             variant="bordered"
//             size="sm"
//             name="generalAllowance"
//             value={editedStyleInfo.generalAllowance}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="number"
//             label="Total Garments"
//             placeholder="Total Garments"
//             variant="bordered"
//             size="sm"
//             name="totalGarments"
//             value={editedStyleInfo.totalGarments}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//         </ModalBody>
//         <ModalFooter>
//           <Button color="danger" variant="light" onPress={onClose}>
//             Close
//           </Button>
//           <Button className="bg-[#B3C300]" onPress={handleSubmit}>
//             <span className="text-white font-[500]">Save Changes</span>
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default EditStyleInfoModal;
