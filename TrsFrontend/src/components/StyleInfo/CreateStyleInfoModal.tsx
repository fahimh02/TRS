// import React, { useState } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
// import { StyleInfo } from "../../Context/StyleInfoContext"; 

// interface CreateStyleInfoModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   handleCreateStyleInfo: (styleInfo: StyleInfo) => void;
// }

// const CreateStyleInfoModal: React.FC<CreateStyleInfoModalProps> = ({
//   isOpen,
//   onClose,
//   handleCreateStyleInfo,
// }) => {
//   const [newStyleInfo, setNewStyleInfo] = useState<StyleInfo>({
//     id: 0, 
//     styleCode: "",
//     styleName: "",
//     styleNumber: "",
//     styleDescription: "",
//     thicknessFabric: "",
//     season: "",
//     buyerName: "",
//     size: "",
//     generalAllowance: "",
//     totalGarments: 0,
//     created: new Date(),
//     modified: new Date(),
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewStyleInfo((prevInfo) => ({
//       ...prevInfo,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = () => {
//     handleCreateStyleInfo(newStyleInfo);
//     onClose();
//   };

//   return (
//     <Modal size="md" isOpen={isOpen} onClose={onClose}>
//       <ModalContent>
//         <ModalHeader>
//           <h2 className="text-xl font-semibold">Create New Style Info</h2>
//         </ModalHeader>
//         <ModalBody>
//           <Input
//             type="text"
//             label="Style Code"
//             placeholder="Style Code"
//             variant="bordered"
//             size="sm"
//             name="styleCode"
//             value={newStyleInfo.styleCode}
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
//             value={newStyleInfo.styleName}
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
//             value={newStyleInfo.styleNumber}
//             onChange={handleChange}
//             labelPlacement="outside"
//           />
//           <Input
//             type="text"
//             label="Description"
//             placeholder="Description"
//             variant="bordered"
//             size="sm"
//             name="styleDescription"
//             value={newStyleInfo.styleDescription}
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
//             value={newStyleInfo.thicknessFabric}
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
//             value={newStyleInfo.season}
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
//             value={newStyleInfo.buyerName}
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
//             value={newStyleInfo.size}
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
//             value={newStyleInfo.generalAllowance}
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
//             value={newStyleInfo.totalGarments}
//             onChange={(e) => handleChange({ ...e, target: { ...e.target, value: Number(e.target.value) } })} // Ensure the value is a number
//             labelPlacement="outside"
//           />
//         </ModalBody>
//         <ModalFooter>
//           <Button color="danger" variant="light" onPress={onClose}>
//             Close
//           </Button>
//           <Button className="bg-[#B3C300]" onPress={handleSubmit}>
//             <span className="text-white font-semibold">Create</span>
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CreateStyleInfoModal;
