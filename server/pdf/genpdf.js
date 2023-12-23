const PDFDocument = require('pdfkit');
const fs = require('fs');

function genratePDF(data) {

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('users.pdf'));


    data.forEach((row) => {
        // table has 'name', 'email', and 'age' columns
        doc.text(`UserId: ${row.id}`);
        doc.text(`Username: ${row.username}`);
        doc.text(`Email: ${row.email}`);
        doc.text(`Password: ${row.password}`);
        doc.text(`Image: ${row.image}`);
        doc.moveDown();
      });

      doc.end();
};

module.exports = {genratePDF};