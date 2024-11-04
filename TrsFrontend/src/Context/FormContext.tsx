import React, { createContext, useState, ReactNode } from 'react';

interface FormData {
  styleData: string;
  jobData: string;
}

interface FormContextType {
  formData: FormData;
  setStyleData: (data: string) => void;
  setJobData: (data: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({ styleData: '', jobData: '' });

  const setStyleData = (data: string) => {
    setFormData((prev) => ({ ...prev, styleData: data }));
  };

  const setJobData = (data: string) => {
    setFormData((prev) => ({ ...prev, jobData: data }));
  };

  return (
    <FormContext.Provider value={{ formData, setStyleData, setJobData }}>
      {children}
    </FormContext.Provider>
  );
};

const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { FormProvider, useFormContext };