export const EMAIL_SUBJECTS = {
  INVITATION: 'You are invited to join FabricFlow',
} as const;

type InvitationEmailContentInput = {
  inviteLink: string;
  roleName: string;
  expiresAt: string;
};

export const buildInvitationEmailContent = (input: InvitationEmailContentInput) => {
  const { inviteLink, roleName, expiresAt } = input;

  const text = [
    'You have been invited to join FabricFlow.',
    `Assigned role: ${roleName}`,
    `Invitation expires at: ${expiresAt}`,
    '',
    'Use the link below to accept the invitation:',
    inviteLink,
  ].join('\n');

  const html = `
    <p>You have been invited to join <strong>FabricFlow</strong>.</p>
    <p><strong>Assigned role:</strong> ${roleName}</p>
    <p><strong>Invitation expires at:</strong> ${expiresAt}</p>
    <p>Use the link below to accept the invitation:</p>
    <p><a href="${inviteLink}">${inviteLink}</a></p>
  `;

  return {
    subject: EMAIL_SUBJECTS.INVITATION,
    text,
    html,
  };
};
