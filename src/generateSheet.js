var Excel = require('exceljs');
var path = require('path');

function generateSheet(data, filePath) {

  var workbook = new Excel.Workbook();

  //==================================
  workbook.creator = 'Me';
  workbook.lastModifiedBy = 'Her';
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  //==================================
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
  ];
  //==================================
  var sheet = workbook.addWorksheet('My Sheet');

  // // E.g. tab color:
  // var sheet = workbook.addWorksheet('My Sheet', {properties:{tabColor:{argb:'FFC0000'}}});
  //
  // //E.g. Hide grid lines
  // var sheet = workbook.addWorksheet('My Sheet', {properties: {showGridLines: false}});
  //
  // // E.g. Freeze rows, columns
  // var sheet = workbook.addWorksheet('My Sheet', {views:[{xSplit: 1, ySplit:1}]});
  //

  //==================================
  // Iterate over all sheets
  // Note: workbook.worksheets.forEach will still work but this is better
  workbook.eachSheet(function(worksheet, sheetId) {
      // console.log(sheetId);
  });

  // fetch sheet by name
  var worksheet = workbook.getWorksheet('My Sheet');

  // // fetch sheet by id
  // var worksheet = workbook.getWorksheet(1);

  //==================================
  // create new sheet with properties
  // var worksheet = workbook.addWorksheet('sheet', {properties:{tabColor:{argb:'FF00FF00'}}});
  //
  // // create a new sheet writer with properties
  // var worksheetWriter = workbookWriter.addSheet('sheet', {properties:{outlineLevelCol:1}});
  //
  // // adjust properties afterwards (not supported by worksheet-writer)
  // worksheet.properties.outlineLevelCol = 2;
  // worksheet.properties.defaultRowHeight = 15;

  //==================================


  // name: '御福源 玫瑰茉莉花草茶组合套餐 罐装',
  // id: '6799',
  // url: 'http://h.meitianhui.com/item.html?item_id=6799',
  // price: '28.900'

  worksheet.columns = [
      { header: '商品名称', key: 'name', width: 80 },
      { header: '商品 id', key: 'id', width: 10 },
      { header: '商品链接', key: 'url', width: 60},
      { header: '活动价', key: 'price', width: 15 }
  ];

  for (var i = 0; i < data.length; i++) {
    worksheet.addRow({name: data[i].name, id: data[i].id, url: data[i].url, price: data[i].price });
  }

  worksheet.eachRow(function(row, rowNumber) {
      console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
  });

  // console.log(filePath);
  workbook.xlsx.writeFile(filePath)
      .then(function() {
          console.log('success');
      });

}

module.exports = generateSheet;
