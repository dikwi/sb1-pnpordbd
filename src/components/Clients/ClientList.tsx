import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Client, ClientForm } from './ClientForm';
import { Users, Pencil, Trash2, Plus } from 'lucide-react';

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await supabase.from('clients').delete().eq('id', id);
        setClients(clients.filter((client) => client.id !== id));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedClient(undefined);
    fetchClients();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Clients</h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </button>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {clients.map((client) => (
            <li key={client.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-600 truncate">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.company}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                  <p className="text-sm text-gray-500">{client.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => client.id && handleDelete(client.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {clients.length === 0 && (
            <li className="px-4 py-8 sm:px-6">
              <div className="text-center text-gray-500">No clients found</div>
            </li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <ClientForm
              onSuccess={handleSuccess}
              initialData={selectedClient}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedClient(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}