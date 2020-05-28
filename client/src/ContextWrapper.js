import React, { useState, useEffect } from 'react';
import { globalContext } from './globalContext';
import axios from 'axios';
import App from './App';

const ContextWrapper = () => {
  const [global, setGlobal] = useState({});

  useEffect(() => {
    const getGlobal = async () => {
      const global = await axios
        .get('/api/bootstrap')
        .then((response) => response.data);

      setGlobal(global);
    };

    getGlobal();
  }, []);

  return (
    <globalContext.Provider value={global}>
      <App></App>
    </globalContext.Provider>
  );
};

export default ContextWrapper;
