import React, { useState, useEffect } from 'react';
import { useRestaurantState, useRestaurantDispatch } from '../context/RestaurantContext';
// FIX: Change to default import for Header component.
import Header from '../components/Header';
import { Order, OrderItem, OrderStatus, MenuItem } from '../types';
import { Button } from '../components/common';

const OrderTicket: React.FC<{ order: Order; menu: MenuItem[]; onUpdate: (order: Order) => void, onComplete: (orderId: string, tableId: number) => void }> = ({ order, menu, onUpdate, onComplete }) => {
    const [timeElapsed, setTimeElapsed] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const seconds = Math.floor((Date.now() - order.createdAt) / 1000);
            const minutes = Math.floor(seconds / 60);
            setTimeElapsed(`${minutes}m ${seconds % 60}s`);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [order.createdAt]);
    
    const toggleItemStatus = (menuItemId: string) => {
        const updatedItems = order.items.map(item => {
            if (item.menuItemId === menuItemId) {
                // FIX: The result of the ternary operator was being inferred as `string`.
                // Explicitly define the new status to conform to the `OrderItem['status']` type.
                const newStatus: OrderItem['status'] = item.status === 'preparing' ? 'ready' : 'preparing';
                return {...item, status: newStatus};
            }
            return item;
        });
        onUpdate({...order, items: updatedItems});
    };

    const isOrderReady = order.items.every(item => item.status === 'ready');

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col h-full">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                <h3 className="font-bold text-lg">Table {order.tableId}</h3>
                <span className="text-sm font-mono text-yellow-400">{timeElapsed}</span>
            </div>
            <ul className="space-y-3 flex-grow">
                {order.items.map(item => {
                    const menuItem = menu.find(m => m.id === item.menuItemId);
                    return (
                        <li key={item.menuItemId} className={`flex items-center justify-between p-2 rounded-md transition-colors ${item.status === 'ready' ? 'bg-green-900/50' : ''}`}>
                            <div>
                               <span className="font-semibold text-lg mr-3">{item.quantity}x</span>
                               <span>{menuItem?.name}</span>
                            </div>
                            <button onClick={() => toggleItemStatus(item.menuItemId)} 
                                    className={`text-xs px-2 py-1 rounded ${item.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'} text-black font-semibold`}>
                                {item.status === 'ready' ? 'Ready' : 'Preparing'}
                            </button>
                        </li>
                    );
                })}
            </ul>
             <Button onClick={() => onComplete(order.id, order.tableId)} disabled={!isOrderReady} className="mt-4 w-full">
                Complete Order
            </Button>
        </div>
    );
};

const Kitchen = () => {
    const { orders, menu } = useRestaurantState();
    const dispatch = useRestaurantDispatch();
    const activeOrders = orders.filter(o => o.status === OrderStatus.Active).sort((a,b) => a.createdAt - b.createdAt);
    
    const handleUpdateOrder = (updatedOrder: Order) => {
        dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
    };

    const handleCompleteOrder = (orderId: string, tableId: number) => {
        dispatch({ type: 'COMPLETE_ORDER', payload: { orderId, tableId } });
    }

    return (
        <div>
            <Header title="Kitchen Display" />
            {activeOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeOrders.map(order => (
                        <OrderTicket key={order.id} order={order} menu={menu} onUpdate={handleUpdateOrder} onComplete={handleCompleteOrder} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-xl">No active orders.</p>
                </div>
            )}
        </div>
    );
};

export default Kitchen;