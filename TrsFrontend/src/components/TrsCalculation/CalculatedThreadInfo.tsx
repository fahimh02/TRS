// import { useEffect, useState } from 'react';
// import Jobinfo, { JobInfo } from './Interfaces/IJobInfo';
// import axios from '../../api/axios';
// import { useParams } from 'react-router-dom';
// import { StitchInfo } from '../../Context/UserAdminProvider';
// import { ContributionInfo } from '../../Context/ContributionInfoContext';
// import Swal from 'sweetalert2';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable'; 
// import Sidebar from '../Sidebar/Sideber';
// import PdfReport from '../PDF/PDFGenerator';

// interface CalculatedThreadInfo {
//   id: number;
//   threadNameType: string;
//   netConsumption: number;
//   sewingAllowance: number;
//   generalAllowance: number;
//   totalConsumption: number;
//   meterPerCone: string;
//   pricePerCone: number;
//   threadCosting: string;
//   totalCone: number;
// }

// interface StyleInfo {
//   id?: number;
//   styleCode?: string;
//   styleName?: string;
//   styleNumber?: string;
//   styleDescription?: string;
//   thicknessFabric: number;
//   season?: string;
//   buyerName?: string;
//   size?: string;
//   generalAllowance?: number;
//   totalGarments?: number;
//   created?: string;
//   modified?: string;
//   authorId?: number;
//   editorId?: number;
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

// interface CalculatedThreadInfoProps {
//   formData: any; 
// }


// const CalculatedThreadInfo: React.FC<CalculatedThreadInfoProps> = ({ formData }) => {
//   console.log("CalculatedThreadInfo", formData);
//   const { encryptedId } = useParams<{ encryptedId: string }>();
//   const [stitchInfos, setStitchInfos] = useState<StitchInfo[]>([]);
//   const [contributionInfos, setContributionInfos] = useState<ContributionInfo[]>([]);
//   const [showTable, setShowTable] = useState<boolean>(false);
//   const [uniqueThreadCombinations, setUniqueThreadCombinations] = useState<CalculatedThreadInfo[]>([]);
//   const [articleInfos, setArticleInfos] = useState<ArticleInfo[]>([]);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [storedData, SetStoredData] = useState<any>([]);
  

//   const [totalGarmentPcsValue, setTotalGarmentPcsValue] = useState<number>(formData?.totalGarments || 0);

//   useEffect(() => {
//     const fetchJobsByStyleId = async () => {
//       try {
//         const response = await axios.get(`/api/trs/stylemapperinfo/${encryptedId}`);
//         SetStoredData(response.data); 
//         setTotalGarmentPcsValue(response.data.style.totalGarments);
//       } catch (error) {
//         console.error("Error fetching style mapper info:", error);
//       }
//     };
    
//     if (encryptedId) {
//       fetchJobsByStyleId();
//     }
//   }, [encryptedId]);


//   useEffect(() => {
//     const fetchData = async () => {

//       try {
//         const [stitchResponse, articleResponse, contributionsResponse] = await Promise.all([
//           axios.get('/api/admin/stitchinfo'),
//           axios.get('/api/admin/articleinfo'),
//           axios.get('/api/admin/contribution'),
//         ]);
//         setStitchInfos(stitchResponse.data);
//         setArticleInfos(articleResponse.data);
//         setContributionInfos(contributionsResponse.data);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       } finally { /* empty */ }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     setTotalGarmentPcsValue(formData?.totalGarments || 0);
//   }, [formData]);


//   const calculateValuethick = (fabricThickness:number  , numberOfLayer:number ) => {
//     if(fabricThickness==undefined){
//       return 0;
//     }
//     if (numberOfLayer && numberOfLayer <= 2) {
//       const result = fabricThickness * 0.0393700787 * numberOfLayer;
//       console.log(result);
//       return result;
//       //return (parseFloat(fabricThickness.toString()) * 0.0393700787 * parseFloat(numberOfLayer.toString()));
//     } else if (numberOfLayer && numberOfLayer > 2) {
//       const result = fabricThickness * 0.0393700787 * (1 + (numberOfLayer - 1) * 0.9);
//       console.log(result);
//       return result;
//       //return parseFloat(fabricThickness.toString()) * 0.0393700787 * (1 + (parseFloat(numberOfLayer.toString()) - 1) * 0.9);
//      // return (parseFloat(fabricThickness.toString()) * 0.0393700787 * parseFloat(numberOfLayer.toString()));
//     } else {
//       return 0; 
//     }
//   };
//   const calculateStitchValue = (stitchType: string, thicknessValue: number, stitchCount: number, numOfLayer:number, valueThick: number): number => {

