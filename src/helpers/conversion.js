export const formatDate = (dateString) => {
  console.log(dateString,"dkfn");
  
    if (!dateString) return '-';
    if(dateString === '-')  return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  

  export const formatAttendence = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(date);
  };




 export  const formatLeave = (startDate, endDate) => {
    if (!startDate || !endDate) return '-';
  
    const options = { month: 'short', day: '2-digit' };
  
    const start = new Date(startDate).toLocaleDateString('en-US', options);
    const end = new Date(endDate).toLocaleDateString('en-US', options);
  
    return `${start} - ${end}`;
  };


  export const  getISTTimeOnly=(dateInput) =>{
    if (!dateInput) return '-';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  }

  export const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // handle empty or undefined
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  

  export const  getDayName=(dateString)=> {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  }


  export const formatFullDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  export const formatDateYYYYMMDD = (dateString) => {
    if (!dateString) return '-';
  
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year} - ${month} - ${day}`;
  };
  

  export const  convertNumberToWords=(num)=> {
    if (typeof num !== "number" || isNaN(num)) return "Invalid input";
  
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
      'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
  
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
  
    const g = [
      '', 'Thousand', 'Million', 'Billion', 'Trillion'
    ];
  
    if (num === 0) return 'Zero';
  
    let words = '';
  
    const chunk = (n) => {
      let str = '';
  
      if (n > 99) {
        str += a[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
  
      if (n > 19) {
        str += b[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
  
      if (n > 0) {
        str += a[n] + ' ';
      }
  
      return str;
    };
  
    let i = 0;
    while (num > 0) {
      const part = num % 1000;
      if (part > 0) {
        words = chunk(part) + g[i] + ' ' + words;
      }
      num = Math.floor(num / 1000);
      i++;
    }
  
    return words.trim();
  }
  