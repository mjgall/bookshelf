import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Context = React.createContext(null); // Create a context object

const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [global, setGlobal] = useState({});


  const fetchData = async () => {
    const data = await axios
      .get('/api/bootstrap')
      .then((response) => response.data);
    setGlobal(data);
    setLoading(false);
  };

  useEffect(() => {

    fetchData();
  }, []);

  return (
    <Context.Provider value={{ loading, setGlobal, ...global }}>
      {children}
    </Context.Provider>
  );
};

const GlobalConsumer = Context.Consumer

export { GlobalProvider, GlobalConsumer, Context }
