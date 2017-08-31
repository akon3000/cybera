import { saveAs } from 'file-saver';
import { Workbook } from 'xlsx-workbook';
import XLSX from 'xlsx';

/* eslint-disable */

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
  for(var R = 0; R != data.length; ++R) {
    for(var C = 0; C != data[R].length; ++C) {
      if(range.s.r > R) range.s.r = R;
      if(range.s.c > C) range.s.c = C;
      if(range.e.r < R) range.e.r = R;
      if(range.e.c < C) range.e.c = C;

      if(data[R][C] == null) continue;

      if(data[R][C].f == undefined) {
        var cell = {v: data[R][C] };

        if(typeof cell.v === 'number') cell.t = 'n';
        else if(typeof cell.v === 'boolean') cell.t = 'b';
        else if(cell.v instanceof Date) {
          cell.t = 'n'; cell.z = XLSX.SSF._table[14];
          cell.v = datenum(cell.v);
        }
        else cell.t = 's';
      } else {
        var cell = data[R][C];
      }

      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      ws[cell_ref] = cell;
    }
  }

  if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

/* eslint-enable */

export const downLoadExcel = (data, fileName) => {
  const workbook = new Workbook();
  const ws = sheet_from_array_of_arrays(data);

  workbook.SheetNames = [];
  workbook.Sheets = {};
  workbook.SheetNames.push(fileName);
  workbook.Sheets[fileName] = ws;

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
};

export const downLoadCSV = (data, fileName) => {
  let csvContent = '';
  for (let i = 0; i < data.length; i += 1) {
    csvContent += i < data.length - 1 ? `${data[i].join(',')}\n` : data[i].join(',');
  }

  saveAs(new Blob([csvContent], { type: 'text/csv;charset=utf-8' }), `${fileName}.csv`);
};
