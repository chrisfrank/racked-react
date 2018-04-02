const defaults = ({ req, json }) => {
  const { headers } = req;
  return {
    'Content-Type': json
      ? 'application/json'
      : headers.accept ? headers.accept.split(',')[0] : 'text/plain',
  };
};

const Headers = ({ req, custom = {}, json }) =>
  Object.assign({}, defaults({ req, json }), custom);

export default Headers;
