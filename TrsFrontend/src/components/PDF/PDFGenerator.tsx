/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import "jspdf-autotable"; 
import amannLogo from "../../assets/image/AMANN LOGO.jpg";
//import { Image } from "../../components/TrsCalculation/Interfaces/Image";
// Import CombinedData from its respective file
import { CombinedData } from '../../components/TrsCalculation/Interfaces/Helper/CombinedData '; // Adjust the path as necessary

declare module "jspdf" {
  interface jsPDF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable: any; // You can specify a more detailed type if needed
  }
}

interface ThreadCombination {
  threadNameType: string;
  netConsumption: number;
  totalConsumption: number;
  generalAllowance: number;
  sewingAllowance:number;
}

interface PdfReportProps {
  combinedData: CombinedData; // Use the imported CombinedData interface
  uniqueThreadCombinations: ThreadCombination[];
}

const PdfReport: React.FC<PdfReportProps> = ({ combinedData, uniqueThreadCombinations }) => {
  const [applicationText, setApplicationText] = useState(""); // State to capture text input
  // const generatePDF = () => {
  //   const doc = new jsPDF("landscape");
  
  //   // Add headline
  //   doc.setFontSize(22);
  //   doc.text("Thread Consumption Software", doc.internal.pageSize.getWidth() / 2, 20, {
  //     align: "center"
  //   });
  
  //   // Add logo in the top right corner
  //   const logoUrl = amannLogo;
  //   if (logoUrl) {
  //     doc.addImage(logoUrl, "JPEG", doc.internal.pageSize.getWidth() - 40, 10, 30, 30);
  //   }
  
  //   // Adjusted position for images to be a bit higher
  //   const imgTopOffset = 5; // Adjust this value to position images higher
  //   const imgWidth = 80; // Adjust width as necessary
  //   const imgHeight = 50; // Adjust height as necessary
  //   const imgStartYPosition = 50 + imgTopOffset; // Start a bit higher than before
  //   const maxImagesPerRow = 4; // Maximum images per row
  //   const imgMargin = 10; // Margin between images
  
  //   // Add images from combinedData.images
  //   const styleImages: Image[] = combinedData.images; // Adjust to the actual path if needed
  
  //   if (styleImages.length > 0) {
  //     styleImages.forEach((image, index) => {
  //       const imageUrl = image.imageUrl; // Adjust this to the correct property for the image URL
  //       if (imageUrl) {
  //         const xPosition = 20 + (index % maxImagesPerRow) * (imgWidth + imgMargin); // Calculate x position
  //         const yPosition = imgStartYPosition + Math.floor(index / maxImagesPerRow) * (imgHeight + imgMargin); // Calculate y position
  //         doc.addImage(imageUrl, "JPEG", xPosition, yPosition, imgWidth, imgHeight);
  //       }
  //     });
  //   }
  
  //   // Add the application text after the images
  //   doc.setFontSize(12);
  //   doc.text(applicationText, 20, imgStartYPosition + Math.ceil(styleImages.length / maxImagesPerRow) * (imgHeight + imgMargin) + 10); // Position below the last image
  
  //   // Add the explanatory text after the application text
  //   doc.text(
  //     "We have calculated the sewing thread consumption by following the type of stitches (ISO Stitch type 301, 401, 504, etc.).",
  //     20,
  //     imgStartYPosition + Math.ceil(styleImages.length / maxImagesPerRow) * (imgHeight + imgMargin) + 20 // Position below the application text
  //   );
  
  //   // Create table data from uniqueThreadCombinations
  //   const tableData = uniqueThreadCombinations.map(item => [
  //     item.threadNameType, 
  //     item.netConsumption, 
  //     item.totalConsumption, 
  //     item.generalAllowance
  //   ]);
  
  //   // Define table columns
  //   const tableColumns = [
  //     { header: "Thread Name", dataKey: "threadNameType" },
  //     { header: "Net Consumption", dataKey: "netConsumption" },
  //     { header: "General Allowance", dataKey: "generalAllowance" },
  //     { header: "Total Consumption", dataKey: "totalConsumption" }
     
  //   ];
  
  //   // Calculate the totals for each column
  //   const totalNetConsumption = uniqueThreadCombinations.reduce((sum, item) => sum + item.netConsumption, 0);
  //   const totalTotalConsumption = uniqueThreadCombinations.reduce((sum, item) => sum + item.totalConsumption, 0);
  //   const totalGeneralAllowance = uniqueThreadCombinations.reduce((sum, item) => sum + item.generalAllowance, 0);
  
  //   // Add total row at the end of the table data
  //   tableData.push([
  //     "Total", // Placeholder for Thread Name column
  //     totalNetConsumption.toFixed(2), 
  //     totalGeneralAllowance.toFixed(2),
  //     totalTotalConsumption.toFixed(2)
     
  //   ]);
  
  //   // Add table to PDF with more space before the table
  //   doc.autoTable({
  //     head: [tableColumns.map(col => col.header)],
  //     body: tableData,
  //     startY: imgStartYPosition + Math.ceil(styleImages.length / maxImagesPerRow) * (imgHeight + imgMargin) + 30, // Position table below the explanatory text
  //     margin: { top: 10 },
  //     styles: {
  //       overflow: 'linebreak',
  //       cellWidth: 'auto',
  //     },
  //   });

  //   const footerText = `© AMANN Group / Thread Consumption / ${combinedData?.style?.buyerName || ''}`;
  //   doc.text(footerText, 20, doc.internal.pageSize.getHeight() - 20);
  
  //   // Save the PDF
  //   doc.save("thread_consumption_report.pdf");
  // };

  const generatePDF = () => {
    const doc = new jsPDF("landscape");

    // Add headline
    doc.setFont("helvetica", "normal"); // Set font to Helvetica
    doc.setFontSize(22);
    doc.text("Thread Requirement Solution", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Add logo in the top right corner
    const logoUrl = amannLogo;
    if (logoUrl) {
        doc.addImage(logoUrl, "JPEG", doc.internal.pageSize.getWidth() - 40, 10, 30, 30);
    }

    // Adjusted position for images
    const imgTopOffset = 5; // Adjust this value to position images higher
    const imgWidth = 140; // Adjust width as necessary
    const imgHeight = 70; // Adjust height as necessary
    const imgStartYPosition = 50 + imgTopOffset; // Start a bit higher than before
    const maxImagesPerRow = 4; // Maximum images per row
    const imgMargin = 10; // Margin between images

    // Add images from combinedData.images
    const styleImages = combinedData.images;

    if (styleImages.length > 0) {
        styleImages.forEach((image, index) => {
            const imageUrl = image.imageUrl; // Adjust this to the correct property for the image URL
            if (imageUrl) {
                const xPosition = 20 + (index % maxImagesPerRow) * (imgWidth + imgMargin); // Calculate x position
                const yPosition = imgStartYPosition + Math.floor(index / maxImagesPerRow) * (imgHeight + imgMargin); // Calculate y position
                doc.addImage(imageUrl, "JPEG", xPosition, yPosition, imgWidth, imgHeight);
            }
        });
    }

    // Position for the new table
    const newTableXPosition = 180; // Adjust as needed for the right side of images
    const newTableStartY = imgStartYPosition; // Align with the image start position

    // New table data
    const newTableData = [
        { col1: "Date", col2: new Date().toLocaleDateString(), isBold: true }, // Format date if needed
        { col1: "Buyer", col2: combinedData.style.buyerName, isBold: true },
        { col1: "Size", col2: combinedData.style.size, isBold: true },
        { col1: "Tas ticket no.", col2: "N/A", isBold: true },
        { col1: "Note: " + applicationText, col2: "", colSpan: 2, isBold: true }, // Last row
    ];

    // Add new table to PDF
    doc.autoTable({
        head: [],
        body: newTableData.map(item => [item.col1, item.col2]),
        startY: newTableStartY, // Start position for the new table
        margin: { left: newTableXPosition },
        styles: {
            overflow: 'linebreak',
            cellWidth: 'auto',
        },
        columnStyles: {
            0: { cellWidth: 30 }, // Width of the first column
            1: { cellWidth: 70 }, // Width of the second column
        }
    });

    const footerText1 = `© AMANN Group/Thread Consumption/${combinedData?.style?.buyerName || ''}`;
    doc.setFontSize(10);
    doc.text(footerText1, 20, doc.internal.pageSize.getHeight() - 10);

    // Create a new page for the last table
    doc.addPage();

    // Add logo in the top right corner of the new page
    if (logoUrl) {
        doc.addImage(logoUrl, "JPEG", doc.internal.pageSize.getWidth() - 40, 10, 30, 30);
    }

    // Add the headline on the new page (optional, if you want to repeat it)
    doc.setFontSize(22);
    doc.text("Thread Requirement Solution", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Add explanatory text before the table
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal"); // Ensure font is set to Helvetica for the explanatory text

    

    // Prepare table data for the last table
    const tableData = uniqueThreadCombinations.map(item => [
        item.threadNameType,
        (item.netConsumption+item.sewingAllowance).toFixed(2),
        item.generalAllowance.toFixed(2),
        item.totalConsumption.toFixed(2)
    ]);
// Calculate the totals for each column
const totalNetConsumption = uniqueThreadCombinations.reduce((sum, item) => sum + item.netConsumption+item.sewingAllowance, 0);
const totalTotalConsumption = uniqueThreadCombinations.reduce((sum, item) => sum + item.totalConsumption, 0);
const totalGeneralAllowance = uniqueThreadCombinations.reduce((sum, item) => sum + item.generalAllowance, 0);

const explanatoryText = `
We have calculated the sewing thread consumption by following the type of stitches (ISO Stitch type 301, 401, 504, etc.).
During calculation, we have considered the following parameters for each sewing operation: 

• Stitch type • Stitch density/SPI • Fabric thickness • Length • Fabric layer, etc.

Based on the findings on garment, the thread calculation is given below:

Total estimated single garment thread consumption: ${totalTotalConsumption.toFixed(3)} Meters/Garment. Breakdown is given below:
`;

    // Position for the explanatory text
    const textStartY = 35; // Adjust the vertical position as needed
    doc.text(explanatoryText, 15, textStartY);

// Add total row at the end of the table data
tableData.push([
    "Total", // Placeholder for Thread Name column
    totalNetConsumption.toFixed(2),
    totalGeneralAllowance.toFixed(2),
    totalTotalConsumption.toFixed(2)
]);
    // Define table columns
    const tableColumns = [
        { header: "Thread Name", dataKey: "threadNameType" },
        { header: "Net Consumption", dataKey: "netConsumption" },
        { header: "General Allowance", dataKey: "generalAllowance" },
        { header: "Total Consumption", dataKey: "totalConsumption" }
    ];

    

    // Add last table to PDF
    doc.autoTable({
        head: [tableColumns.map(col => col.header)],
        body: tableData,
        startY: 80, // Position from the top of the new page
        margin: { top: 10 },
        styles: {
            overflow: 'linebreak',
            cellWidth: 'auto',
        },
    });

    // Add note after the table
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal"); // Ensure font is set to Helvetica for the note text

    const noteText = `
Note:

This consumption is excluding embroidery. 
It is worth to mention that this report determines net thread demand of the garment including the “Unavoidable wastage” on machine during 
sewing.The “wastage” includes the additional thread demand for seam beginnings and endings or other influencing factors. 
Also, we have included a general allowance of ${combinedData.style.generalAllowance}%.

Please note that the real thread demand in the particular factory may differ according 
to the machines, thread feeding, or the handling of the single sewing person.For example, one single person producing long chains at 
overlocking machines may increase the thread demand noticeably.
`;

    // Position for the note
    const noteStartY = doc.autoTable.previous.finalY + 10; // Start after the table with some margin
    doc.text(noteText, 15, noteStartY);

    // Add footer to the second page
    const footerText = `© AMANN Group/Thread Consumption/${combinedData?.style?.buyerName || ''}`;
    doc.setFontSize(10);
    doc.text(footerText, 10, doc.internal.pageSize.getHeight() - 10);

    // Save the PDF
    doc.save("thread_consumption_report.pdf");
};


  return (
    <div className="container mx-auto p-4">
      {/* Textarea to capture application details */}
      <textarea
        value={applicationText}
        onChange={(e) => setApplicationText(e.target.value)} // Update state when input changes
        rows={4}
        className="border rounded p-2 w-full mb-4"
        placeholder="Write your application details here..."
      />
      {/* Button to trigger PDF generation */}
      <button
        onClick={(e) => {
          e.preventDefault();
          generatePDF(); // Generate PDF on button click
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Download Report 
      </button>
    </div>
  );
};

export default PdfReport;
