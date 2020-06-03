import React, { useState, useEffect, useCallback } from 'react';
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

  const cleanState = {
    ...global,
    loading,
    householdBooks: global?.books?.householdBooks,
    userBooks: global?.books?.userBooks,
    allBooks: global?.books?.userBooks.concat(global?.books?.householdBooks),
    setGlobal,
  };

  return <Context.Provider value={cleanState}>{children}</Context.Provider>;
};

const GlobalConsumer = Context.Consumer;

export { GlobalProvider, GlobalConsumer, Context };
