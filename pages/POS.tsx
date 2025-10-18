import React, { useState } from 'react';
import { useRestaurantState, useRestaurantDispatch } from '../context/RestaurantContext';
// FIX: Change to default import for Header component.
import Header from '../components/Header';
import { Modal, Button } from '../components/common';
import { Table, TableStatus, MenuItem, Order, OrderItem, OrderStatus } from '../types';

const getStatusColor = (status: TableStatus) => {
  switch (status) {
    case TableStatus.Available: return 'border-green-500 hover:bg-green-900';
    case TableStatus.Occupied: return 'border-yellow-500 hover:bg-yellow-900';
    case TableStatus.Billing: return 'border-red-500 hover:bg-red-900';
    default: return 'border-gray-600';
  }
};

const POS = () => {
    const { tables, orders, menu } = useRestaurantState();
    const dispatch = useRestaurantDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    const handleTableClick = (table: Table) => {
        setSelectedTable(table);
        const existingOrder = orders.find(o => o.id === table.orderId && o.status === OrderStatus.Active);
        setCurrentOrder(existingOrder || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTable(null);
        setCurrentOrder(null);
    };

    const addToOrder = (menuItem: MenuItem) => {
        if (!selectedTable) return;
    
        setCurrentOrder(prevOrder => {
            if (prevOrder) {
                const existingItem = prevOrder.items.find(item => item.menuItemId === menuItem.id);
                const newItems = existingItem
                    ? prevOrder.items.map(item => item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item)
                    // FIX: The type of `status` was being widened to `string`, causing a type mismatch.
                    // Using `'pending' as const` ensures it's treated as a literal type.
                    : [...prevOrder.items, { menuItemId: menuItem.id, quantity: 1, status: 'pending' as const }];
                return { ...prevOrder, items: newItems };
            } else {
                const newOrder: Order = {
                    id: `ord-${Date.now()}`,
                    tableId: selectedTable.id,
                    items: [{ menuItemId: menuItem.id, quantity: 1, status: 'pending' }],
                    status: OrderStatus.Active,
                    createdAt: Date.now(),
                };
                return newOrder;
            }
        });
    };

    const updateItemQuantity = (menuItemId: string, change: number) => {
        if (!currentOrder) return;
        const updatedItems = currentOrder.items.map(item =>
            item.menuItemId === menuItemId
                ? { ...item, quantity: Math.max(0, item.quantity + change) }
                : item
        ).filter(item => item.quantity > 0);
        setCurrentOrder({ ...currentOrder, items: updatedItems });
    };
    
    const saveOrder = () => {
        if (!currentOrder || !selectedTable) return;

        const existingOrder = orders.find(o => o.id === currentOrder.id);
        if (existingOrder) {
            dispatch({ type: 'UPDATE_ORDER', payload: currentOrder });
        } else {
            dispatch({ type: 'ADD_ORDER', payload: { tableId: selectedTable.id, order: currentOrder } });
        }
        closeModal();
    };

    const getOrderTotal = (order: Order | null) => {
        if(!order) return 0;
        return order.items.reduce((total, item) => {
            const menuItem = menu.find(m => m.id === item.menuItemId);
            return total + (menuItem ? menuItem.price * item.quantity : 0);
        }, 0);
    };

    return (
        <div>
            <Header title="Point of Sale" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {tables.map(table => (
                    <div
                        key={table.id}
                        className={`p-4 rounded-lg border-2 bg-gray-800 cursor-pointer transition-all duration-200 ${getStatusColor(table.status)}`}
                        onClick={() => handleTableClick(table)}
                    >
                        <div className="text-center">
                            <p className="text-xl font-bold">Table {table.id}</p>
                            <p className="text-sm text-gray-400">{table.capacity} seats</p>
                            <p className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                                table.status === TableStatus.Available ? 'bg-green-500/20 text-green-400' : 
                                table.status === TableStatus.Occupied ? 'bg-yellow-500/20 text-yellow-400' : 
                                'bg-red-500/20 text-red-400'}`}>{table.status}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={`Table ${selectedTable?.id} - Order`}>
                <div className="flex flex-col md:flex-row gap-6" style={{maxHeight: '70vh'}}>
                    {/* Menu Items */}
                    <div className="md:w-1/2 overflow-y-auto pr-2">
                        <h4 className="font-semibold mb-2 text-lg">Menu</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {menu.map(item => (
                                <div key={item.id} onClick={() => addToOrder(item)} className="bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-indigo-600 transition-colors">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-300">${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Order */}
                    <div className="md:w-1/2 flex flex-col">
                        <h4 className="font-semibold mb-2 text-lg">Current Order</h4>
                        <div className="flex-grow bg-gray-900 p-4 rounded-md overflow-y-auto">
                           {currentOrder && currentOrder.items.length > 0 ? (
                                currentOrder.items.map(item => {
                                    const menuItem = menu.find(m => m.id === item.menuItemId);
                                    return (
                                        <div key={item.menuItemId} className="flex justify-between items-center mb-2">
                                            <div>
                                                <p>{menuItem?.name}</p>
                                                <p className="text-xs text-gray-400">${menuItem?.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateItemQuantity(item.menuItemId, -1)} className="bg-gray-700 w-6 h-6 rounded">-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateItemQuantity(item.menuItemId, 1)} className="bg-gray-700 w-6 h-6 rounded">+</button>
                                            </div>
                                        </div>
                                    )
                                })
                           ) : <p className="text-gray-400">No items added yet.</p>}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                           <div className="flex justify-between items-center font-bold text-xl">
                                <span>Total:</span>
                                <span>${getOrderTotal(currentOrder).toFixed(2)}</span>
                           </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                                <Button onClick={saveOrder}>Send to Kitchen</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default POS;