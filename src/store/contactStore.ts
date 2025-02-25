import { create } from 'zustand';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  group_id?: string;
}

interface Group {
  id: string;
  name: string;
}

interface ContactState {
  contacts: Contact[];
  groups: Group[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addGroup: (name: string) => void;
}

export const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  groups: [],
  addContact: (contact) =>
    set((state) => ({
      contacts: [
        ...state.contacts,
        { ...contact, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateContact: (id, updatedContact) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...updatedContact } : contact
      ),
    })),
  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    })),
  addGroup: (name) =>
    set((state) => ({
      groups: [
        ...state.groups,
        { id: Math.random().toString(36).substr(2, 9), name },
      ],
    })),
}));