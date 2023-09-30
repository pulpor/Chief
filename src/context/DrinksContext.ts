import { createContext } from 'react';
import { DrinksContextTypes } from '../tests/utils/types';

const DrinksContext = createContext({} as DrinksContextTypes);

export default DrinksContext;
