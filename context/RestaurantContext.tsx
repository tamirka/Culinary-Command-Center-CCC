import React, { createContext, useReducer, useContext, Dispatch } from 'react';
// FIX: Import OrderStatus to use enum member instead of string literal.
import { AppState, Action, TableStatus, OrderStatus } from '../types';
import { mockData } from '../data/mockData';

const RestaurantStateContext = createContext<AppState | undefined>(undefined);
const RestaurantDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

const restaurantReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_ORDER': {
      const { tableId, order } = action.payload;
      return {
        ...state,
        orders: [...state.orders, order],
        tables: state.tables.map(table =>
          table.id === tableId ? { ...table, status: TableStatus.Occupied, orderId: order.id } : table
        ),
      };
    }
    case 'UPDATE_ORDER': {
        const updatedOrder = action.payload;
        return {
            ...state,
            orders: state.orders.map(order => order.id === updatedOrder.id ? updatedOrder : order)
        };
    }
    case 'COMPLETE_ORDER': {
        const { orderId, tableId } = action.payload;
        return {
            ...state,
            // FIX: Use OrderStatus enum instead of string literal to match the type definition.
            orders: state.orders.map(o => o.id === orderId ? {...o, status: OrderStatus.Completed} : o),
            tables: state.tables.map(t => t.id === tableId ? {...t, status: TableStatus.Available, orderId: null} : t)
        }
    }
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.payload] };
    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'ADD_MENU_ITEM':
      return { ...state, menu: [...state.menu, action.payload] };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menu: state.menu.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'ADD_RESERVATION':
      return { ...state, reservations: [...state.reservations, action.payload] };
    default:
      return state;
  }
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(restaurantReducer, mockData);

  return (
    <RestaurantStateContext.Provider value={state}>
      <RestaurantDispatchContext.Provider value={dispatch}>
        {children}
      </RestaurantDispatchContext.Provider>
    </RestaurantStateContext.Provider>
  );
};

export const useRestaurantState = () => {
  const context = useContext(RestaurantStateContext);
  if (context === undefined) {
    throw new Error('useRestaurantState must be used within a RestaurantProvider');
  }
  return context;
};

export const useRestaurantDispatch = () => {
  const context = useContext(RestaurantDispatchContext);
  if (context === undefined) {
    throw new Error('useRestaurantDispatch must be used within a RestaurantProvider');
  }
  return context;
};