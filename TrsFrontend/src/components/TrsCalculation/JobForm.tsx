// import React, { useState, useEffect } from 'react';
// import axios from "../../api/axios";

// interface JobInfo {
//   id?: number;
//   styleId?: number;
//   unitId?: number;
//   job?: string;
//   stitchType?: string;
//   stitchDescription?: string;
//   stitchCount?: number;
//   needleThreadName?: string;
//   bobbinThreadName?: string;
//   coverThreadName?: string;
//   seamLength?: number;
//   numberOfLayers?: number;
//   stitchRow?: number;
//   spi?: number;

//   // needleNetValue: number;
//   // needleSweingAllowanceValue: number;
//   // needleTotalValue: number;


//   // bobbinNetThread: number;
//   // needleNetThread: number;

// }

// interface StitchInfo {
//   id: number;
//   stitchType: string;
//   stitchName: string;
// }

// interface ArticleInfo {
//   id: number;
//   name: string;
//   length: number;
//   created: Date;
//   modified: Date;
//   authorId: number;
//   editorId: number;
// }

// const JobForm: React.FC = () => {
//   const [formData, setFormData] = useState<JobInfo>({
//     styleId: 0,
//     unitId: 0,
//     job: '',
//     stitchType: '',
//     stitchDescription: '',
//     stitchCount: 0,
//     needleThreadName: '',
//     bobbinThreadName: '',
//     coverThreadName: '',
//     seamLength: 0,
//     numberOfLayers: 0,
//     stitchRow: 0,
//     spi: 0
//   });

//   const [stitchInfos, setStitchInfos] = useState<StitchInfo[]>([]);
//   const [articleInfos, setArticleInfos] = useState<ArticleInfo[]>([]);
//   const [jobInfos, setJobInfos] = useState<JobInfo[]>(() => {
//     const savedJobInfos = localStorage.getItem('jobInfos');
//     return savedJobInfos ? JSON.parse(savedJobInfos) : [];
//   });
//   const [editingJobId, setEditingJobId] = useState<number | null>(null);
//   const [setLoading] = useState<boolean>(false);

//   useEffect(() => {

//     // const clearLocalStorage = () => {
//     //   localStorage.removeItem('jobInfos');
//     // };

//     // clearLocalStorage();
  
//       // Clear local storage on component mount
    
      

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const stitchResponse = await axios.get('/api/admin/stitchinfo');
//         const articleResponse = await axios.get('/api/admin/articleinfo');
        
//         setStitchInfos(stitchResponse.data);
//         setArticleInfos(articleResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('jobInfos', JSON.stringify(jobInfos));
//   }, [jobInfos]);

//   const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     setFormData((prevData) => {
//       const updatedData = {
//         ...prevData,
//         [name]: value
//       };

    
//       if (name === 'stitchType') {
//         const selectedStitch = stitchInfos.find(stitch => stitch.stitchType === value);
//         updatedData.stitchDescription = selectedStitch ? selectedStitch.stitchName : '';
//       }

