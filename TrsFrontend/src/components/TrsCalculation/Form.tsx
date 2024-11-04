/* eslint-disable react-hooks/rules-of-hooks */
// ========================
// Import Section
// ========================

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent, useContext } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import 'react-medium-image-zoom/dist/styles.css'
//import { useParams } from 'react-router-dom';
import { JobInfo } from './Interfaces/JobInfo';
import { StyleInfo } from './Interfaces/StyleInfo';
import { ContributionInfo } from './Interfaces/ContributionInfo';
import { StitchInfo } from './Interfaces/StitchInfo';
import { ArticleInfo } from './Interfaces/ArticleInfo';
import { CombinedData } from './Interfaces/Helper/CombinedData ';
import { CalculatedThreadInfo } from './Interfaces/CalculatedThreadInfo';
import PdfReport from '../PDF/PDFGenerator';
import Modal from 'react-modal';
import "./StyleForm.scss";
import TRSService from './TRSService'; 
import { UserContext, UserContextType } from '../../Context/UserProvider';
import avatar from '../../assets/image/3683641.png';

export interface FormProps {
  id: number | null; 
  onBack: () => void; 
}

const Form: React.FC<FormProps> = ({ id,onBack }) =>{
  const encryptedId = id ;//!== null ? 0 : null;

// ========================
// State Section
// ========================
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  //const { encryptedId } = useParams<{ encryptedId: string }>();
  const [contributionInfos, setContributionInfos] = useState<ContributionInfo[]>([]);
  const [stitchInfos, setStitchInfos] = useState<StitchInfo[]>([]);
  const [articleInfos, setArticleInfos] = useState<ArticleInfo[]>([]);
  const [jobInfos, setJobInfos] = useState<JobInfo[]>([]);
  const { user, setUser }: UserContextType = useContext(UserContext);
 
  // const encryptId = (id: number): string => {
  //   return btoa(id.toString()); // Example: Base64 encode (for demonstration purposes)
  // };

  
  const initialData: CombinedData = {
    style: {
      authorId: 0,
      buyerName: "",
      created: new Date(),
      editorId: 0,
      generalAllowance: 0,
      id: 0,
      modified: new Date(),
      season: "",
      size: "",
      styleCode: "",
      styleDescription: "",
      styleName: "",
      styleNumber: "",
      thicknessFabric: 0,
      totalGarments: 0,
      image: '',
    },
 
  
    jobs: [],
    images: [],
  };
  const [mappedData, setMappedData] = useState<CombinedData>(initialData);
  const [uniqueThreadCombinations, setUniqueThreadCombinations] = useState<CalculatedThreadInfo[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [images, setImages] = useState<{ imageUrl: string; styleId: number }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

// ========================
// Initialize Section
// ========================
  const [styleFormData, setStyleFormData] = useState<StyleInfo>({
    id:0,
    authorId: 0,
    buyerName: '',
    created: new Date(),
    editorId: 0,
    generalAllowance: 0,
    modified: new Date(),
    season: '',
    size: '',
    styleCode: '',
    styleDescription: '',
    styleName: '',
    styleNumber: '',
    thicknessFabric: 0,
    totalGarments: 0,
    image:''
  }
 
);
  const [jobFormData, setJobFormData] = useState<JobInfo>({
    authorId:0,
  bobbinNT: 0,
  bobbinThreadName: '',
  coverNT: 0,
  coverThreadName: '',
  //created: new Date(),
  editorId:0,
  id: 0,
  job: '',
  //modified: new Date(),
  needleNT: 0,
  needleThreadName: '',
  numberOfLayers: 0,
  seamLength: 0,
  sewingAllowance: 0,
  sewingAllownceBT: 0,
  sewingAllownceCT: 0,
  sewingAllownceNT: 0,
  sewingAllownceTotal: 0,
  stitchCount: 0,
  stitchDescription: '',
  stitchRow: 0,
  stitchType:'',
  styleId: 0,
  totalNT: 0,
  totalThreadBT: 0,
  totalThreadCT: 0,
  totalThreadNT: 0,
  totalThreadTotal: 0,
  unitId: 0
  });
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editingJobIndexId, setEditingJobIndexId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

 

// ========================
// Onload Section
// ========================
useEffect(() => {
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Endpoint para validar el token en tu backend
        const userinfo = await axios.get("/api/Users/current");

        setUser(userinfo.data);
      } catch (error) {
        localStorage.removeItem("token");
      }
    } else { /* empty */ }
  };

  
  validateToken();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  useEffect(() => {
    
    const fetchData = async () => {
      
      setLoading(true);
      try {
        const [stitchResponse, articleResponse, contributionsResponse] = await Promise.all([
          axios.get('/api/admin/stitchinfo'),
          axios.get('/api/admin/articleinfo'),
          axios.get('/api/admin/contribution'),
        ]);
        setIsDataLoaded(true); // Mark data as loaded
        setStitchInfos(stitchResponse.data);
        setArticleInfos(articleResponse.data);
        setContributionInfos(contributionsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  useEffect(() => {
    const fetchJobsByStyleId = async () => {
      try {
        if (encryptedId === null) {
          console.error('Encrypted ID is null. Cannot fetch style mapper info.');
          return; // or throw an error
        }else{
           //const response = await axios.get(`/api/trs/stylemapperinfo/${encryptedId}`);
        const response = await TRSService.fetchStyleMapperInfo(encryptedId);
        //SetStoredData(response.data);
        console.log("Before calculation ",response.data);
        const newMappedData:CombinedData = calculateData(response.data);
        
       setMappedData(newMappedData);
       setJobInfos(newMappedData.jobs);
       setStyleFormData(newMappedData.style);
       setImages(response.data.images);
        
        
          // Store in state
         
         
         console.log("After calculation ",newMappedData);
          
        }
       
       
        
      } catch (error) {
        console.error("Error fetching style mapper info:", error);
      }
    };
  
    if (isDataLoaded && encryptedId) {
      fetchJobsByStyleId();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoaded, encryptedId]);

// ========================
// Calculation Section
// ========================
  const calculateData = (mappedData: CombinedData) => {
    console.log("calculate :", mappedData);
  
    if (mappedData.jobs.length > 0) {
      mappedData.jobs = mappedData.jobs.map((job: JobInfo) => {
        const valuethick = calculateValuethick(mappedData.style.thicknessFabric, job.numberOfLayers);
        const stitchValue = parseFloat(calculateStitchValue(job.stitchType, mappedData.style.thicknessFabric, job.stitchCount, job.numberOfLayers, valuethick).toFixed(2));
        const relatedStich = stitchInfos.find(stitch => stitch.stitchType === job.stitchType) || null;
        const relatedContribution = contributionInfos.find(contrib => contrib.stitchId === relatedStich?.id);
  
        if (relatedContribution) {
          const needleNT = calculateNeedle_NT(job, stitchValue, (relatedContribution.needle / 100));
          const BobbinNT = calculateBobbin_NT(job, stitchValue, (relatedContribution.bobbin / 100));
          const CoverNT = calculateCover_NT(job, stitchValue, (relatedContribution.cover / 100));
          const totalNT = needleNT + BobbinNT + CoverNT;
  
          if (job.sewingAllowance === undefined) {
            job.sewingAllowance = relatedStich ? 2 : 0;
          }
  
          const sewingallowanceNT = calculateSewingAllowance_NT(job.sewingAllowance, job.seamLength, needleNT);
          const sewingallowanceBT = calculateSewingAllowance_BT(job.sewingAllowance, job.seamLength, BobbinNT);
          const sewingallowanceCT = calculateSewingAllowance_CT(job.sewingAllowance, job.seamLength, CoverNT);
          const totalThreadNT = calculateTotalThreadNT(sewingallowanceNT, needleNT);
          const totalThreadBT = calculateTotalThreadBT(sewingallowanceBT, BobbinNT);
          const totalThreadCT = calculateTotalThreadCT(sewingallowanceCT, CoverNT);
  
          return {
            ...job,
            needleNT: job.needleNT ?? needleNT, // Use existing value or calculated value
            bobbinNT: job.bobbinNT ?? BobbinNT,
            coverNT: job.coverNT ?? CoverNT,
            totalNT: job.totalNT ?? totalNT,
            sewingAllownceNT: job.sewingAllownceNT ?? sewingallowanceNT,
            sewingAllownceBT: job.sewingAllownceBT ?? sewingallowanceBT,
            sewingAllownceCT: job.sewingAllownceCT ?? sewingallowanceCT,
            sewingAllownceTotal: (job.sewingAllownceTotal ?? 0) + sewingallowanceNT + sewingallowanceBT + sewingallowanceCT,
            totalThreadNT: job.totalThreadNT ?? totalThreadNT,
            totalThreadBT: job.totalThreadBT ?? totalThreadBT,
            totalThreadCT: job.totalThreadCT ?? totalThreadCT,
            totalThreadTotal:  totalThreadCT + totalThreadBT + totalThreadNT,
          };
        } else {
          console.log("Contribution info missing");
          return job; 
        }
      });
    }
    const newMappedData: CombinedData = {
      style: mappedData.style, // Ensure this matches StyleInfo
      jobs: mappedData.jobs,   // Ensure this is an array of JobInfo
      images: mappedData.images, // Ensure this matches the Image interface
    };
  
    return newMappedData;
  };
  const calculateNetConsumption = (jobs: JobInfo[], threadName: string) => {
    let count = 0;
    jobs.forEach((data: JobInfo) => {
      if (data["needleThreadName"] === threadName) {
        count += data["needleNT"];
      }
      if (data["bobbinThreadName"] === threadName) {
        count += data["bobbinNT"];
      }
      if (data["coverThreadName"] === threadName) {
        count += data["coverNT"];
      }
    });
    return count;
  };
  const calculateSewingAllowance = (jobs: JobInfo[], threadName: string) => {
    let count = 0;
    jobs.forEach((data: JobInfo) => {
      if (data["needleThreadName"] === threadName) {
        count += data["sewingAllownceNT"];
      }
      if (data["bobbinThreadName"] === threadName) {
        count += data["sewingAllownceBT"];
      }
      if (data["coverThreadName"] === threadName) {
        count += data["sewingAllownceCT"];
      }
    });
    return count;
  };
  const calculateGeneralAllowance = (jobs: JobInfo[], threadName: string, generalAllowance: number) => {
    const netConsumption = calculateNetConsumption(jobs, threadName);
    const sewingAllowance = calculateSewingAllowance(jobs, threadName);
    if (generalAllowance != null && generalAllowance != undefined && generalAllowance !== 0) {
      const percentage: number = (generalAllowance / 100);
      const total: number = (sewingAllowance + netConsumption);
      return parseFloat((total * percentage).toFixed(2));
    } else {
      return 0;
    }
  };
  const calculateTotalConsumption = (jobs: JobInfo[], threadName: string, generalAllowance: number) => {
    const netConsumption = calculateNetConsumption(jobs, threadName);
    const sewingAllowance = calculateSewingAllowance(jobs, threadName);
    if (generalAllowance != null && generalAllowance != undefined && generalAllowance !== 0) {
      const percentage: number = (generalAllowance);
      const total: number = (sewingAllowance + netConsumption);
      return parseFloat((total + percentage).toFixed(2));
    } else {
      return netConsumption + sewingAllowance;
    }
  };
  const calculateThreadCosting = (meterPerCone: string, pricePerCone: number, totalConsumption: number) => {
    const meterPerConeValue = parseFloat(meterPerCone);
    const pricePerConeValue = parseFloat(pricePerCone.toString());
    if (pricePerConeValue && meterPerConeValue && totalConsumption !== 0) {
      const value = pricePerConeValue / meterPerConeValue;
      return (value * totalConsumption).toFixed(3);
    }
    return '-';
  };
  const calculateTotalCone = (meterPerCone: string, totalConsumption: number) => {
    const meterPerConeValue = parseFloat(meterPerCone);
    if (meterPerConeValue && totalConsumption !== 0 && styleFormData.totalGarments !== 0) {
      return Math.ceil((totalConsumption * styleFormData.totalGarments ) / meterPerConeValue);
    }
    return 0;
  };
  const calculateValuethick = (fabricThickness:number  , numberOfLayer:number ) => {
    if(fabricThickness==undefined){
      return 0;
    }
    if (numberOfLayer && numberOfLayer <= 2) {
      const result = fabricThickness * 0.0393700787 * numberOfLayer;
      console.log(result);
      return result;
      //return (parseFloat(fabricThickness.toString()) * 0.0393700787 * parseFloat(numberOfLayer.toString()));
    } else if (numberOfLayer && numberOfLayer > 2) {
      const result = fabricThickness * 0.0393700787 * (1 + (numberOfLayer - 1) * 0.9);
      console.log(result);
      return result;
      //return parseFloat(fabricThickness.toString()) * 0.0393700787 * (1 + (parseFloat(numberOfLayer.toString()) - 1) * 0.9);
     // return (parseFloat(fabricThickness.toString()) * 0.0393700787 * parseFloat(numberOfLayer.toString()));
    } else {
      return 0; 
    }
  };
 const calculateStitchValue = (stitchType: string, _thicknessValue: number, stitchCount: number, numOfLayer:number, valueThick: number): number => {

    const resultValueThick =valueThick;// calculateValuethick(thicknessValue,numOfLayer);
    if(resultValueThick==0){
      return 0;
    }
    switch (stitchType) {
      case '301':
        return 1.8 + 2 * (resultValueThick * stitchCount);
      case '304':
        return (1.8 * stitchCount * (Math.sqrt((0.25 ** 2) + (1 / stitchCount) ** 2) + resultValueThick * 2));
      case '401':
        return 3.8 + 2 * (resultValueThick + 0.02) * stitchCount + 0.05 * stitchCount;
      case '406':
        return (6.8 + (2 * stitchCount * (2 * resultValueThick + 0.25)));
      case '407':
        return (8.5 + (2 * stitchCount * (3 * resultValueThick + 0.25)));
      case '408':
        return 8.5 + (4 * resultValueThick * stitchCount) + (0.5 * stitchCount);
      case '503':
        return (3 * (stitchCount * (0.25 + resultValueThick)) + 4.5);
      case '504':
        return 4 * (stitchCount * (0.25 + resultValueThick)) + 2;
      case '514':
        return 3 + 6 * resultValueThick * stitchCount + 4 * (0.25 * stitchCount);
      case '516':
        return calculateStitchValue('401', resultValueThick, stitchCount,numOfLayer,valueThick) + calculateStitchValue('504', resultValueThick, stitchCount,numOfLayer,valueThick);
      case '602':
        return 8.3 + (stitchCount * (5 * 0.25) + (4 * resultValueThick));  
      case '605':
        return 10.3 + (2 * (stitchCount * ((2 * 0.25) + (3 * resultValueThick))));
      case '607':
        return 16 + (4.3 * stitchCount * ((0.25) + (2.2 * resultValueThick)));
      default:
        return 0; 
    }
  };
  const calculateNeedle_NT = (job: JobInfo, stitchValue: number, needleContribution: number) => {
    return (job.seamLength * needleContribution * job.stitchRow * stitchValue * 2.54) / 100;
  };
  const calculateBobbin_NT = (job: JobInfo, stitchValue: number, bobbinContribution: number) => {
    return (bobbinContribution * job.seamLength * job.stitchRow * stitchValue * 2.54) / 100;
  };
  const calculateCover_NT = (job: JobInfo, stitchValue: number, coverContribution: number) => {
    return (coverContribution * job.seamLength * job.stitchRow * stitchValue * 2.54) / 100;
  };
  const calculateSewingAllowance_NT = (sewingAllowance: number,seamLength:number, needleNT: number) => {
    return (sewingAllowance /seamLength) * needleNT;
  };
  const calculateSewingAllowance_BT = (sewingAllowance: number,seamLength:number, bobbinNT: number) => {
    return (sewingAllowance /seamLength) * bobbinNT;
  };
  const calculateSewingAllowance_CT = (sewingAllowance: number,seamLength:number, coverNT: number) => {
    return (sewingAllowance /seamLength) * coverNT;
  };
  const calculateTotalThreadNT = (sewingAllowance: number,needleNT: number) => {
    return (sewingAllowance + needleNT);
  };
  const calculateTotalThreadBT = (sewingAllowance: number,bobbinNT: number) => {
    return (sewingAllowance + bobbinNT);
  };
  const calculateTotalThreadCT = (sewingAllowance: number, coverNT: number) => {
    return (sewingAllowance + coverNT);
  };
  const getTotalSum = (key: keyof CalculatedThreadInfo) => {
    return uniqueThreadCombinations
      .reduce((sum, item) => sum + (parseFloat(String(item[key])) || 0), 0)
      .toFixed(3);
  };
  
// ========================
// Onclick Section
// ========================
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value
      };
      if (name === 'stitchType') {
        const selectedStitch = stitchInfos.find(stitch => stitch.stitchType === value);
        
        updatedData.stitchDescription = selectedStitch ? selectedStitch.stitchName : '';
        updatedData.sewingAllowance = selectedStitch ? 2 : 0;
      }
      return updatedData;
    });
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setJobFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) : value
    }));
  };
  const handlePricePerConeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim(); // Trim whitespace
    const newPrice = value ? parseFloat(value) : 0; // Default to 0 if empty

    const updatedThreads = uniqueThreadCombinations.map((threadInfo, idx) => {
      if (idx === index) {
        return {
          ...threadInfo,
          pricePerCone: newPrice,
          threadCosting: calculateThreadCosting(
            threadInfo.meterPerCone,
            newPrice,
            threadInfo.totalConsumption
          ),
          totalCone: calculateTotalCone(
            threadInfo.meterPerCone,
            threadInfo.totalConsumption
          )
        };
      }
      return threadInfo;
    });

    setUniqueThreadCombinations(updatedThreads);
  };
  const handleFabricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueNum = parseFloat(e.target.value);
    setStyleFormData({ ...styleFormData, thicknessFabric: valueNum });
    
    // const newMappedData:CombinedData = calculateDataV2(STY);
    // setMappedData(newMappedData);
    // setJobInfos(newMappedData.jobs);
    //setStyleFormData(newMappedData.style);
     
    console.log(styleFormData);
  };
  const handleGeneralAllownceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueNum = parseFloat(e.target.value);
    setStyleFormData({ ...styleFormData, generalAllowance: valueNum });
    console.log(styleFormData);

  };
  const handleTotalGarmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueNum = parseFloat(e.target.value);
    setStyleFormData({ ...styleFormData, totalGarments: valueNum });
    console.log(styleFormData);
   // onFormDataChange(styleFormData);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!validateForm()) return; // Validate form data
  
    setLoading(true); 
    console.log("Index",editingJobIndexId);
  
    try {
      if (editingJobId !== null) {
        
        setJobFormData((prevData) => ({
          ...prevData,
          jobFormData
        }));
  
        const valuethick = calculateValuethick(styleFormData.thicknessFabric, jobFormData.numberOfLayers);
const stitchValue = parseFloat(calculateStitchValue(jobFormData.stitchType, styleFormData.thicknessFabric, jobFormData.stitchCount, jobFormData.numberOfLayers, valuethick).toFixed(2));

// Find related stitch
const relatedStich = stitchInfos.find(stitch => stitch.stitchType === jobFormData.stitchType) || null;

// Check if relatedStich is found
if (!relatedStich) {
  throw new Error(`No stitch found for type: ${jobFormData.stitchType}`);
}

// Find related contribution
const relatedContribution = contributionInfos.find(contrib => contrib.stitchId === relatedStich.id);

// Check if relatedContribution is found
if (!relatedContribution) {
  throw new Error(`No contribution found for stitch ID: ${relatedStich.id}`);
}

// Calculate values using optional chaining to handle potential undefined values
const needleNT = calculateNeedle_NT(jobFormData, stitchValue, (relatedContribution.needle ?? 0) / 100);
const BobbinNT = calculateBobbin_NT(jobFormData, stitchValue, (relatedContribution.bobbin ?? 0) / 100);
const CoverNT = calculateCover_NT(jobFormData, stitchValue, (relatedContribution.cover ?? 0) / 100);

        const totalNT = needleNT + BobbinNT + CoverNT;
  
        if (jobFormData.sewingAllowance === undefined) {
          jobFormData.sewingAllowance = relatedStich ? 2 : 0;
        }
  
        const sewingallowanceNT = calculateSewingAllowance_NT(jobFormData.sewingAllowance, jobFormData.seamLength, needleNT);
        const sewingallowanceBT = calculateSewingAllowance_BT(jobFormData.sewingAllowance, jobFormData.seamLength, BobbinNT);
        const sewingallowanceCT = calculateSewingAllowance_CT(jobFormData.sewingAllowance, jobFormData.seamLength, CoverNT);
        
        const totalThreadNT = calculateTotalThreadNT(sewingallowanceNT, needleNT);
        const totalThreadBT = calculateTotalThreadBT(sewingallowanceBT, BobbinNT);
        const totalThreadCT = calculateTotalThreadCT(sewingallowanceCT, CoverNT);
        setJobInfos((prevJobInfos) =>
          prevJobInfos?.map((job, index) => {
            if (job.id === editingJobId && index==editingJobIndexId) {
              // Optionally, you can check the index here if needed
              console.log(`Editing Job at index: ${index}`); // Debugging line
              return {
                ...job,
                ...jobFormData,
                id: editingJobId,
                needleNT,
                bobbinNT: BobbinNT,
                coverNT: CoverNT,
                totalNT,
                sewingAllownceNT: sewingallowanceNT,
                sewingAllownceBT: sewingallowanceBT,
                sewingAllownceCT: sewingallowanceCT,
                sewingAllownceTotal: sewingallowanceNT + sewingallowanceBT + sewingallowanceCT,
                totalThreadNT,
                totalThreadBT,
                totalThreadCT,
                totalThreadTotal: totalThreadCT + totalThreadBT + totalThreadNT,
              };
            }
            return job; // Return the job unchanged if it doesn't match
          })
        );
  
        // setJobInfos((prevJobInfos) =>
        //   prevJobInfos?.map((job) =>
        //     job.id === editingJobId
        //       ? {
        //           ...job,
        //           ...jobFormData,
        //           id: editingJobId,
        //           needleNT,
        //           bobbinNT: BobbinNT,
        //           coverNT: CoverNT,
        //           totalNT,
        //           sewingAllownceNT: sewingallowanceNT,
        //           sewingAllownceBT: sewingallowanceBT,
        //           sewingAllownceCT: sewingallowanceCT,
        //           sewingAllownceTotal: sewingallowanceNT + sewingallowanceBT + sewingallowanceCT,
        //           totalThreadNT,
        //           totalThreadBT,
        //           totalThreadCT,
        //           totalThreadTotal: totalThreadCT + totalThreadBT + totalThreadNT
        //         }
        //       : job
        //   )
        // );
  
        
        Swal.fire({
          title: 'Success',
          text: 'Job Info updated successfully',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      } else {
        // Create new job entry
        const valuethick = calculateValuethick(styleFormData.thicknessFabric, jobFormData.numberOfLayers);
const stitchValue = parseFloat(calculateStitchValue(jobFormData.stitchType, styleFormData.thicknessFabric, jobFormData.stitchCount, jobFormData.numberOfLayers, valuethick).toFixed(2));

// Find related stitch
const relatedStich = stitchInfos.find(stitch => stitch.stitchType === jobFormData.stitchType);

// Check if relatedStich exists
if (!relatedStich) {
  throw new Error(`No stitch found for type: ${jobFormData.stitchType}`);
}

// Find related contribution
const relatedContribution = contributionInfos.find(contrib => contrib.stitchId === relatedStich.id);

// Check if relatedContribution exists
if (!relatedContribution) {
  throw new Error(`No contribution found for stitch ID: ${relatedStich.id}`);
}

// Calculate values
const needleNT = calculateNeedle_NT(jobFormData, stitchValue, (relatedContribution.needle / 100));
const BobbinNT = calculateBobbin_NT(jobFormData, stitchValue, (relatedContribution.bobbin / 100));
const CoverNT = calculateCover_NT(jobFormData, stitchValue, (relatedContribution.cover / 100));

        const totalNT = needleNT + BobbinNT + CoverNT;
  
        if (jobFormData.sewingAllowance === undefined) {
          jobFormData.sewingAllowance = relatedStich ? 2 : 0;
        }
  
        const sewingallowanceNT = calculateSewingAllowance_NT(jobFormData.sewingAllowance, jobFormData.seamLength, needleNT);
        const sewingallowanceBT = calculateSewingAllowance_BT(jobFormData.sewingAllowance, jobFormData.seamLength, BobbinNT);
        const sewingallowanceCT = calculateSewingAllowance_CT(jobFormData.sewingAllowance, jobFormData.seamLength, CoverNT);
        
        const totalThreadNT = calculateTotalThreadNT(sewingallowanceNT, needleNT);
        const totalThreadBT = calculateTotalThreadBT(sewingallowanceBT, BobbinNT);
        const totalThreadCT = calculateTotalThreadCT(sewingallowanceCT, CoverNT);
        const newJobInfo: JobInfo = {
          ...jobFormData,
          id:0,
          needleNT,
          bobbinNT: BobbinNT,
          coverNT: CoverNT,
          totalNT,
          sewingAllownceNT: sewingallowanceNT,
          sewingAllownceBT: sewingallowanceBT,
          sewingAllownceCT: sewingallowanceCT,
          sewingAllownceTotal: sewingallowanceNT + sewingallowanceBT + sewingallowanceCT,
          totalThreadNT,
          totalThreadBT,
          totalThreadCT,
          totalThreadTotal: totalThreadCT + totalThreadBT + totalThreadNT
      };
      jobInfos?.push(newJobInfo);

      setJobInfos(jobInfos);
  
        // setJobInfos((prevJobInfos = []) => [
        //   ...prevJobInfos,
        //   {
        //     ...jobFormData, // Spread jobFormData to include its properties
        //     id: 0, // Create a new job with a unique ID
        //     needleNT,
        //     bobbinNT: BobbinNT,
        //     coverNT: CoverNT,
        //     totalNT,
        //     sewingAllownceNT: sewingallowanceNT,
        //     sewingAllownceBT: sewingallowanceBT,
        //     sewingAllownceCT: sewingallowanceCT,
        //     sewingAllownceTotal: sewingallowanceNT + sewingallowanceBT + sewingallowanceCT,
        //     totalThreadNT,
        //     totalThreadBT,
        //     totalThreadCT,
        //     totalThreadTotal: totalThreadCT + totalThreadBT + totalThreadNT
        //   }
        // ]);
  
        //alert('Job Info created successfully');
        Swal.fire({
          title: 'Success',
          text: 'Job Info created successfully',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      }
  
      // Reset the form after submission
      resetForm();
    } catch (error) {
      console.error('Error saving job info:', error);
      alert('Error saving job info');
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  const handleEdit = (job: JobInfo,idx:number) => {

    setJobFormData(job); 
   setEditingJobId(job.id);
    setEditingJobIndexId(idx);
    setShowTable(false);
  };
  const handleDelete = (jobId: number, index: number) => {
    console.log(jobId);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          setJobInfos((prevJobInfos) => {
            const updatedJobInfos = [...prevJobInfos];
            updatedJobInfos.splice(index, 1); // Remove item at the specified index
            return updatedJobInfos;
          });
          Swal.fire('Deleted!', 'Job Info deleted successfully.', 'success');
        } catch (error) {
          console.error('Error deleting job info:', error);
          Swal.fire('Error!', 'Error deleting job info', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };
  // const handleDelete = (jobId: number,idx:number) => {
  //   if (window.confirm('Are you sure you want to delete this job info?')) {
  //     setLoading(true);
  //     try {
  //       setJobInfos((prevJobInfos) => prevJobInfos.filter((job) => job.id !== jobId));
  //       alert('Job Info deleted successfully');
  //     } catch (error) {
  //       console.error('Error deleting job info:', error);
  //       alert('Error deleting job info');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // This is a FileList
    const imageInfos = [...images]; // Create a copy of the current images state
    
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result;
  
          // Check if imageUrl is a string before pushing to imageInfos
          if (typeof imageUrl === 'string') {
            imageInfos.push({
              imageUrl, // The image URL or base64 string
              styleId: styleFormData.id, // Use the StyleId from your styleFormData
            });
          }
  
          // If all files have been processed, update the state
          if (imageInfos.length === files.length) {
            setImages(imageInfos); // Store array of image info objects
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleSaveandGenerate = async () => {
    // eslint-disable-next-line prefer-const
    let storedJobInfos: JobInfo[] = jobInfos || [];
    // eslint-disable-next-line prefer-const
    let styledata = styleFormData;
    const newMappedData: CombinedData = {
      style: styleFormData, // Ensure this matches StyleInfo
      jobs: jobInfos || [],   // Ensure this is an array of JobInfo
      images: images , // Ensure this matches the Image interface
    };
    setMappedData(newMappedData);
    console.log(newMappedData);
    console.log(mappedData);
    if(styleFormData.thicknessFabric==0){
      Swal.fire({
        title: 'Validation!',
        text: 'Please fill the Fabric Thickness(mm)',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return 0;
    }
    if(styleFormData.totalGarments==0){
      Swal.fire({
        title: 'Validation!',
        text: 'Please fill the Total garments',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return 0;
    }

    storedJobInfos.forEach((job: JobInfo) => {

      const valuethick = calculateValuethick(styledata.thicknessFabric, job.numberOfLayers);
      const stitchValue = parseFloat(calculateStitchValue(job.stitchType, styledata.thicknessFabric, job.stitchCount, job.numberOfLayers, valuethick).toFixed(2));
      
      // Find related stitch
      const relatedStich = stitchInfos.find(stitch => stitch.stitchType === job.stitchType);
      
      // Check if relatedStich is found
      if (!relatedStich) {
        throw new Error(`No stitch found for type: ${job.stitchType}`);
      }
      
      // Find related contribution
      const relatedContribution = contributionInfos.find(contrib => contrib.stitchId === relatedStich.id);
      
      // Check if relatedContribution is found
      if (!relatedContribution) {
        throw new Error(`No contribution found for stitch ID: ${relatedStich.id}`);
      }
      
      // Calculate values
      const needleNT = calculateNeedle_NT(job, stitchValue, (relatedContribution.needle ?? 0) / 100);
      const BobbinNT = calculateBobbin_NT(job, stitchValue, (relatedContribution.bobbin ?? 0) / 100);
      const CoverNT = calculateCover_NT(job, stitchValue, (relatedContribution.cover ?? 0) / 100);
      
      const totalNT = needleNT+BobbinNT+CoverNT;
      if(job.sewingAllowance== undefined){
        job.sewingAllowance =relatedStich ? 2 : 0;
      }
      const sewingAllownceNT = calculateSewingAllowance_NT(job.sewingAllowance,job.seamLength,needleNT);
      const sewingallowanceBT = calculateSewingAllowance_BT(job.sewingAllowance,job.seamLength,BobbinNT);
      const sewingallowanceCT = calculateSewingAllowance_CT(job.sewingAllowance,job.seamLength,CoverNT);
      const totalThreadNT = calculateTotalThreadNT(sewingAllownceNT,needleNT);
      const totalThreadBT = calculateTotalThreadBT(sewingallowanceBT,BobbinNT);
      const totalThreadCT = calculateTotalThreadCT(sewingallowanceCT,CoverNT);

      job.needleNT = needleNT;
      job.bobbinNT = BobbinNT;
      job.coverNT = CoverNT;
      job.totalNT = totalNT;
      job.sewingAllownceNT = sewingAllownceNT;
      job.sewingAllownceBT = sewingallowanceBT;
      job.sewingAllownceCT = sewingallowanceCT;
      job.sewingAllownceTotal = sewingAllownceNT + sewingallowanceBT + sewingallowanceCT;
      job.totalThreadNT = totalThreadNT;
      job.totalThreadBT = totalThreadBT;
      job.totalThreadCT = totalThreadCT;
      job.totalThreadTotal = totalThreadNT + totalThreadBT + totalThreadCT;
    });
    const uniqueThreadsMap = new Map<string, CalculatedThreadInfo>();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storedJobInfos.forEach((data: any) => {

      const threadInfos = [
        { threadNameType: data.needleThreadName, id: data.id },
        { threadNameType: data.bobbinThreadName, id: data.id },
        { threadNameType: data.coverThreadName, id: data.id }
      ];

      threadInfos.forEach(threadInfo => {
        if (threadInfo.threadNameType && !uniqueThreadsMap.has(threadInfo.threadNameType)) {
          const matchingArticle = articleInfos.find(article => article.name === threadInfo.threadNameType);
          const meterPerConeValue = matchingArticle ? matchingArticle.length.toString() : 'N/A';
          //let pricePerConevalue = 0;
         // const pricePerConeValue = storedData.calculatedInfos.find(cal => cal.name === threadInfo.threadNameType);
         console.log(uniqueThreadCombinations);
          // if(storedData.calculatedInfos.length>0){
          //   const existingUniqueThread = storedData.calculatedInfos.find(cal => cal.threadNameType === threadInfo.threadNameType);
          //   if(existingUniqueThread!= undefined){
          //     pricePerConevalue = existingUniqueThread.pricePerCone;
          //   }
          // }

          uniqueThreadsMap.set(threadInfo.threadNameType, {
            id: threadInfo.id,
            threadNameType: threadInfo.threadNameType,
            netConsumption: calculateNetConsumption(storedJobInfos, threadInfo.threadNameType),
            sewingAllowance: calculateSewingAllowance(storedJobInfos, threadInfo.threadNameType),
            generalAllowance:calculateGeneralAllowance(storedJobInfos, threadInfo.threadNameType, styledata?.generalAllowance || 0),
            totalConsumption: calculateTotalConsumption(storedJobInfos, threadInfo.threadNameType,calculateGeneralAllowance(storedJobInfos, threadInfo.threadNameType, styledata?.generalAllowance || 0)),
            meterPerCone: meterPerConeValue,
            pricePerCone: 0,
            threadCosting: '0',
            totalCone: 0
          });
          console.log(uniqueThreadsMap);
        }
      });
    });
    setUniqueThreadCombinations(Array.from(uniqueThreadsMap.values()));
    if(newMappedData.style.id==0){
      // const response =  await axios.post('/api/trs/stylemapperinfo', newMappedData);
      const response = await TRSService.saveStyleMapperInfo(newMappedData);
      console.log(response);
      Swal.fire({
        title: 'Saved!',
        text: 'Data posted successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
      });

    }else{
      
      //const response =  await axios.put(`/api/trs/stylemapperinfo/${newMappedData.style.id}`, newMappedData);
      const response = await TRSService.updateStyleMapperInfo(newMappedData.style.id, newMappedData);
      console.log(response);
      Swal.fire({
        title: 'Saved!',
        text: 'Data updated successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
      });


    }

    
    
    setShowTable(true);
  };
  const handleGenerate = async () => {
    // eslint-disable-next-line prefer-const
    let storedJobInfos: JobInfo[] = jobInfos || [];
    // eslint-disable-next-line prefer-const
    let styledata = styleFormData;
    const newMappedData: CombinedData = {
      style: styleFormData, // Ensure this matches StyleInfo
      jobs: jobInfos || [],   // Ensure this is an array of JobInfo
      images: images , // Ensure this matches the Image interface
    };
    setMappedData(newMappedData);
    console.log(newMappedData);
    console.log(mappedData);
    if(styleFormData.thicknessFabric==0){
      Swal.fire({
        title: 'Validation!',
        text: 'Please fill the Fabric Thickness(mm)',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return 0;
    }
    if(styleFormData.totalGarments==0){
      Swal.fire({
        title: 'Validation!',
        text: 'Please fill the Total garments',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return 0;
    }

    storedJobInfos.forEach((job: JobInfo) => {

      const valuethick = calculateValuethick(styledata.thicknessFabric, job.numberOfLayers);
      const stitchValue = parseFloat(calculateStitchValue(job.stitchType, styledata.thicknessFabric, job.stitchCount, job.numberOfLayers, valuethick).toFixed(2));
      
      const relatedStich = stitchInfos.find(stitch => stitch.stitchType === job.stitchType);
      const relatedContribution = relatedStich ? contributionInfos.find(contrib => contrib.stitchId === relatedStich.id) : null;
      
      // Check if relatedStich and relatedContribution are defined before using their properties
      const needleNT = relatedContribution ? calculateNeedle_NT(job, stitchValue, (relatedContribution.needle / 100)) : 0;
      const BobbinNT = relatedContribution ? calculateBobbin_NT(job, stitchValue, (relatedContribution.bobbin / 100)) : 0;
      const CoverNT = relatedContribution ? calculateCover_NT(job, stitchValue, (relatedContribution.cover / 100)) : 0;
      
      const totalNT = needleNT+BobbinNT+CoverNT;
      if(job.sewingAllowance== undefined){
        job.sewingAllowance =relatedStich ? 2 : 0;
      }
      const sewingAllownceNT = calculateSewingAllowance_NT(job.sewingAllowance,job.seamLength,needleNT);
      const sewingallowanceBT = calculateSewingAllowance_BT(job.sewingAllowance,job.seamLength,BobbinNT);
      const sewingallowanceCT = calculateSewingAllowance_CT(job.sewingAllowance,job.seamLength,CoverNT);
      const totalThreadNT = calculateTotalThreadNT(sewingAllownceNT,needleNT);
      const totalThreadBT = calculateTotalThreadBT(sewingallowanceBT,BobbinNT);
      const totalThreadCT = calculateTotalThreadCT(sewingallowanceCT,CoverNT);

      job.needleNT = needleNT;
      job.bobbinNT = BobbinNT;
      job.coverNT = CoverNT;
      job.totalNT = totalNT;
      job.sewingAllownceNT = sewingAllownceNT;
      job.sewingAllownceBT = sewingallowanceBT;
      job.sewingAllownceCT = sewingallowanceCT;
      job.sewingAllownceTotal = sewingAllownceNT + sewingallowanceBT + sewingallowanceCT;
      job.totalThreadNT = totalThreadNT;
      job.totalThreadBT = totalThreadBT;
      job.totalThreadCT = totalThreadCT;
      job.totalThreadTotal = totalThreadNT + totalThreadBT + totalThreadCT;
    });
    const uniqueThreadsMap = new Map<string, CalculatedThreadInfo>();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storedJobInfos.forEach((data: any) => {

      const threadInfos = [
        { threadNameType: data.needleThreadName, id: data.id },
        { threadNameType: data.bobbinThreadName, id: data.id },
        { threadNameType: data.coverThreadName, id: data.id }
      ];

      threadInfos.forEach(threadInfo => {
        if (threadInfo.threadNameType && !uniqueThreadsMap.has(threadInfo.threadNameType)) {
          const matchingArticle = articleInfos.find(article => article.name === threadInfo.threadNameType);
          const meterPerConeValue = matchingArticle ? matchingArticle.length.toString() : 'N/A';
          //let pricePerConevalue = 0;
         // const pricePerConeValue = storedData.calculatedInfos.find(cal => cal.name === threadInfo.threadNameType);
         console.log(uniqueThreadCombinations);
          // if(storedData.calculatedInfos.length>0){
          //   const existingUniqueThread = storedData.calculatedInfos.find(cal => cal.threadNameType === threadInfo.threadNameType);
          //   if(existingUniqueThread!= undefined){
          //     pricePerConevalue = existingUniqueThread.pricePerCone;
          //   }
          // }

          uniqueThreadsMap.set(threadInfo.threadNameType, {
            id: threadInfo.id,
            threadNameType: threadInfo.threadNameType,
            netConsumption: calculateNetConsumption(storedJobInfos, threadInfo.threadNameType),
            sewingAllowance: calculateSewingAllowance(storedJobInfos, threadInfo.threadNameType),
            generalAllowance:calculateGeneralAllowance(storedJobInfos, threadInfo.threadNameType, styledata?.generalAllowance || 0),
            totalConsumption: calculateTotalConsumption(storedJobInfos, threadInfo.threadNameType,calculateGeneralAllowance(storedJobInfos, threadInfo.threadNameType, styledata?.generalAllowance || 0)),
            meterPerCone: meterPerConeValue,
            pricePerCone: 0,
            threadCosting: '0',
            totalCone: 0
          });
          console.log(uniqueThreadsMap);
        }
      });
    });
    setUniqueThreadCombinations(Array.from(uniqueThreadsMap.values()));


    
    
    setShowTable(true);
  };

// ========================
// Validation Section
// ========================
  const validateForm = (): boolean => {
    const { generalAllowance, totalGarments, thicknessFabric } = styleFormData;
    const isValid = 
      generalAllowance !== undefined &&
      totalGarments !== undefined &&
      thicknessFabric !== undefined;
  
    if (!isValid) {
      alert('Please fill out all required fields.');
      return false;
    }
  
    return true;
  };
  const resetForm = () => {
  
  //    setStyleFormData({
  //     styleCode: '',
  //     styleName: '',
  //     styleNumber: '',
  //     styleDescription: '',
  //   thicknessFabric: undefined, 
  //     season: '',
  //     buyerName: '',
  //     size: '',
  //  generalAllowance: undefined, 
  //   totalGarments: undefined, 
  //    });
  
    setJobFormData({
      authorId:0,
      bobbinNT: 0,
      bobbinThreadName: '',
      coverNT: 0,
      coverThreadName: '',
      //created: new Date(),
      editorId:0,
      id: 0,
      job: '',
     // modified: new Date(),
      needleNT: 0,
      needleThreadName: '',
      numberOfLayers: 0,
      seamLength: 0,
      sewingAllowance: 0,
      sewingAllownceBT: 0,
      sewingAllownceCT: 0,
      sewingAllownceNT: 0,
      sewingAllownceTotal: 0,
      stitchCount: 0,
      stitchDescription: '',
      stitchRow: 0,
      stitchType:'',
      styleId: 0,
      totalNT: 0,
      totalThreadBT: 0,
      totalThreadCT: 0,
      totalThreadNT: 0,
      totalThreadTotal: 0,
      unitId: 0
    });
    setEditingJobId(null);
  };

// ========================
// Modal Section
// ========================
  const openModal = (index: React.SetStateAction<number>) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const handleImageDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
     // onDelete(index); // Call the delete function passed as a prop
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };
    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent the default form submission
    onBack(); // Call the onBack function
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<form onSubmit={handleSubmit} className="p-4 bg-gradient-to-r  from-blue-200  to-blue-300  rounded-md shadow justify-center">
  <div className="container mx-auto p-4 border border-sky-500 rounded-md" style={{ borderWidth: '3px' }}>
  <h1 className="text-xl font-bold flex-grow text-center">Style Information</h1> 
    {/* Flex container to align button and heading */}
    <div className="flex justify-between items-center mb-8">
      {id !== null && (
        <button
          onClick={handleBackClick} // Use the handleBackClick function
          className="flex items-center mr-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          <img
            src={avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-2" // Adjust size as needed
          />
          Go Back
        </button>
      )}
   
    </div>




        <div className="flex flex-col mb-4">
          <label htmlFor="imagePicker" className="text-lg text-black">Upload Images</label>
          <input
            type="file"
            id="imagePicker"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 mb-2 p-2 border rounded-md" />
          <div>
            {images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {images.map((image, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      alt={`Preview ${index + 1}`}
                      src={image.imageUrl}
                      width="100"
                      style={{
                        objectFit: 'cover',
                        borderRadius: '8px',
                        transition: 'transform 0.3s',
                        cursor: 'pointer',
                      }}
                      onClick={() => openModal(index)}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                    <button
                      onClick={() => handleImageDelete(index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        padding: '5px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: 'rgba(255, 0, 0, 0.8)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.8)')}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              contentLabel="Image Zoom"
              style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                content: { textAlign: 'center' },
              }}
            >
              <img
                src={images[currentImageIndex]?.imageUrl}
                alt="Zoomed"
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
              <div>
                <button className="modal-button" onClick={goToPrevious}>Previous</button>
                <button className="modal-button" onClick={goToNext}>Next</button>
                <button className="modal-button" onClick={closeModal}>Close</button>
              </div>
            </Modal>
          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <label htmlFor="styleCode" className="text-lg text-black">Style Code</label>
            <input
              type="text"
              id="styleCode"
              name="styleCode"
              value={styleFormData.styleCode}
              onChange={(e) => setStyleFormData({ ...styleFormData, styleCode: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="styleName" className="text-lg text-black">Style Name</label>
            <input
              type="text"
              id="styleName"
              name="styleName"
              value={styleFormData.styleName}
              onChange={(e) => setStyleFormData({ ...styleFormData, styleName: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="thicknessFabric" className="text-lg text-black">Fabric Thickness (mm) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="thicknessFabric"
              name="thicknessFabric"
              value={styleFormData.thicknessFabric}
              onChange={handleFabricChange}
              step="any"
              min="0"
              className="mt-1 p-2 border rounded-md w-full"
              required />
          </div>

          <div className="flex flex-col">
            <label htmlFor="styleNumber" className="text-lg text-black">Style Number</label>
            <input
              type="text"
              id="styleNumber"
              name="styleNumber"
              value={styleFormData.styleNumber}
              onChange={(e) => setStyleFormData({ ...styleFormData, styleNumber: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="styleDescription" className="text-lg text-black">Style Description</label>
            <textarea
              id="styleDescription"
              name="styleDescription"
              value={styleFormData.styleDescription}
              onChange={(e) => setStyleFormData({ ...styleFormData, styleDescription: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="buyerName" className="text-lg text-black">Buyer Name</label>
            <input
              type="text"
              id="buyerName"
              name="buyerName"
              value={styleFormData.buyerName}
              onChange={(e) => setStyleFormData({ ...styleFormData, buyerName: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="season" className="text-lg text-black">Season</label>
            <input
              type="text"
              id="season"
              name="season"
              value={styleFormData.season}
              onChange={(e) => setStyleFormData({ ...styleFormData, season: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="size" className="text-lg text-black">Size</label>
            <input
              type="text"
              id="size"
              name="size"
              value={styleFormData.size}
              onChange={(e) => setStyleFormData({ ...styleFormData, size: e.target.value })}
              className="mt-1 p-2 border rounded-md w-full" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="generalAllowance" className="text-lg text-black">General Allowance (%) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="generalAllowance"
              name="generalAllowance"
              value={styleFormData.generalAllowance}
              // onChange={(e) => setStyleFormData({ ...styleFormData, generalAllowance: parseFloat(e.target.value) })}
              onChange={handleGeneralAllownceChange}
              step="any"
              min="0"
              className="mt-1 p-2 border rounded-md w-full"
              required />
          </div>

          <div className="flex flex-col">
            <label htmlFor="totalGarments" className="text-lg text-black">Total Garments <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="totalGarments"
              name="totalGarments"
              value={styleFormData.totalGarments}
              onChange={handleTotalGarmentChange}
              step="1"
              min="0"
              className="mt-1 p-2 border rounded-md w-full"
              required />
          </div>
        </div>

      </div>
      <div>
        <div className="p-4 bg-gradient-to-r from-blue-200 to-blue-400 rounded-md shadow">
          <div className="container mx-auto p-4 border border-sky-500 rounded-md" style={{ borderWidth: '3px' }}>
            <div className="flex justify-center">
              <h1 className="text-xl font-bold mb-8">Job Information</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Job', name: 'job', type: 'text', value: jobFormData.job, required: true },
                {
                  label: 'Stitch Type',
                  name: 'stitchType',
                  options: stitchInfos.map(stitch => ({ value: stitch.stitchType, text: `${stitch.stitchType} - ${stitch.stitchName}` })),
                  required: true,
                },


                {
                  label: 'Needle Thread Name',
                  name: 'needleThreadName',
                  options: articleInfos.map(article => ({ value: article.name, text: `${article.name} - ${article.length} m` })),
                },

                {
                  label: 'Bobbin Thread Name',
                  name: 'bobbinThreadName',
                  options: articleInfos.map(article => ({ value: article.name, text: `${article.name} - ${article.length} m` })),
                },
                {
                  label: 'Cover Thread Name',
                  name: 'coverThreadName',
                  options: articleInfos.map(article => ({ value: article.name, text: `${article.name} - ${article.length} m` })),
                },
                { label: 'Stitch per inch', name: 'stitchCount', type: 'number', value: jobFormData.stitchCount, required: true },
                { label: 'Seam Length(Inch)', name: 'seamLength', type: 'number', value: jobFormData.seamLength },
                { label: 'Number of Layers', name: 'numberOfLayers', type: 'number', value: jobFormData.numberOfLayers },
                { label: 'Stitch Row', name: 'stitchRow', type: 'number', value: jobFormData.stitchRow },
              ].map(({ label, name, type, value, options, required }) => (
                <div key={name} className="flex flex-col mb-4">
                  <label htmlFor={name} className="mb-2 font-semibold text-lg text-black">{label}</label>
                  {options ? (
                    <select
                      id={name}
                      name={name}
                      value={jobFormData[name as keyof JobInfo]}
                      onChange={handleDropdownChange}
                      className="mt-1 p-2 border w-full px-3 py-2 bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required={required}
                    >
                      <option value="">Select {label.toLowerCase()}</option>
                      {options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={name}
                      name={name}
                      type={type || 'text'}
                      value={value || ''}
                      onChange={handleInputChange}
                      required={required}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  )}
                </div>

              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {editingJobId ? 'Update' : 'Add'}
        </button>
      </div>
      <div className="overflow-x-auto mt-4">
      <div className="max-w-7xl mx-auto overflow-x-auto">
  <table className="min-w-full bg-white border border-black">
    <thead>
    <tr>
    <th colSpan={8} className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase tracking-wider border border-black">Job Details</th>
      
      <th colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase tracking-wider border border-black">
        Net Thread (M)
      </th>
      <th colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase tracking-wider border border-black">
        Sewing Allowance (M)
      </th>
      <th colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase tracking-wider border border-black">
        Total Thread (M)
      </th>
    </tr>
      <tr>
        {[
          'Job',
          'Stitch Type',
          'Stitch Description',
          'Seam Length',
          'Number of Layers',
          'Stitch Row',
          'Stitch Count',
          // 'Thickness Fabric',
          // 'General Allowance',
          // 'Total Garments',
          'Sewing Allowance(Inch)',
          'NT',
          'BT/LT',
          'CT',
          'Total',
          'NT',
          'BT/LT',
          'CT',
          'Total',
          'NT',
          'BT/LT',
          'CT',
          'Total',
          'Needle Thread',
          'Bobbin Thread',
          'Cover Thread',
          'Actions'
        ].map((header) => (
          <th
            key={header}
            className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase tracking-wider border border-black"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="min-w-full bg-white border border-black">
    {jobInfos?.map((job,index) => (
              <tr key={job.id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900">
            {job.job}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.stitchType}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.stitchDescription}
          </td>
         
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.seamLength}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.numberOfLayers}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.stitchRow}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.stitchCount}
          </td>
          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {styleFormData.thicknessFabric}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {styleFormData.generalAllowance}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {styleFormData.totalGarments}
          </td> */}
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.sewingAllowance}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.needleNT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.bobbinNT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.coverNT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.totalNT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.sewingAllownceNT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.sewingAllownceBT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.sewingAllownceCT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.sewingAllownceTotal.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.totalThreadNT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.totalThreadBT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.totalThreadCT.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {job.totalThreadTotal.toFixed(3)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.needleThreadName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.bobbinThreadName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
            {job.coverThreadName}
          </td>



                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                  //   onClick={(e) => {
                  //     e.preventDefault(); // Prevents the form from submitting
                  //     handleEdit(job);
                  //   } 
                  // }
                  onClick={(e) => {
                    e.preventDefault(); // Prevents the form from submitting
                    handleEdit(job, index); // Pass job and index to handleEdit
                  }}

                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    
                    onClick={(e) => {
                      e.preventDefault(); // Prevents the form from submitting
                      handleDelete(job.id!,index);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
</div>
  
        {user && (<div className="container mx-auto p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSaveandGenerate();
            } }
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Save and Generate
          </button>


        </div>)}
        {!user && (<div className="container mx-auto p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleGenerate();
            } }
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Generate
          </button>


        </div>)}



        {showTable && (
          <table className="min-w-full bg-white border border-black">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Thread Name Type</th>
                <th className="px-4 py-2 border">Net Consumption (m)</th>
                <th className="px-4 py-2 border">Sewing Allowance (m)</th>
                <th className="px-4 py-2 border">General Allowance (m)</th>
                <th className="px-4 py-2 border">Total Consumption (m)</th>
                <th className="px-4 py-2 border">Meter/Cone</th>
                <th className="px-4 py-2 border">Price/Cone (USD)</th>
                <th className="px-4 py-2 border">Thread Costing/Garment (USD)</th>
                <th className="px-4 py-2 border">Total Quantity (In Cone)</th>
              </tr>
            </thead>
            <tbody>
              {uniqueThreadCombinations.map((threadInfo, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{threadInfo.threadNameType}</td>
                  <td className="px-4 py-2 border">{threadInfo.netConsumption.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{threadInfo.sewingAllowance.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{threadInfo.generalAllowance.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{threadInfo.totalConsumption.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{threadInfo.meterPerCone}</td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={threadInfo.pricePerCone}
                      onChange={(e) => handlePricePerConeChange(e, index)}
                      className="border rounded px-2 py-1" />
                  </td>
                  <td className="px-4 py-2 border">{threadInfo.threadCosting}</td>
                  <td className="px-4 py-2 border">{threadInfo.totalCone}</td>



                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="px-4 py-2 border">Total</td>
                <td className="px-4 py-2 border">{getTotalSum('netConsumption')}</td>
                <td className="px-4 py-2 border">{getTotalSum('sewingAllowance')}</td>
                <td className="px-4 py-2 border">{getTotalSum('generalAllowance')}</td>
                <td className="px-4 py-2 border">{getTotalSum('totalConsumption')}</td>
                <td className="px-4 py-2 border" colSpan={2}></td>
                <td className="px-4 py-2 border">{getTotalSum('threadCosting')}</td>
                <td className="px-4 py-2 border">{getTotalSum('totalCone')}</td>
              </tr>
            </tbody>
          </table>
        )}
        {showTable &&(<div className="container mx-auto p-4">
          <PdfReport combinedData={mappedData} uniqueThreadCombinations={uniqueThreadCombinations} />
        </div>)}

      </div>
    </form>
    
    
    
  );
};

export default Form;
