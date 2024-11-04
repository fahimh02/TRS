// import React, { useState } from 'react';

//import CalculatedThreadInfo from '../../components/TrsCalculation/CalculatedThreadInfo'; 
import Form from '../../components/TrsCalculation/Form'; 

import './home.scss';

const Home: React.FC = () => {

  return (
    <div className="home-container">
   
      <div className="content">
        <div className="bg-gradient-to-r from-blue-200 to-blue-400 rounded-md shadow p-4">
          <h2 className="text-xl font-bold mb-8">Thread Requirement Calculation</h2>
          <div className="form-container mb-4">
            {/* Uncomment and use these components as needed */}
            {/* <StyleForm /> */}
          </div>
          <div className="form-container mb-4">
            {/* <JobForm /> */}
          </div>
          <div className="form-container mb-4">
            {/* <Form onFormDataChange={handleFormDataChange} /> */}
            <Form id={null} onBack={function (): void {
              throw new Error('Function not implemented.');
            } } ></Form>
          </div>
          {/* <div className="form-container mb-4">
            <CalculatedThreadInfo formData={formData} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
