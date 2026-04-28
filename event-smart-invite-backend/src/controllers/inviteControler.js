const Invite = require('../models/invitemodel');
const InvitationLink = require('../models/invitationLinkModel');

const InviteController = {};

InviteController.addInvite = async (req, res) => {
    try {
        const invite = await Invite.create(req.body);
        const link = await InvitationLink.create(invite.insertId);
        
        res.status(201).json({ 
            message: 'Invité ajouté', 
            inviteId: invite.insertId,
            codeUnique: link.codeUnique,
            url: link.url,
            qrCode: link.qrCode
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

InviteController.getAllInvites = async (req, res) => {
    try {
        const invites = await Invite.getAll();
        res.json(invites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

InviteController.getInviteById = async (req, res) => {
    try {
        const invite = await Invite.getById(req.params.id);
        res.json(invite);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

InviteController.updateInvite = async (req, res) => {
    try {
        await Invite.update(req.params.id, req.body);
        res.json({ message: 'Invité mis à jour' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

InviteController.deleteInvite = async (req, res) => {
    try {
        await Invite.delete(req.params.id);
        res.json({ message: 'Invité supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

InviteController.updateRSVP = async (req, res) => {
    try {
        const { rsvp } = req.body;
        const validOptions = ['Oui', 'Non'];
        if (!validOptions.includes(rsvp)) {
            return res.status(400).json({ error: 'Valeur RSVP invalide' });
        }
        await Invite.update(req.params.id, { rsvp });
        res.json({ message: `RSVP mis à jour : ${rsvp}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = InviteController;