import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../Context/AuthContext';
import Swal from 'sweetalert2';
import { StyleInfo } from './TrsCalculation/Interfaces/StyleInfo';
import ChartComponent from './TrsCalculation/Charts';
import Form from './TrsCalculation/Form'; // Import your Form component

const formatDate = (dateInput: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString(undefined, options);
};

const MyCalculations: React.FC = () => {
  const [styleInfos, setStyleInfos] = useState<StyleInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { auth } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null); // State to hold selected ID
  const [showForm, setShowForm] = useState(false); // State to control Form visibility

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<StyleInfo[]>('/api/trs/mystyleinfo/');
        setStyleInfos(response.data);
      } catch (error) {
        console.error('Error fetching style info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.isLoggedIn]);

  const openDetailsPage = (id: number) => {
    setSelectedId(id); // Set the selected ID
    setShowForm(true);  // Show the Form component
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`api/trs/styleinfo/${id}`);
          setStyleInfos((prev) => prev.filter((style) => style.id !== id)); // Remove the deleted style from the list
  
          Swal.fire(
            'Deleted!',
            'Your style has been deleted.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting style:', error);
          Swal.fire(
            'Error!',
            'There was an error deleting the style. Please try again.',
            'error'
          );
        }
      }
    });
  };

  const handleBack = () => {
    setShowForm(false); // Hide the form
    setSelectedId(null); // Reset the selected ID
  };

  return (
    <div className="flex justify-center">
      {showForm ? (
        <Form id={selectedId} onBack={handleBack} /> 
      ) : (
        <div className="flex-1 p-4 bg-gradient-to-r from-blue-300 to-gray-200 rounded-lg shadow-lg">
          <ChartComponent styleInfos={styleInfos} />
          <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Style Information</h2>
            {loading ? (
              <div className="text-center text-lg text-gray-600">Loading...</div>
            ) : (
              <div className="overflow-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
                      <th className="py-3 px-4 text-left">Details</th>
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Style Code</th>
                      <th className="py-3 px-4 text-left">Style Name</th>
                      <th className="py-3 px-4 text-left">Style Number</th>
                      <th className="py-3 px-4 text-left">Fabric Thickness</th>
                      <th className="py-3 px-4 text-left">Season</th>
                      <th className="py-3 px-4 text-left">Buyer Name</th>
                      <th className="py-3 px-4 text-left">Size</th>
                      <th className="py-3 px-4 text-left">General Allowance</th>
                      <th className="py-3 px-4 text-left">Total Garments</th>
                      <th className="py-3 px-4 text-left">Created</th>
                      <th className="py-3 px-4 text-left">Modified</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 text-sm font-medium">
                    {styleInfos.map((styleInfo) => (
                      <tr key={styleInfo.id} className="border-b hover:bg-gray-100 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openDetailsPage(styleInfo.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Details
                          </button>
                        </td>
                        <td className="py-3 px-4">{styleInfo.id}</td>
                        <td className="py-3 px-4">{styleInfo.styleCode}</td>
                        <td className="py-3 px-4">{styleInfo.styleName}</td>
                        <td className="py-3 px-4">{styleInfo.styleNumber}</td>
                        <td className="py-3 px-4">{styleInfo.thicknessFabric}</td>
                        <td className="py-3 px-4">{styleInfo.season}</td>
                        <td className="py-3 px-4">{styleInfo.buyerName}</td>
                        <td className="py-3 px-4">{styleInfo.size}</td>
                        <td className="py-3 px-4">{styleInfo.generalAllowance}</td>
                        <td className="py-3 px-4">{styleInfo.totalGarments}</td>
                        <td className="py-3 px-4">{formatDate(styleInfo.created)}</td>
                        <td className="py-3 px-4">{formatDate(styleInfo.modified)}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(styleInfo.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalculations;
