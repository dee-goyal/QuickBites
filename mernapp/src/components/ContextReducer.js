import React, { createContext, useReducer, useContext } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: parseInt(action.qty), // Ensure qty is number
          size: action.size,
          price: parseFloat(action.price), // Ensure price is number
          img: action.img
        }
      ];

    case "REMOVE":
      let newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;

    case "UPDATE":
      let arr = [...state];
      arr.find((food, index) => {
        if (food.id === action.id && food.size === action.size) {
          const updatedQty = parseInt(food.qty) + parseInt(action.qty);
          const updatedPrice = parseFloat(food.price) + parseFloat(action.price);
          arr[index] = { ...food, qty: updatedQty, price: updatedPrice };
        }
        return false; // Always return false to continue the search properly
      });
      return arr;
      case "DROP":
        let empArray = []
        return empArray


    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