//     const resultValueThick =valueThick;// calculateValuethick(thicknessValue,numOfLayer);
//     if(resultValueThick==0){
//       return 0;
//     }
//     switch (stitchType) {
//       case '301':
//         return 1.8 + 2 * (resultValueThick * stitchCount);
//       case '304':
//         return (1.8 * stitchCount * (Math.sqrt((0.25 ** 2) + (1 / stitchCount) ** 2) + resultValueThick * 2));
//       case '401':
//         return 3.8 + 2 * (resultValueThick + 0.02) * stitchCount + 0.05 * stitchCount;
//       case '406':
//         return (6.8 + (2 * stitchCount * (2 * resultValueThick + 0.25)));
//       case '407':
//         return (8.5 + (2 * stitchCount * (3 * resultValueThick + 0.25)));
//       case '408':
//         return 8.5 + (4 * resultValueThick * stitchCount) + (0.5 * stitchCount);
//       case '503':
//         return (3 * (stitchCount * (0.25 + resultValueThick)) + 4.5);
//       case '504':
//         return 4 * (stitchCount * (0.25 + resultValueThick)) + 2;
//       case '514':
//         return 3 + 6 * resultValueThick * stitchCount + 4 * (0.25 * stitchCount);
//       case '516':
//         return calculateStitchValue('401', resultValueThick, stitchCount,numOfLayer,valueThick) + calculateStitchValue('504', resultValueThick, stitchCount,numOfLayer,valueThick);
//       case '602':
//         return 8.3 + (stitchCount * (5 * 0.25) + (4 * resultValueThick));  
//       case '605':
//         return 10.3 + (2 * (stitchCount * ((2 * 0.25) + (3 * resultValueThick))));
//       case '607':
//         return 16 + (4.3 * stitchCount * ((0.25) + (2.2 * resultValueThick)));
//       default:
//         return 0; 
//     }
//   };
//   const calculateNeedle_NT = (job: JobInfo, stitchValue: number, needleContribution: number) => {
//     return (job.seamLength * needleContribution * job.stitchRow * stitchValue * 2.54) / 100;
//   };
  
//   const calculateBobbin_NT = (job: JobInfo, stitchValue: number, bobbinContribution: number) => {
//     return (bobbinContribution * job.seamLength * job.stitchRow * stitchValue * 2.54) / 100;
//   };
  
//   const calculateCover_NT = (job: JobInfo, stitchValue: number, coverContribution: number) => {
//     return (coverContribution * job.seamLength * job.stitchRow * stitchValue * 2.54) / 100;
//   };
  
  
//   const calculateSewingAllowance_NT = (sewingAllowance: number,seamLength:number, needleNT: number) => {
//     return (sewingAllowance /seamLength) * needleNT;
//   };
//   const calculateSewingAllowance_BT = (sewingAllowance: number,seamLength:number, bobbinNT: number) => {
//     return (sewingAllowance /seamLength) * bobbinNT;
//   };
//   const calculateSewingAllowance_CT = (sewingAllowance: number,seamLength:number, coverNT: number) => {
//     return (sewingAllowance /seamLength) * coverNT;
//   };
  
  
//   const calculateTotalThreadNT = (sewingAllowance: number,needleNT: number) => {
//     return (sewingAllowance + needleNT);
//   };
//   const calculateTotalThreadBT = (sewingAllowance: number,bobbinNT: number) => {
//     return (sewingAllowance + bobbinNT);
//   };
//   const calculateTotalThreadCT = (sewingAllowance: number, coverNT: number) => {
//     return (sewingAllowance + coverNT);
//   };
  
//   const handleSaveandGenerate = () => {
//     let storedJobInfos = storedData.jobs;
//     let styledata = storedData.style;
    

//     if(formData==undefined){
//       storedJobInfos = storedData.jobs;
//       styledata = storedData.style;
//       //setUniqueThreadCombinations(storedData.calculatedInfos);
     
//     }else{

//       storedJobInfos =localStorage.getItem("jobInfos");
//       storedJobInfos= JSON.parse(storedJobInfos)
//       styledata = formData;
//       if(formData.thicknessFabric==0){
//         Swal.fire({
//           title: 'Validation!',
//           text: 'Please fill the Fabric Thickness(mm)',
//           icon: 'warning',
//           confirmButtonText: 'Ok',
//         });
//         return 0;
//       }
//       if(formData.totalGarments==0){
//         Swal.fire({
//           title: 'Validation!',
//           text: 'Please fill the Total garments',
//           icon: 'warning',
//           confirmButtonText: 'Ok',
//         });
//         return 0;
//       }
//     }
    
    


