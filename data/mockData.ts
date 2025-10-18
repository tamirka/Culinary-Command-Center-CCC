import { AppState, OrderStatus, TableStatus } from '../types';

export const mockData: AppState = {
  menu: [
    { id: 'm1', name: 'Margherita Pizza', price: 12.99, category: 'Main', description: 'Classic pizza with tomatoes, mozzarella, and basil.', imageUrl: 'https://picsum.photos/400/300?random=1' },
    { id: 'm2', name: 'Carbonara Pasta', price: 15.50, category: 'Main', description: 'Creamy pasta with eggs, cheese, pancetta, and pepper.', imageUrl: 'https://picsum.photos/400/300?random=2' },
    { id: 'm3', name: 'Bruschetta', price: 7.99, category: 'Appetizer', description: 'Grilled bread with garlic, tomatoes, and olive oil.', imageUrl: 'https://picsum.photos/400/300?random=3' },
    { id: 'm4', name: 'Tiramisu', price: 8.50, category: 'Dessert', description: 'Coffee-flavoured Italian dessert.', imageUrl: 'https://picsum.photos/400/300?random=4' },
    { id: 'm5', name: 'House Wine', price: 6.00, category: 'Drinks', description: 'A glass of our finest red or white wine.', imageUrl: 'https://picsum.photos/400/300?random=5' },
  ],
  inventory: [
    { id: 'i1', name: 'Pizza Dough', stock: 20, unit: 'kg', lowStockThreshold: 5 },
    { id: 'i2', name: 'Tomato Sauce', stock: 15, unit: 'liters', lowStockThreshold: 4 },
    { id: 'i3', name: 'Mozzarella', stock: 10, unit: 'kg', lowStockThreshold: 3 },
    { id: 'i4', name: 'Pasta', stock: 30, unit: 'kg', lowStockThreshold: 10 },
    { id: 'i5', name: 'Eggs', stock: 100, unit: 'units', lowStockThreshold: 24 },
    { id: 'i6', name: 'Pancetta', stock: 5, unit: 'kg', lowStockThreshold: 2 },
  ],
  tables: [
    { id: 1, capacity: 2, status: TableStatus.Available },
    { id: 2, capacity: 4, status: TableStatus.Available },
    { id: 3, capacity: 4, status: TableStatus.Occupied, orderId: 'ord1' },
    { id: 4, capacity: 6, status: TableStatus.Available },
    { id: 5, capacity: 2, status: TableStatus.Available },
    { id: 6, capacity: 8, status: TableStatus.Billing, orderId: 'ord2' },
    { id: 7, capacity: 4, status: TableStatus.Available },
    { id: 8, capacity: 4, status: TableStatus.Available },
  ],
  orders: [
    { 
      id: 'ord1', 
      tableId: 3, 
      items: [
        { menuItemId: 'm1', quantity: 1, status: 'preparing' },
        { menuItemId: 'm5', quantity: 2, status: 'served' },
      ], 
      // FIX: Use OrderStatus enum instead of string literal to match the type definition.
      status: OrderStatus.Active,
      createdAt: Date.now() - 10 * 60 * 1000 // 10 minutes ago
    },
    { 
      id: 'ord2', 
      tableId: 6, 
      items: [
        { menuItemId: 'm2', quantity: 2, status: 'served' },
        { menuItemId: 'm3', quantity: 1, status: 'served' },
        { menuItemId: 'm4', quantity: 2, status: 'served' },
      ], 
      // FIX: Use OrderStatus enum instead of string literal to match the type definition.
      status: OrderStatus.Active,
      createdAt: Date.now() - 30 * 60 * 1000 // 30 minutes ago
    },
  ],
  reservations: [
    { id: 'r1', guestName: 'John Doe', partySize: 4, time: '19:00', notes: 'Window seat requested' },
    { id: 'r2', guestName: 'Jane Smith', partySize: 2, time: '20:30', notes: 'Anniversary' },
  ]
};