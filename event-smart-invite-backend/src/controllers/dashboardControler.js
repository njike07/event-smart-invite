const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1️⃣ RSVPs
        const [rsvpRows] = await db.query(`
            SELECT reponse, COUNT(*) as total
            FROM rsvp
            GROUP BY reponse
        `);

        // 2️⃣ Invités présents (QR scan)
        const [presentRows] = await db.query(`
            SELECT COUNT(*) as total_present
            FROM places_invitations
            WHERE statut = 'arrive'
        `);

        // 3️⃣ Invités par catégorie
        const [categorieRows] = await db.query(`
            SELECT categorie, COUNT(*) as total
            FROM invites
            GROUP BY categorie
        `);

        // 4️⃣ Total invités
        const [totalInvites] = await db.query(`
            SELECT COUNT(*) as total
            FROM invites
        `);

        res.json({
            rsvp: rsvpRows,
            presents: presentRows[0].total_present,
            categories: categorieRows,
            totalInvites: totalInvites[0].total
        });

    } catch (error) {
        console.error("Erreur getDashboardStats :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};
