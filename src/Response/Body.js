const Body = ({ text, format }) =>
  format.match(/json/i) ? JSON.stringify(text) : text;

export default Body;
