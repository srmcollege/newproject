/*
  # Create family members table

  1. New Tables
    - `family_members`
      - `id` (uuid, primary key)
      - `primary_user_id` (uuid, foreign key to users - family head)
      - `member_user_id` (uuid, foreign key to users - family member)
      - `relationship` (text) - spouse, child, parent, sibling
      - `permissions` (jsonb) - array of permissions
      - `spending_limit` (decimal) - monthly spending limit
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `family_members` table
    - Add policies for family management
*/

CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship text NOT NULL CHECK (relationship IN ('spouse', 'child', 'parent', 'sibling')),
  permissions jsonb DEFAULT '[]'::jsonb,
  spending_limit decimal(15,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(primary_user_id, member_user_id)
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own family"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (primary_user_id = auth.uid() OR member_user_id = auth.uid());

CREATE POLICY "Primary users can manage family"
  ON family_members
  FOR ALL
  TO authenticated
  USING (primary_user_id = auth.uid());

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_family_members_primary_user ON family_members(primary_user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_member_user ON family_members(member_user_id);