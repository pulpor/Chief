import { createContext, useState } from 'react';
import { UtilsContextTypes } from '../tests/utils/types';

export const UtilsContext = createContext({} as UtilsContextTypes);
// export const UtilsContext = createContext<UtilsContextTypes | undefined>(undefined);

type UtilsProviderType = {
  children: React.ReactNode
};

function UtilsProvider({ children }: UtilsProviderType) {
  const [myQuery, setMyQuery] = useState('');
  const [searchType, setSearchType] = useState('ingredient');
  const [isMeal, setIsMeal] = useState(true);

  const contextValue = { myQuery,
    setMyQuery,
    searchType,
    setSearchType,
    isMeal,
    setIsMeal };

  return (
    <UtilsContext.Provider value={ contextValue }>
      { children }
    </UtilsContext.Provider>
  );
}

export default UtilsProvider;