//       return updatedData;
//     });
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: ['seamLength', 'numberOfLayers', 'stitchRow', 'spi'].includes(name) ? Number(value) : value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (editingJobId) {
//         setJobInfos((prevJobInfos) =>
//           prevJobInfos.map((job) =>
//             job.id === editingJobId ? { ...formData, id: editingJobId } : job
//           )
//         );
//         alert('Job Info updated successfully');
//       } else {
//         setJobInfos((prevJobInfos) => [
//           ...prevJobInfos,
//           { ...formData, id: Date.now() } 
//         ]);
//         alert('Job Info created successfully');
//       }
//       setFormData({
//         styleId: 0,
//         unitId: 0,
//         job: '',
//         stitchType: '',
//         stitchDescription: '',
//         stitchCount: 0,
//         needleThreadName: '',
//         bobbinThreadName: '',
//         coverThreadName: '',
//         seamLength: 0,
//         numberOfLayers: 0,
//         stitchRow: 0,
//         spi: 0 
//       });
//       setEditingJobId(null);
//     } catch (error) {
//       console.error('Error saving job info:', error);
//       alert('Error saving job info');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (job: JobInfo) => {
//     setFormData(job);
//     setEditingJobId(job.id ?? null);
//   };

//   const handleDelete = (jobId: number) => {
//     if (window.confirm('Are you sure you want to delete this job info?')) {
//       setLoading(true);
//       try {
//         setJobInfos((prevJobInfos) => prevJobInfos.filter((job) => job.id !== jobId));
//         alert('Job Info deleted successfully');
//       } catch (error) {
//         console.error('Error deleting job info:', error);
//         alert('Error deleting job info');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="p-4 bg-gradient-to-r from-blue-200 to-blue-400 rounded-md shadow">
//         <div className="container mx-auto p-4 border border-sky-500 rounded-md" style={{ borderWidth: '3px' }}>
//           <div className="flex justify-center">
//             <h1 className="text-xl font-bold mb-8">Job Information</h1>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//   {[
//     { label: 'Job', name: 'job', type: 'text', value: formData.job, required: true },
//     {
//       label: 'Stitch Type',
//       name: 'stitchType',
//       options: stitchInfos.map(stitch => ({ value: stitch.stitchType, text: `${stitch.stitchType} - ${stitch.stitchName}` })),
//       required: true,
//     },
//     {
//       label: 'Needle Thread Name',
//       name: 'needleThreadName',
//       options: articleInfos.map(article => ({ value: article.name, text: `${article.name} - ${article.length} cm` })),
//     },
//     {
//       label: 'Bobbin Thread Name',
//       name: 'bobbinThreadName',
//       options: articleInfos.map(article => ({ value: article.name, text: `${article.name} - ${article.length} cm` })),
//     },
//     {
//       label: 'Cover Thread Name',
//       name: 'coverThreadName',
//       options: articleInfos.map(article => ({ value: article.name, text: `${article.name} - ${article.length} cm` })),
//     },
//     { label: 'SPI', name: 'spi', type: 'number', value: formData.spi, required: true },
//     { label: 'Seam Length', name: 'seamLength', type: 'number', value: formData.seamLength },
//     { label: 'Number of Layers', name: 'numberOfLayers', type: 'number', value: formData.numberOfLayers },
//     { label: 'Stitch Row', name: 'stitchRow', type: 'number', value: formData.stitchRow },
//   ].map(({ label, name, type, value, options, required }) => (
//     <div key={name} className="flex flex-col mb-4">
//       <label htmlFor={name} className="mb-2 font-semibold text-lg text-black">{label}</label>
//       {options ? (
//         <select
//           id={name}
//           name={name}
//           value={formData[name as keyof JobInfo] || ''}
//           onChange={handleDropdownChange}
//           className="mt-1 p-2 border rounded-md w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           required={required}
//         >
//           <option value="">Select {label.toLowerCase()}</option>
//           {options.map(option => (
//             <option key={option.value} value={option.value}>
//               {option.text}
//             </option>
//           ))}
//         </select>
//       ) : (
//         <input
//           id={name}
//           name={name}
//           type={type || 'text'}
//           value={value || ''}
//           onChange={handleInputChange}
//           required={required}
//           className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//         />
//       )}
//     </div>
//   ))}
// </div>

//           <div className="flex justify-center space-x-4 mt-8">
//             <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
//               {editingJobId ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </div>
//       </form>

//       <div className="overflow-x-auto mt-4">
//       <table className="min-w-full bg-white border border-black">
//           <thead>
//             <tr>
//               {['Job', 'Stitch Type', 'Stitch Description', 'Needle Thread', 'Bobbin Thread', 'Cover Thread', 'Seam Length', 'Number of Layers', 'Stitch Row', 'SPI', 'Actions'].map(header => (
//                 <th key={header} className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="min-w-full bg-white border border-black">
//             {jobInfos.map(job => (
//               <tr key={job.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900">{job.job}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.stitchType}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.stitchDescription}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.needleThreadName}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.bobbinThreadName}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.coverThreadName}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.seamLength}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.numberOfLayers}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.stitchRow}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{job.spi}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     onClick={() => handleEdit(job)}
//                     className="text-blue-600 hover:text-blue-900 mr-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(job.id!)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div> 
//   );
// };

// export default JobForm;