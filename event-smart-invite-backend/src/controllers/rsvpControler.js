const db = require('../config/db');

exports.repondreRSVP = async (req, res) => {
    const { code_unique } = req.params;
    const { reponse } = req.body; // 'oui' ou 'non'

    if (!['oui', 'non'].includes(reponse)) {
        return res.status(400).json({ message: "Réponse invalide." });
    }

    try {
        // 1) Récupérer l'invitation
        const [inviteResult] = await db.query(
            "SELECT id FROM invitation_links WHERE code_unique = ?",
            [code_unique]
        );

        if (inviteResult.length === 0) {
            return res.status(404).json({ message: "Invitation introuvable." });
        }

        const invitationId = inviteResult[0].id;

        // 2) Vérifier si RSVP existe déjà
        const [existing] = await db.query(
            "SELECT id FROM rsvp WHERE invitation_id = ?",
            [invitationId]
        );

        if (existing.length > 0) {
            // mise à jour
            await db.query(
                "UPDATE rsvp SET reponse=?, date_reponse=NOW() WHERE invitation_id=?",
                [reponse, invitationId]
            );
        } else {
            // création
            await db.query(
                "INSERT INTO rsvp (invitation_id, reponse, date_reponse) VALUES (?, ?, NOW())",
                [invitationId, reponse]
            );
        }

        return res.json({
            message: "RSVP enregistré avec succès.",
            reponse
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
