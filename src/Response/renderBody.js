import { renderToString } from 'react-dom/server';

const renderBody = ({ body, children, json, format }) => {
  if (children) return renderToString(children);
  if (json) return JSON.stringify(json);
  return body;
};

export default renderBody;
