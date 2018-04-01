import { createContext } from 'react';

const Environment = createContext();
const { Provider, Consumer } = Environment;

export default Environment;
export { Provider, Consumer };
