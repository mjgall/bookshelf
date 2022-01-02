import React, { useState, useEffect, useCallback, createContext } from 'react';
import axios from 'axios';

const Context = createContext(null); // Create a context object

const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [global, setState] = useState({});

  const fetchData = async () => {
    const data = await axios
      .get('/api/bootstrap')
      .then((response) => response.data);
    setState(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // here we only re-create setContext when its dependencies change ([global, setState])
  const setGlobal = useCallback(
    updates => {
      setState({ ...global, ...updates })
    },
    [global, setState],
  )

  const deleteProperty = useCallback(property => {
    let newState = { ...global }
    delete newState[property]
    setState(newState)
  }, [global, setState])

  const setAuth = useCallback(() => {
    fetchData()
  }, [])

  // here context value is just returning an object, but only re-creating the object when its dependencies change ([global, setContext])
  const getContextValue = useCallback(
    () => ({
      ...global,
      loading,
      setGlobal,
      setAuth,
      deleteProperty
    }),
    [global, setGlobal, loading, setAuth, deleteProperty],
  )

  return <Context.Provider value={getContextValue()}>{children}</Context.Provider>;
};

const GlobalConsumer = Context.Consumer;

export { GlobalProvider, GlobalConsumer, Context };
