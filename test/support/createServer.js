import http from 'http';
import racked from '../../src';

const createServer = App => http.createServer(racked(App));

export default createServer;
