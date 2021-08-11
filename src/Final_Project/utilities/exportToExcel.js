const xl = require('excel4node');

const exportToExcel = (fullPath, headers, dataProps, data) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Event Attendance');
  const headerStyle = wb.createStyle({
    font: {
      color: '#000000',
      size: 10,
      bold: true,
    },
  });
  const bodyStyle = wb.createStyle({
    font: {
      color: '#000000',
      size: 10,
    },
  });

  // Add headers
  for (let index = 0; index < headers.length; index++) {
    ws.cell(1, index + 1)
      .string(headers[index])
      .style(headerStyle);
  }

  // Add data
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < dataProps.length; j++) {
      let cellData = data[i][dataProps[j]];
      if (cellData instanceof Date)
        cellData = `${cellData.toLocaleDateString()} ${cellData.toLocaleTimeString()}`;

      ws.cell(i + 2, j + 1)
        .string(cellData ?? 'null')
        .style(bodyStyle);
    }
  }

  // Save
  wb.write(fullPath);
};

module.exports = {
  exportToExcel,
};
