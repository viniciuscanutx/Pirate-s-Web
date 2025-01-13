export function parseFullReleaseDate(dateStr) {
    const [day, month, year] = dateStr.split(" ");
    const months = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };
    return new Date(`${year}-${months[month]}-${day}`);
  }
  
  export function formatToFullReleaseDate(date) {
    return date.toISOString().split("T")[0];
  }
  