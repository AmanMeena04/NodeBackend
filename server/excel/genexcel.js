const ExcelJS = require('exceljs');

function genExcel(results) {

const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Write column headers
    const headers = Object.keys(results[0]);
    worksheet.addRow(headers);

    // Write data to the Excel worksheet
    results.forEach((row) => {
      const values = Object.values(row);
      worksheet.addRow(values);
    });

    // Save the workbook to a file
    const outputFilename = 'output.xlsx';
    workbook.xlsx.writeFile(outputFilename)
      .then(() => {
        console.log('Excel file generated');
        console.log(`Output file: ${outputFilename}`);
      });
    }

    module.exports = {genExcel};