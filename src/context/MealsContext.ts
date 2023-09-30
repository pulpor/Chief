import { createContext } from 'react';
import { MealsContextTypes } from '../tests/utils/types';

const MealsContext = createContext({} as MealsContextTypes);

export default MealsContext;
