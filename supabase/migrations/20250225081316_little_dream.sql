/*
  # Schéma de l'application de gestion des contacts

  1. Nouvelles Tables
    - `profiles`
      - `id` (uuid, clé primaire) - ID de l'utilisateur
      - `email` (text) - Email de l'utilisateur
      - `created_at` (timestamp) - Date de création
      
    - `groups`
      - `id` (uuid, clé primaire) - ID du groupe
      - `name` (text) - Nom du groupe
      - `user_id` (uuid) - ID de l'utilisateur propriétaire
      - `created_at` (timestamp) - Date de création
      
    - `contacts`
      - `id` (uuid, clé primaire) - ID du contact
      - `first_name` (text) - Prénom
      - `last_name` (text) - Nom
      - `email` (text) - Email
      - `phone` (text) - Téléphone
      - `user_id` (uuid) - ID de l'utilisateur propriétaire
      - `created_at` (timestamp) - Date de création
      
    - `contact_groups`
      - `contact_id` (uuid) - ID du contact
      - `group_id` (uuid) - ID du groupe
      
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour permettre aux utilisateurs de gérer leurs propres données
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create groups table
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own groups" ON groups
  USING (auth.uid() = user_id);

-- Create contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own contacts" ON contacts
  USING (auth.uid() = user_id);

-- Create contact_groups junction table
CREATE TABLE contact_groups (
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, group_id)
);

ALTER TABLE contact_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage contact groups" ON contact_groups
  USING (
    EXISTS (
      SELECT 1 FROM contacts c
      WHERE c.id = contact_id AND c.user_id = auth.uid()
    )
  );