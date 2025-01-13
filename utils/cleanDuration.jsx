const cleanDuration = (duration) => {
    return parseInt(duration.replace(" min", ""), 10);
  };
  
  export default cleanDuration;
  