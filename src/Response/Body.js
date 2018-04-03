import { renderToString } from 'react-dom/server';

const Body = ({ body, children, format }) => {
  if (children) return renderToString(children);
  return format.match(/json/i) ? JSON.stringify(body) : body;
};

export default Body;
