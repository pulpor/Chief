import { createContext } from 'react';
import { MealsContextTypes } from '../utils/types';

const MealsContext = createContext({} as MealsContextTypes);

export default MealsContext;
