const fs = require('fs');
const { JSDOM } = require('jsdom');

// Read the HTML file
const htmlContent = fs.readFileSync('/Users/spencer/dev/reactProjects/eidex/deez.html', 'utf8');

// Parse the HTML
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Find the table
const table = document.querySelector('table');
const rows = table.querySelectorAll('tr');

// Extract header row
const headerRow = rows[0];
const headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());

// Extract data rows
const data = [];
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const cells = row.querySelectorAll('td');
  
  if (cells.length > 0) {
    const rowData = {};
    cells.forEach((cell, index) => {
      if (headers[index]) {
        rowData[headers[index]] = cell.textContent.trim();
      }
    });
    data.push(rowData);
  }
}

// Convert to JSON
const jsonOutput = JSON.stringify(data, null, 2);

// Write to file
fs.writeFileSync('/Users/spencer/dev/reactProjects/eidex/legendaries-data.json', jsonOutput);

console.log(`Converted ${data.length} legendary Pokemon entries to JSON`);
console.log('Output saved to legendaries-data.json');
