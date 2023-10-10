import { createContext } from 'react';
import { DrinksContextTypes } from '../utils/types';

const DrinksContext = createContext({} as DrinksContextTypes);

export default DrinksContext;
