import React, { useState } from 'react';
import { useRestaurantState, useRestaurantDispatch } from '../context/RestaurantContext';
// FIX: Change to default import for Header component.
import Header from '../components/Header';
import { MenuItem, InventoryItem, Reservation } from '../types';
import { Button, Modal } from '../components/common';

// --- Menu Manager ---
const MenuManager = () => {
    const { menu } = useRestaurantState();
    const dispatch = useRestaurantDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const initialItemState: Omit<MenuItem, 'id'> & { id?: string } = {
        name: '',
        price: 0,
        category: '',
        description: '',
        imageUrl: '',
    };
    
    const [currentItem, setCurrentItem] = useState(initialItemState);
    const isEditing = currentItem.id != null;

    const handleOpenModalForAdd = () => {
        setCurrentItem(initialItemState);
        setIsModalOpen(true);
    };
    
    const handleOpenModalForEdit = (item: MenuItem) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem.name || !currentItem.price || !currentItem.category || !currentItem.description) {
            alert("Please fill out all required fields.");
            return;
        }

        if (isEditing) {
            dispatch({
                type: 'UPDATE_MENU_ITEM',
                payload: currentItem as MenuItem
            });
        } else {
             dispatch({
                type: 'ADD_MENU_ITEM',
                payload: {
                    ...currentItem,
                    id: `m-${Date.now()}`,
                    imageUrl: currentItem.imageUrl || `https://picsum.photos/400/300?random=${Date.now()}`
                } as MenuItem
            });
        }
       
        handleCloseModal();
    };

    return (
        <div>
            <div className="mb-6 flex justify-end">
                <Button onClick={handleOpenModalForAdd}>Add New Menu Item</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map(item => (
                    <div 
                        key={item.id} 
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                        onClick={() => handleOpenModalForEdit(item)}
                    >
                        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <div className="flex justify-between items-baseline">
                               <h3 className="text-lg font-bold">{item.name}</h3>
                               <p className="font-semibold text-green-400">${item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{item.category}</p>
                            <p className="text-sm text-gray-300 mt-2">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit Menu Item" : "Add New Menu Item"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input type="text" name="name" id="name" value={currentItem.name} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" required />
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
                        <input type="number" name="price" id="price" value={currentItem.price} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" step="0.01" min="0" required />
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                        <input type="text" name="category" id="category" value={currentItem.category} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" required />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea name="description" id="description" value={currentItem.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" required></textarea>
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300">Image URL</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={currentItem.imageUrl} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit">Save Item</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// --- Inventory Manager ---
const InventoryManager = () => {
    const { inventory } = useRestaurantState();
    const dispatch = useRestaurantDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialItemState: Omit<InventoryItem, 'id'> = {
        name: '',
        stock: 0,
        unit: 'units',
        lowStockThreshold: 0,
    };
    
    const [currentItem, setCurrentItem] = useState<Omit<InventoryItem, 'id'> & { id?: string }>(initialItemState);
    const isEditing = currentItem.id != null;

    const handleOpenModalForAdd = () => {
        setCurrentItem(initialItemState);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (item: InventoryItem) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({
            ...prev,
            [name]: (name === 'stock' || name === 'lowStockThreshold') ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem.name) {
            alert("Please provide an item name.");
            return;
        }

        if (isEditing) {
            dispatch({
                type: 'UPDATE_INVENTORY_ITEM',
                payload: currentItem as InventoryItem,
            });
        } else {
            dispatch({
                type: 'ADD_INVENTORY_ITEM',
                payload: {
                    ...currentItem,
                    id: `i-${Date.now()}`,
                } as InventoryItem,
            });
        }
        handleCloseModal();
    };

    return (
        <div>
            <div className="mb-6 flex justify-end">
                <Button onClick={handleOpenModalForAdd}>Add New Inventory Item</Button>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Low Stock Threshold</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {inventory.map(item => (
                            <tr key={item.id} onClick={() => handleOpenModalForEdit(item)} className={`cursor-pointer hover:bg-gray-700/50 transition-colors ${item.stock <= item.lowStockThreshold ? 'bg-red-900/30' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-bold">{item.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.unit}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.lowStockThreshold}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit Inventory Item" : "Add New Inventory Item"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input type="text" name="name" id="name" value={currentItem.name} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Stock</label>
                            <input type="number" name="stock" id="stock" value={currentItem.stock} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" min="0" required />
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-300">Unit</label>
                            <select name="unit" id="unit" value={currentItem.unit} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" required>
                                <option value="units">units</option>
                                <option value="kg">kg</option>
                                <option value="liters">liters</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-300">Low Stock Threshold</label>
                        <input type="number" name="lowStockThreshold" id="lowStockThreshold" value={currentItem.lowStockThreshold} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" min="0" required />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit">Save Item</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// --- Reservations Manager ---
const ReservationsManager = () => {
    const { reservations } = useRestaurantState();
    const dispatch = useRestaurantDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const initialReservationState: Omit<Reservation, 'id'> = {
        guestName: '',
        partySize: 1,
        time: '',
        notes: '',
    };
    
    const [newReservation, setNewReservation] = useState(initialReservationState);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewReservation(initialReservationState); // Reset form on close
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReservation(prev => ({
            ...prev,
            [name]: name === 'partySize' ? parseInt(value, 10) || 1 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReservation.guestName || !newReservation.time) {
            alert("Guest name and time are required.");
            return;
        }

        dispatch({
            type: 'ADD_RESERVATION',
            payload: {
                ...newReservation,
                id: `r-${Date.now()}`,
            },
        });

        handleCloseModal();
    };

    return (
        <div>
            <div className="mb-6 flex justify-end">
                <Button onClick={() => setIsModalOpen(true)}>Add New Reservation</Button>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Guest Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Party Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {reservations.map(res => (
                            <tr key={res.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-bold">{res.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{res.guestName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{res.partySize}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">{res.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Reservation">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="guestName" className="block text-sm font-medium text-gray-300">Guest Name</label>
                            <input type="text" name="guestName" id="guestName" value={newReservation.guestName} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" required />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-300">Time</label>
                            <input type="time" name="time" id="time" value={newReservation.time} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="partySize" className="block text-sm font-medium text-gray-300">Party Size</label>
                        <input type="number" name="partySize" id="partySize" value={newReservation.partySize} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2" min="1" required />
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notes</label>
                        <textarea name="notes" id="notes" value={newReservation.notes} onChange={handleInputChange} rows={3} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button type="submit">Save Reservation</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};


type Tab = 'menu' | 'inventory' | 'reservations';

const Management = () => {
    const [activeTab, setActiveTab] = useState<Tab>('menu');

    const renderContent = () => {
        switch (activeTab) {
            case 'menu': return <MenuManager />;
            case 'inventory': return <InventoryManager />;
            case 'reservations': return <ReservationsManager />;
            default: return null;
        }
    };

    const TabButton: React.FC<{tabName: Tab, label: string}> = ({tabName, label}) => (
        <button 
            onClick={() => setActiveTab(tabName)} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            {label}
        </button>
    );

    return (
        <div>
            <Header title="Management" />
            <div className="mb-6 flex space-x-2 border-b border-gray-700 pb-2">
                <TabButton tabName="menu" label="Menu" />
                <TabButton tabName="inventory" label="Inventory" />
                <TabButton tabName="reservations" label="Reservations" />
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default Management;