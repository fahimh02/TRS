


import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

interface StyleInfo {
  id?: number;
  styleCode?: string;
  styleName?: string;
  styleNumber?: string;
  styleDescription?: string;
  thicknessFabric?: number;
  season?: string;
  buyerName?: string;
  size?: string;
  generalAllowance?: number;
  totalGarments?: number;
  created?: string;
  modified?: string;
  authorId?: number;
  editorId?: number;
}

const StyleForm: React.FC<{ styleInfoId?: number }> = ({ styleInfoId }) => {
  const [formData, setFormData] = useState<StyleInfo>({
    styleCode: '',
    styleName: '',
    styleNumber: '',
    styleDescription: '',
    thicknessFabric: undefined,
    season: '',
    buyerName: '',
    size: '',
    generalAllowance: undefined,
    totalGarments: undefined,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (styleInfoId) {
      setIsLoading(true);
      const url = `/api/trs/styleinfo/${styleInfoId}`;
      axios.get<StyleInfo>(url)
        .then((response) => {
          setFormData(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [styleInfoId]);

  const validateForm = (): boolean => {
    if (!formData.styleCode || !formData.styleName || !formData.styleNumber) {
      setValidationError('Please fill out all required fields.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage(null);
    try {
      if (styleInfoId) {
        await axios.put(`/api/trs/styleinfo/${styleInfoId}`, formData);
      } else {
        await axios.post('/api/trs/styleinfo', formData);
      }
      setSuccessMessage('Style Info saved successfully');
      setFormData({
        styleCode: '',
        styleName: '',
        styleNumber: '',
        styleDescription: '',
        thicknessFabric: undefined,
        season: '',
        buyerName: '',
        size: '',
        generalAllowance: undefined,
        totalGarments: undefined,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); // Success message will disappear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gradient-to-r from-blue-200 to-blue-400 rounded-md shadow">
      <div className="container mx-auto p-4 border border-sky-500 rounded-md" style={{ borderWidth: '3px' }}>
        <div className="flex justify-center">
          <h1 className="text-xl font-bold mb-8">Style Information</h1>
        </div>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        {validationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{validationError}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Form fields */}
          <div className="flex flex-col">
            <label htmlFor="styleCode" className="text-lg text-black">Style Code</label>
            <input
              type="text"
              id="styleCode"
              name="styleCode"
              value={formData.styleCode || ''}
              onChange={(e) => setFormData({ ...formData, styleCode: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="styleName" className="text-lg text-black">Style Name</label>
            <input
              type="text"
              id="styleName"
              name="styleName"
              value={formData.styleName || ''}
              onChange={(e) => setFormData({ ...formData, styleName: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="thicknessFabric" className="text-lg text-black">Fabric Thickness (mm)</label>
            <input
              type="number"
              id="thicknessFabric"
              name="thicknessFabric"
              value={formData.thicknessFabric || ''}
              onChange={(e) => setFormData({ ...formData, thicknessFabric: parseFloat(e.target.value) })}
              step="any"
              min="0"
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="styleNumber" className="text-lg text-black">Style Number</label>
            <input
              type="text"
              id="styleNumber"
              name="styleNumber"
              value={formData.styleNumber || ''}
              onChange={(e) => setFormData({ ...formData, styleNumber: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="styleDescription" className="text-lg text-black">Style Description</label>
            <textarea
              id="styleDescription"
              name="styleDescription"
              value={formData.styleDescription || ''}
              onChange={(e) => setFormData({ ...formData, styleDescription: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="season" className="text-lg text-black">Season</label>
            <input
              type="text"
              id="season"
              name="season"
              value={formData.season || ''}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="buyerName" className="text-lg text-black">Buyer Name</label>
            <input
              type="text"
              id="buyerName"
              name="buyerName"
              value={formData.buyerName || ''}
              onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="size" className="text-lg text-black">Size</label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size || ''}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="generalAllowance" className="text-lg text-black">General Allowance (%)</label>
            <input
              type="number"
              id="generalAllowance"
              name="generalAllowance"
              value={formData.generalAllowance || ''}
              onChange={(e) => setFormData({ ...formData, generalAllowance: parseFloat(e.target.value) })}
              step="any"
              min="0"
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="totalGarments" className="text-lg text-black">Total Garments</label>
            <input
              type="number"
              id="totalGarments"
              name="totalGarments"
              value={formData.totalGarments || ''}
              onChange={(e) => setFormData({ ...formData, totalGarments: parseInt(e.target.value) })}
              step="1"
              min="0"
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default StyleForm;