//     storedJobInfos.forEach((job: any) => {

//       const valuethick =  calculateValuethick(styledata.thicknessFabric, job.numberOfLayers);
//       const stitchValue = parseFloat(calculateStitchValue(job.stitchType, styledata.thicknessFabric, job.stitchCount, job.numberOfLayers,valuethick).toFixed(2));
//       const relatedStich  = stitchInfos.find(stitch => stitch.stitchType === job.stitchType);
//       const relatedContribution  = contributionInfos.find(contrib => contrib.stitchId === relatedStich.id);
//       const needleNT = calculateNeedle_NT(job,stitchValue, (relatedContribution.needle/100));
//       const BobbinNT = calculateBobbin_NT(job,stitchValue, (relatedContribution.bobbin/100));
//       const CoverNT = calculateCover_NT(job,stitchValue, (relatedContribution.cover/100));
//       const totalNT = needleNT+BobbinNT+CoverNT;
//       if(job.sewingAllowance== undefined){
//         job.sewingAllowance =relatedStich ? 2 : 0;
//       }
//       const sewingAllownceNT = calculateSewingAllowance_NT(job.sewingAllowance,job.seamLength,needleNT);
//       const sewingallowanceBT = calculateSewingAllowance_BT(job.sewingAllowance,job.seamLength,BobbinNT);
//       const sewingallowanceCT = calculateSewingAllowance_CT(job.sewingAllowance,job.seamLength,CoverNT);
//       const totalThreadNT = calculateTotalThreadNT(sewingAllownceNT,needleNT);
//       const totalThreadBT = calculateTotalThreadBT(sewingallowanceBT,BobbinNT);
//       const totalThreadCT = calculateTotalThreadCT(sewingallowanceCT,CoverNT);

