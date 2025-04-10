export const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa có thông tin";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  export const formatCurrency = (amount) => 
    amount.toLocaleString("en-US") + " USD";