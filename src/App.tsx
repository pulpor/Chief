
import { BrowserRouter } from 'react-router-dom';
import MealsProvider from './context/MealsProvider';
import DrinksProvider from './context/DrinksProvider';
import UtilsProvider from './context/UtilsContext';
import Router from './Router';

function App() {
  return (
    <BrowserRouter>
      <UtilsProvider>
        <MealsProvider>
          <DrinksProvider>
            <Router />
          </DrinksProvider>
        </MealsProvider>
      </UtilsProvider>
    </BrowserRouter>
  );
}

export default App;
