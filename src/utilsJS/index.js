import PDF from "assets/images/pdf.png";
let FILE_TYPE = ['pdf'];

const currencySymbols = {
  USD: 'US$ ',
  EURO: '€ ',
};

const utilsJS = {

    downloadExcel: (data, fileName) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
    },

    getImageByExtention: (file) => {

        const lastDotIndex = file.name.lastIndexOf('.');
        const extention = file.name.slice(lastDotIndex + 1);

        if (FILE_TYPE.includes(extention)) {
            return PDF;
        }
        else {

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    return reader.result;
                };
                reader.readAsDataURL(file);
            }
        }
    },

    getDocumentSize: (size) => {

        const fileSizeInMB = size / (1024 * 1024);
        return fileSizeInMB.toFixed(2) + " MB";
    },

    getFormattedAmount: (amount) => {
      

      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'decimal'
      }).format(amount);

      let numberWithoutMinus = Math.abs(parseInt(formattedAmount.replace(/,/g, ''))).toLocaleString();
      return String(amount).includes("-") ? `(${numberWithoutMinus})` : formattedAmount;
    },

    getCurrency: (currency) => {
      const upperCaseCurrency = currency.toUpperCase();
      return currencySymbols[upperCaseCurrency] || '';
    },

    printImages : (ROW_DETAILS, model) => {
      
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>${ROW_DETAILS.fileNo}</title>
              <style>
                body {
                  display: flex;
                  flex-wrap: wrap;
                }
                img {
                  width: 100%;
                  height: 90%;
                  margin: 2px;
                }
              </style>
            </head>
            <body>
        `);
        
        model.forEach((imageUrl, index) => {
            imageUrl && printWindow.document.write(`<img src="${imageUrl}" id="image${index}" />`);
        });
    
        printWindow.document.write(`
            </body>
          </html>
        `);
    
        const imagesLoaded = new Promise((resolve) => {
          const checkImagesLoaded = () => {
            const allImages = model.map((_, index) => printWindow.document.getElementById(`image${index}`));
            if (allImages.every(image => image && image.complete)) {
              resolve();
            } else {
              setTimeout(checkImagesLoaded, 100);
            }
          };
          checkImagesLoaded();
        });
    
        imagesLoaded.then(() => {
          printWindow.document.close();
          printWindow.print();
        });
      }


}
export default utilsJS;