//       job.needleNT = needleNT;
//       job.bobbinNT = BobbinNT;
//       job.coverNT = CoverNT;
//       job.totalNT = totalNT;
//       job.sewingAllownceNT = sewingAllownceNT;
//       job.sewingAllownceBT = sewingallowanceBT;
//       job.sewingAllownceCT = sewingallowanceCT;
//       job.sewingAllowanceTotal = sewingAllownceNT + sewingallowanceBT + sewingallowanceCT;
//       job.totalThreadNT = totalThreadNT;
//       job.totalThreadBT = totalThreadBT;
//       job.totalThreadCT = totalThreadCT;
//       job.totalThreadTotal = totalThreadNT + totalThreadBT + totalThreadCT;
//     });
//     const uniqueThreadsMap = new Map<string, CalculatedThreadInfo>();
    
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     storedJobInfos.forEach((data: any) => {

//       const threadInfos = [
//         { threadNameType: data.needleThreadName, id: data.id },
//         { threadNameType: data.bobbinThreadName, id: data.id },
//         { threadNameType: data.coverThreadName, id: data.id }
//       ];

//       threadInfos.forEach(threadInfo => {
//         if (threadInfo.threadNameType && !uniqueThreadsMap.has(threadInfo.threadNameType)) {
//           const matchingArticle = articleInfos.find(article => article.name === threadInfo.threadNameType);
//           const meterPerConeValue = matchingArticle ? matchingArticle.length.toString() : 'N/A';
//           //let pricePerConevalue = 0;
//          // const pricePerConeValue = storedData.calculatedInfos.find(cal => cal.name === threadInfo.threadNameType);
//          console.log(uniqueThreadCombinations);
//           // if(storedData.calculatedInfos.length>0){
//           //   const existingUniqueThread = storedData.calculatedInfos.find(cal => cal.threadNameType === threadInfo.threadNameType);
//           //   if(existingUniqueThread!= undefined){
//           //     pricePerConevalue = existingUniqueThread.pricePerCone;
//           //   }
//           // }

//           uniqueThreadsMap.set(threadInfo.threadNameType, {
//             id: threadInfo.id,
//             threadNameType: threadInfo.threadNameType,
//             netConsumption: calculateNetConsumption(storedJobInfos, threadInfo.threadNameType),
//             sewingAllowance: calculateSewingAllowance(storedJobInfos, threadInfo.threadNameType),
//             generalAllowance:calculateGeneralAllowance(storedJobInfos, threadInfo.threadNameType, styledata?.generalAllowance || 0),
//             totalConsumption: calculateTotalConsumption(storedJobInfos, threadInfo.threadNameType,calculateGeneralAllowance(storedJobInfos, threadInfo.threadNameType, styledata?.generalAllowance || 0)),
//             meterPerCone: meterPerConeValue,
//             pricePerCone: 0,
//             threadCosting: '0',
//             totalCone: 0
//           });
//         }
//       });
//     });
    

//     setUniqueThreadCombinations(Array.from(uniqueThreadsMap.values()));
//     setShowTable(true);
//   };

//   const calculateNetConsumption = (jobs: any, threadName: string) => {
//     let count = 0;
//     jobs.forEach((data: Jobinfo) => {
//       if (data["needleThreadName"] === threadName) {
//         count += data["needleNT"];
//       }
//       if (data["bobbinThreadName"] === threadName) {
//         count += data["bobbinNT"];
//       }
//       if (data["coverThreadName"] === threadName) {
//         count += data["coverNT"];
//       }
//     });
//     return count;
//   };

//   const calculateSewingAllowance = (jobs: any, threadName: string) => {
//     let count = 0;
//     jobs.forEach((data: Jobinfo) => {
//       if (data["needleThreadName"] === threadName) {
//         count += data["sewingAllownceNT"];
//       }
//       if (data["bobbinThreadName"] === threadName) {
//         count += data["sewingAllownceBT"];
//       }
//       if (data["coverThreadName"] === threadName) {
//         count += data["sewingAllownceCT"];
//       }
//     });
//     return count;
//   };

//   const calculateGeneralAllowance = (jobs: any, threadName: string, generalAllowance: number) => {
//     const netConsumption = calculateNetConsumption(jobs, threadName);
//     const sewingAllowance = calculateSewingAllowance(jobs, threadName);
//     if (generalAllowance != null && generalAllowance != undefined && generalAllowance !== 0) {
//       const percentage: number = (generalAllowance / 100);
//       const total: number = (sewingAllowance + netConsumption);
//       return parseFloat((total * percentage).toFixed(2));
//     } else {
//       return 0;
//     }
//   };

 
//   const calculateTotalConsumption = (jobs: any, threadName: string, generalAllowance: number) => {
//     const netConsumption = calculateNetConsumption(jobs, threadName);
//     const sewingAllowance = calculateSewingAllowance(jobs, threadName);
//     if (generalAllowance != null && generalAllowance != undefined && generalAllowance !== 0) {
//       const percentage: number = (generalAllowance);
//       const total: number = (sewingAllowance + netConsumption);
//       return parseFloat((total + percentage).toFixed(2));
//     } else {
//       return netConsumption + sewingAllowance;
//     }
//   };


//   const calculateThreadCosting = (meterPerCone: string, pricePerCone: number, totalConsumption: number) => {
//     const meterPerConeValue = parseFloat(meterPerCone);
//     const pricePerConeValue = parseFloat(pricePerCone.toString());
//     if (pricePerConeValue && meterPerConeValue && totalConsumption !== 0) {
//       const value = pricePerConeValue / meterPerConeValue;
//       return (value * totalConsumption).toFixed(3);
//     }
//     return '-';
//   };

//   const calculateTotalCone = (meterPerCone: string, totalConsumption: number) => {
//     const meterPerConeValue = parseFloat(meterPerCone);
//     if (meterPerConeValue && totalConsumption !== 0 && totalGarmentPcsValue !== 0) {
//       return Math.ceil((totalConsumption * totalGarmentPcsValue) / meterPerConeValue);
//     }
//     return 0;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const newPrice = parseFloat(e.target.value);

//     const updatedThreads = uniqueThreadCombinations.map((threadInfo, idx) => {
//       if (idx === index) {
//         return {
//           ...threadInfo,
//           pricePerCone: newPrice,
//           threadCosting: calculateThreadCosting(
//             threadInfo.meterPerCone,
//             newPrice,
//             threadInfo.totalConsumption
//           ),
//           totalCone: calculateTotalCone(
//             threadInfo.meterPerCone,
//             threadInfo.totalConsumption
//           )
//         };
//       }
//       return threadInfo;
//     });

//     setUniqueThreadCombinations(updatedThreads);
//   };

//   const getTotalSum = (key: keyof CalculatedThreadInfo) => {
//     return uniqueThreadCombinations.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0).toFixed(3);
//   };
//   // Main mapper function
//  const mapCombinedDataToPostData = (formData:StyleInfo,jobInfos:Jobinfo[],uniqueThreadCombinations: CalculatedThreadInfo[]) => {
//     const mapper = {
//       style: formData,
//       jobs: jobInfos,
//       calculatedInfos : uniqueThreadCombinations
//     };
//     return mapper;


//   // const styleInfoList: Partial<StyleInfo>[] = [];
//   // const jobInfoList: Partial<Jobinfo>[] = [];

//   // Object.values(combinedData.styles).forEach(({ styleInfo, jobs }) => {
//   //   if (styleInfo) {
//   //     styleInfoList.push(mapStyleInfo(styleInfo));
//   //   }
//   //   if (jobs) {
//   //     jobs.forEach((job) => jobInfoList.push(mapJobinfo(job)));
//   //   }
//   // });
// }

//   // return {
//   //   styleInfo: styleInfoList,
//   //   jobInfos: jobInfoList,
//   // };




//   // const handleSaveAndGenerateReport = async () => {
//   //   try {
      
  
//   //     // Post StyleInfo data
//   //    if(encryptedId!= null && encryptedId!=undefined && encryptedId!= "0"){
//   //     const storedJobInfos = storedData.jobs;
//   //     formData = storedData.style;
//   //     console.log(formData);
//   //     console.log(storedJobInfos);
//   //     console.log(uniqueThreadCombinations);
//   //     const combinedArray = mapCombinedDataToPostData(formData,storedJobInfos,uniqueThreadCombinations);
//   //     console.log("combinedArray",combinedArray);
//   //     //const response =  await axios.put('/api/trs/stylemapperinfo', storedData.style.id);
//   //     const response =  await axios.put(`/api/trs/stylemapperinfo/${storedData.style.id}`, combinedArray);
//   //     console.log(response);
//   //     Swal.fire({
//   //       title: 'Saved!',
//   //       text: 'Data has been updated',
//   //       icon: 'success',
//   //       confirmButtonText: 'Ok',
//   //     });
      

//   //    }else{
//   //     const storedJobInfos = JSON.parse(localStorage.getItem('jobInfos') || '[]');
//   //     console.log(formData);
//   //     console.log(storedJobInfos);
//   //     console.log(uniqueThreadCombinations);
//   //     const combinedArray = mapCombinedDataToPostData(formData,storedJobInfos,uniqueThreadCombinations);
//   //     console.log("combinedArray",combinedArray);
//   //     const response =  await axios.post('/api/trs/stylemapperinfo', combinedArray);
//   //     console.log(response);
//   //     Swal.fire({
//   //       title: 'Saved!',
//   //       text: 'Data posted successfully.',
//   //       icon: 'success',
//   //       confirmButtonText: 'Ok',
//   //     });
      
//   //    }
      
//   //     // Post JobInfo data
//   //     //await axios.post('/api/trs/jobinfo', postData.jobInfos);
  
//   //     console.log('Data posted successfully.');
//   //   } catch (error) {
//   //     console.error('Error posting data:', error);
//   //   }
//   // };
//   const handleSaveAndGenerateReportV2 = async () => {
//     try {
//       // Retrieve and map the data to post
//       let storedJobInfos = [];
//       if (encryptedId != null && encryptedId !== undefined && encryptedId !== "0") {
//         storedJobInfos = storedData.jobs;
//         formData = storedData.style;
//         console.log(formData);
//         console.log(storedJobInfos);
//         console.log(uniqueThreadCombinations);
//       } else {
//         storedJobInfos = JSON.parse(localStorage.getItem('jobInfos') || '[]');
//         console.log(formData);
//         console.log(storedJobInfos);
//         console.log(uniqueThreadCombinations);
//       }
  
//       const combinedArray = mapCombinedDataToPostData(formData, storedJobInfos, uniqueThreadCombinations);
//       console.log("combinedArray", combinedArray);
  
//       // Generate PDF preview
//       const doc = new jsPDF();
  
//       // Title of the PDF
//       doc.setFontSize(18);
//       doc.text("Data Report", 10, 10);
  
//       // Add Style Info to the PDF
//       doc.setFontSize(14);
//       doc.text("Style Info:", 10, 20);
//       doc.setFontSize(12);
//       Object.keys(formData).forEach((key, index) => {
//         doc.text(`${key}: ${formData[key]}`, 10, 30 + index * 10); 
//       });
  
//       // Add Job Info to the PDF
//       doc.setFontSize(14);
//       doc.text("Job Info:", 10, 40 + Object.keys(formData).length * 10);
//       storedJobInfos.forEach((job, index) => {
//         doc.text(`Job ${index + 1}:`, 10, 50 + Object.keys(formData).length * 10 + index * 10);
//         Object.keys(job).forEach((jobKey, jobIndex) => {
//           doc.text(`  ${jobKey}: ${job[jobKey]}`, 15, 60 + Object.keys(formData).length * 10 + index * 10 + jobIndex * 10);
//         });
//       });
  
//       // Add Calculated Infos to the PDF
//       doc.setFontSize(14);
//       doc.text("Calculated Thread Combinations:", 10, 100 + Object.keys(formData).length * 10);
//       uniqueThreadCombinations.forEach((threadInfo, index) => {
//         doc.text(`Thread Combination ${index + 1}: ${threadInfo}`, 10, 110 + Object.keys(formData).length * 10 + index * 10);
//       });
  
//       // Save the PDF
//       doc.save('report.pdf'); // Or use .output() to display as a preview in the browser
  
//     } catch (error) {
//       console.error('Error posting data:', error);
//     }
//   };
  


//   return (
//     <div className="flex">
//       {/* Sidebar */}
//     <div className="container mx-auto p-4">
//       <button
//         onClick={handleSaveandGenerate}
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//       >
//        Save and Generate
//       </button>

//       {showTable && (
//         <table className="min-w-full bg-white border border-black">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border">Thread Name Type</th>
//               <th className="px-4 py-2 border">Net Consumption (m)</th>
//               <th className="px-4 py-2 border">Sewing Allowance (m)</th>
//               <th className="px-4 py-2 border">General Allowance (m)</th>
//               <th className="px-4 py-2 border">Total Consumption (m)</th>
//               <th className="px-4 py-2 border">Meter/Cone</th>
//               <th className="px-4 py-2 border">Price/Cone (USD)</th>
//               <th className="px-4 py-2 border">Thread Costing/Garment (USD)</th>
//               <th className="px-4 py-2 border">Total Quantity (In Cone)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {uniqueThreadCombinations.map((threadInfo, index) => (
//               <tr key={index}>
//                 <td className="px-4 py-2 border">{threadInfo.threadNameType}</td>
//                 <td className="px-4 py-2 border">{threadInfo.netConsumption.toFixed(2)}</td>
//                 <td className="px-4 py-2 border">{threadInfo.sewingAllowance.toFixed(2)}</td>
//                 <td className="px-4 py-2 border">{threadInfo.generalAllowance}</td>
//                 <td className="px-4 py-2 border">{threadInfo.totalConsumption}</td>
//                 <td className="px-4 py-2 border">{threadInfo.meterPerCone}</td>
//                 <td className="px-4 py-2 border">
//                 <input
//                   type="text"
//                   value={threadInfo.pricePerCone}
//                   onChange={(e) => handleInputChange(e, index)} 
//                   className="border rounded px-2 py-1"
//                 />
//               </td>
//                 <td className="px-4 py-2 border">{threadInfo.threadCosting}</td>
//                 <td className="px-4 py-2 border">{threadInfo.totalCone}</td>
              


//               </tr>
//             ))}
//               <tr className="bg-gray-100 font-bold">
//               <td className="px-4 py-2 border">Total</td>
//               <td className="px-4 py-2 border">{getTotalSum('netConsumption')}</td>
//               <td className="px-4 py-2 border">{getTotalSum('sewingAllowance')}</td>
//               <td className="px-4 py-2 border">{getTotalSum('generalAllowance')}</td>
//               <td className="px-4 py-2 border">{getTotalSum('totalConsumption')}</td>
//               <td className="px-4 py-2 border" colSpan={2}></td>
//               <td className="px-4 py-2 border">{getTotalSum('threadCosting')}</td>
//               <td className="px-4 py-2 border">{getTotalSum('totalCone')}</td>
//             </tr>
//           </tbody>
//         </table>
//       )}
      
//       {/* <ReportButton 
//     array1={store} 
//     array2={uniqueThreadCombinations} 
//     objectData={storedJobInfos} 
//     imageData={dynamicImageData} 
// /> */}
//  <div className="container mx-auto p-4">
//       <button
//          onClick={handleSaveAndGenerateReportV2}
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//       >
//     Generate Report 
//       </button>
//       </div>
//       <div>
      
//     </div>
// </div>

//     </div>
//   );
// };

// export default CalculatedThreadInfo;
