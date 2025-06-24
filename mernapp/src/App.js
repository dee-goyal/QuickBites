// App.js
import './App.css';
import Home    from './screens/temp';
import Login   from './screens/Login';
import Signup  from './screens/Signup';
import Cart    from './screens/Cart';
import MyOrder from './screens/MyOrder';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import 'bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { CartProvider } from './components/ContextReducer';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path='/'             element={<Home   />} />
          <Route path='/login'        element={<Login  />} />
          <Route path='/createuser'   element={<Signup />} />
          <Route path='/cart'         element={<Cart   />} />
         <Route path='/myorder' element={<MyOrder />} />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
