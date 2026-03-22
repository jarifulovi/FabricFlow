-- ============================================================
-- Migration: 011_create_invitations_table.sql
-- Description: Create invitations table for invitation-based OAuth

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partial unique index: only one active (pending) invite per email
CREATE UNIQUE INDEX unique_active_invite_per_email
ON invitations (email)
WHERE accepted_at IS NULL;

-- Comments
COMMENT ON TABLE invitations IS 'Stores invitation tokens for invitation-based OAuth.';
COMMENT ON COLUMN invitations.email IS 'Email address of the invitee.';
COMMENT ON COLUMN invitations.role_id IS 'Role to assign to the invited user.';
COMMENT ON COLUMN invitations.token_hash IS 'Hashed invitation token.';
COMMENT ON COLUMN invitations.expires_at IS 'Expiration timestamp for the invitation.';
COMMENT ON COLUMN invitations.accepted_at IS 'Timestamp when the invitation was accepted.';
COMMENT ON COLUMN invitations.created_by IS 'User who created the invitation.';
COMMENT ON COLUMN invitations.created_at IS 'Timestamp when the invitation was created.';
