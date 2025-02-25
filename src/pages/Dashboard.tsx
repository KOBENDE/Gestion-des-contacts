import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, LogOut, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useContactStore } from '../store/contactStore';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  group_id?: string;
}

export default function Dashboard() {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [newGroup, setNewGroup] = useState({ name: '' });

  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);
  const { contacts, groups, addContact, updateContact, deleteContact, addGroup } =
    useContactStore();

  const filteredContacts = selectedGroup === 'all'
    ? contacts
    : contacts.filter(contact => contact.group_id === selectedGroup);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentContact) {
      updateContact(currentContact.id, newContact);
    } else {
      addContact(newContact);
    }
    setIsContactModalOpen(false);
    setCurrentContact(null);
    setNewContact({ first_name: '', last_name: '', email: '', phone: '' });
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGroup(newGroup.name);
    setIsGroupModalOpen(false);
    setNewGroup({ name: '' });
  };

  const handleEditContact = (contact: Contact) => {
    setCurrentContact(contact);
    setNewContact(contact);
    setIsContactModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestionnaire de Contacts</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-gray-200"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="flex justify-between mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={20} />
              Nouveau Contact
            </button>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
            >
              <Users size={20} />
              Nouveau Groupe
            </button>
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border rounded-md px-4"
          >
            <option value="all">Tous les contacts</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">
                  {contact.first_name} {contact.last_name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{contact.email}</p>
              <p className="text-gray-600">{contact.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour ajouter/éditer un contact */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {currentContact ? 'Modifier le contact' : 'Nouveau contact'}
            </h2>
            <form onSubmit={handleContactSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={newContact.first_name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, first_name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={newContact.last_name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, last_name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Groupe
                </label>
                <select
                  value={newContact.group_id || ''}
                  onChange={(e) =>
                    setNewContact({ ...newContact, group_id: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Aucun groupe</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsContactModalOpen(false);
                    setCurrentContact(null);
                    setNewContact({
                      first_name: '',
                      last_name: '',
                      email: '',
                      phone: '',
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentContact ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour ajouter un groupe */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Nouveau groupe</h2>
            <form onSubmit={handleGroupSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsGroupModalOpen(false);
                    setNewGroup({ name: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}