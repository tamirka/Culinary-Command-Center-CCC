
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unit: 'kg' | 'liters' | 'units';
  lowStockThreshold: number;
}

export enum TableStatus {
  Available = 'Available',
  Occupied = 'Occupied',
  Billing = 'Billing',
}

export interface Table {
  id: number;
  capacity: number;
  status: TableStatus;
  orderId?: string | null;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export enum OrderStatus {
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
}

export interface Reservation {
    id: string;
    guestName: string;
    partySize: number;
    time: string;
    notes: string;
}

export type Action =
  | { type: 'ADD_ORDER'; payload: { tableId: number; order: Order } }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'COMPLETE_ORDER'; payload: { orderId: string, tableId: number } }
  | { type: 'ADD_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'UPDATE_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'ADD_RESERVATION'; payload: Reservation };

export interface AppState {
  menu: MenuItem[];
  inventory: InventoryItem[];
  tables: Table[];
  orders: Order[];
  reservations: Reservation[];
}
