const defaults = ({ request, json }) => {
  const { headers } = request;
  return {
    'Content-Type': json
      ? 'application/json; charset=utf-8'
      : headers.accept ? headers.accept.split(',')[0] : 'text/plain',
  };
};

const renderHeaders = ({ request, custom = {}, json }) =>
  Object.assign({}, defaults({ request, json }), custom);

export default renderHeaders;
