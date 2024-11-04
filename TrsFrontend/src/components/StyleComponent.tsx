// import React, { useState, useContext, useEffect } from 'react';
// import { Button, useDisclosure } from '@nextui-org/react';
// import axios from '../api/axios';
// import toast from 'react-hot-toast';
// import StyleInfosTable from './StyleInfo/StyleInfosTable';
// import CreateStyleInfoModal from './StyleInfo/CreateStyleInfoModal';
// import EditStyleInfoModal from './StyleInfo/EditStyleInfoModal';
// import { StyleInfo,StyleInfoContext, StyleInfoContextType } from '../Context/StyleInfoContext';

// const StyleComponent: React.FC = () => {
//   const { isOpen: isCreateStyleOpen, onOpen: onOpenCreateStyle, onClose: onCloseCreateStyle } = useDisclosure();
//   const [isEditStyleOpen, setIsEditStyleOpen] = useState(false);
//   const [selectedStyleInfo, setSelectedStyleInfo] = useState<StyleInfo | null>(null);
//   const { styleInfos, setStyleInfos }: StyleInfoContextType = useContext(StyleInfoContext);

//   // Fetch data from the server
//   const fetchData = async () => {
//     try {
//       const response = await axios.get('/api/trs/styleinfo');
//       setStyleInfos(response.data);
//     } catch (error) {
//       console.error('Error fetching style info:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [setStyleInfos]);

//   // Handle create
//   const handleCreateStyleInfo = async (newStyleInfo: StyleInfo) => {
//     try {
//       await axios.post('/api/trs/styleinfo', newStyleInfo);
//       toast.success('Style info created successfully.');
//       fetchData();
//       onCloseCreateStyle();
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Error creating style info.');
//     }
//   };

  
//   const handleEditStyleInfo = async (updatedStyleInfo: StyleInfo) => {
//     try {
//       await axios.put(`/api/trs/styleinfo/${updatedStyleInfo.id}`, updatedStyleInfo);
//       toast.success('Style info updated successfully.');
//       fetchData();
//       setIsEditStyleOpen(false);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Error updating style info.');
//     }
//   };


//   const handleDeleteStyleInfo = async (id: number) => {
//     try {
//       await axios.delete(`/api/trs/styleinfo/${id}`);
//       toast.success('Style info deleted successfully.');
//       fetchData();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Error deleting style info.');
//     }
//   };

//   const openEditStyleModal = (styleInfo: StyleInfo) => {
//     setSelectedStyleInfo(styleInfo);
//     setIsEditStyleOpen(true);
//   };

//   const closeEditStyleModal = () => {
//     setSelectedStyleInfo(null);
//     setIsEditStyleOpen(false);
//   };

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8 mt-[60px]">
//         <h2 className="text-2xl font-bold mb-4">Style Information</h2>

//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold">Style Infos Table</h3>
//             <Button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               onPress={onOpenCreateStyle}
//             >
//               Create New Style Info
//             </Button>
//           </div>
//           <StyleInfosTable
//             styleInfos={styleInfos}
//             handleDeleteStyleInfo={handleDeleteStyleInfo}
//             handleEditStyleInfo={openEditStyleModal}
//           />
//         </div>
//       </div>

//       <CreateStyleInfoModal
//         isOpen={isCreateStyleOpen}
//         onClose={onCloseCreateStyle}
//         handleCreateStyleInfo={handleCreateStyleInfo}
//       />
//       {selectedStyleInfo && (
//         <EditStyleInfoModal
//           isOpen={isEditStyleOpen}
//           onClose={closeEditStyleModal}
//           handleEditStyleInfo={handleEditStyleInfo}
//           styleInfo={selectedStyleInfo}
//         />
//       )}
//     </>
//   );
// };

// export default StyleComponent;
