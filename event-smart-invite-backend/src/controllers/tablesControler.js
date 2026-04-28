const db = require('../config/db');

// 📌 Créer une table
exports.createTable = async (req, res) => {
    const { nom_table, capacite } = req.body;

    try {
        await db.query(
            "INSERT INTO tables_reception (nom_table, capacite) VALUES (?, ?)",
            [nom_table, capacite]
        );
        res.status(201).json({ message: "Table créée avec succès" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// 📌 Lister toutes les tables
exports.getTables = async (req, res) => {
    try {
        const [tables] = await db.query("SELECT * FROM tables_reception");

        // On ajoute les invités pour chaque table
        for (let table of tables) {
            const [invites] = await db.query(`
                SELECT i.id, i.nom, i.prenom, p.numero_chaise 
                FROM places_invitations p 
                JOIN invites i ON i.id = p.invite_id 
                WHERE p.table_id = ?
            `, [table.id]);

            table.invites = invites;
        }

        res.json(tables);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// 📌 Assigner un invité à une table
exports.assignInvite = async (req, res) => {
    const { invite_id, table_id, numero_chaise } = req.body;

    try {
        await db.query(
            "INSERT INTO places_invitations (invite_id, table_id, numero_chaise) VALUES (?, ?, ?)",
            [invite_id, table_id, numero_chaise]
        );

        res.status(201).json({ message: "Invité assigné à la table" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur d'assignation" });
    }
};

// 📌 Modifier la place d’un invité
exports.updateSeat = async (req, res) => {
    const { invite_id } = req.params;
    const { table_id, numero_chaise } = req.body;

    try {
        await db.query(
            "UPDATE places_invitations SET table_id = ?, numero_chaise = ? WHERE invite_id = ?",
            [table_id, numero_chaise, invite_id]
        );

        res.json({ message: "Place modifiée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// 📌 Retirer un invité d’une table
exports.removeInvite = async (req, res) => {
    const { invite_id } = req.params;

    try {
        await db.query("DELETE FROM places_invitations WHERE invite_id = ?", [invite_id]);

        res.json({ message: "Invité retiré de la table" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// 📌 Scan QR → voir la place
exports.getSeatByQr = async (req, res) => {
    const { code_unique } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT i.nom, i.prenom, t.nom_table, p.numero_chaise
            FROM invitation_links l
            JOIN invites i ON i.id = l.invite_id
            LEFT JOIN places_invitations p ON p.invite_id = i.id
            LEFT JOIN tables_reception t ON t.id = p.table_id
            WHERE l.code_unique = ?
        `, [code_unique]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "QR code invalide" });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// 📌 Confirmer la présence
exports.markArrived = async (req, res) => {
    const { invite_id } = req.params;

    try {
        await db.query(
            "UPDATE places_invitations SET statut = 'arrive' WHERE invite_id = ?",
            [invite_id]
        );

        res.json({ message: "Invité marqué comme arrivé" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
