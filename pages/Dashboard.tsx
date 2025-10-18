import React, { useMemo } from 'react';
import { useRestaurantState } from '../context/RestaurantContext';
// FIX: Change to default import for Header component.
import Header from '../components/Header';
import { Card } from '../components/common';
import { OrderStatus, TableStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CurrencyIcon = () => (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>);
const OrderIcon = () => (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const TableIcon = () => (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" /></svg>);
const InventoryIcon = () => (<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0" /></svg>);

const Dashboard = () => {
    const { orders, tables, inventory, menu } = useRestaurantState();

    const stats = useMemo(() => {
        const activeOrders = orders.filter(o => o.status === OrderStatus.Active);
        const totalSales = orders
            .filter(o => o.status === OrderStatus.Completed)
            .reduce((sum, order) => {
                const orderTotal = order.items.reduce((itemSum, item) => {
                    const menuItem = menu.find(m => m.id === item.menuItemId);
                    return itemSum + (menuItem ? menuItem.price * item.quantity : 0);
                }, 0);
                return sum + orderTotal;
            }, 0);
        
        return {
            totalSales: totalSales.toFixed(2),
            activeOrdersCount: activeOrders.length,
            availableTables: tables.filter(t => t.status === TableStatus.Available).length,
            lowStockItems: inventory.filter(i => i.stock <= i.lowStockThreshold).length,
        };
    }, [orders, tables, inventory, menu]);
    
    const salesData = useMemo(() => {
        const categorySales: {[key: string]: number} = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const menuItem = menu.find(m => m.id === item.menuItemId);
                if(menuItem){
                    const category = menuItem.category;
                    if(!categorySales[category]) categorySales[category] = 0;
                    categorySales[category] += menuItem.price * item.quantity;
                }
            });
        });
        return Object.keys(categorySales).map(key => ({name: key, sales: parseFloat(categorySales[key].toFixed(2))}));
    }, [orders, menu]);

    return (
        <div>
            <Header title="Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <Card title="Total Sales (Today)" value={`$${stats.totalSales}`} icon={<CurrencyIcon />} color="bg-green-500" />
                <Card title="Active Orders" value={stats.activeOrdersCount} icon={<OrderIcon />} color="bg-blue-500" />
                <Card title="Available Tables" value={`${stats.availableTables} / ${tables.length}`} icon={<TableIcon />} color="bg-purple-500" />
                <Card title="Low Stock Items" value={stats.lowStockItems} icon={<InventoryIcon />} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} cursor={{fill: '#4A5568'}} />
                            <Legend />
                            <Bar dataKey="sales" fill="#6366F1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;