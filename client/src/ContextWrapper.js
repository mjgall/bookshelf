import React, { useState, useEffect } from 'react';
import { globalContext } from './globalContext';
import axios from 'axios';
import App from './App';

const ContextWrapper = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [loaded, setLoaded] = useState(false);
  const getGlobal = async () => {
    const global = await axios.get('/api/bootstrap');

    setGlobal(global.data);
  };

  console.log('hello');

  useEffect(() => {
    getGlobal();
  }, []);

  return (
    <globalContext.Provider value={{ ...global, setGlobal }}>
      {children}
    </globalContext.Provider>
  );
};

export default ContextWrapper;
