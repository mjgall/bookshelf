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
      setState({...global, ...updates})
    },
    [global, setState],
  )

  // here context value is just returning an object, but only re-creating the object when its dependencies change ([global, setContext])
  const getContextValue = useCallback(
    () => ({
      ...global,
      loading,
      setGlobal,
    }),
    [global, setGlobal, loading],
  )

  const cleanState = {
    ...global,
    loading,
    householdBooks: global?.books?.householdBooks,
    userBooks: global?.books?.userBooks,
    allBooks: global?.books?.userBooks.concat(global?.books?.householdBooks),
    setState,
  };

  return <Context.Provider value={getContextValue()}>{children}</Context.Provider>;
};

const GlobalConsumer = Context.Consumer;

export { GlobalProvider, GlobalConsumer, Context };
