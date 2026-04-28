const db = require('../config/db');
const QRCode = require('qrcode');

const InvitationLink = {};

InvitationLink.create = async (inviteId) => {
    const codeUnique = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = `https://event-smart-invite.com/invite/${codeUnique}`;
    
    const qrCodeData = await QRCode.toDataURL(url);
    const connection = await db;
    const [result] = await connection.query(
        'INSERT INTO invitation_links (invite_id, code_unique, url, qr_code_path) VALUES (?, ?, ?, ?)',
        [inviteId, codeUnique, url, qrCodeData]
    );
    
    return { id: result.insertId, codeUnique, url, qrCode: qrCodeData };
};

InvitationLink.getByCode = async (codeUnique) => {
    const connection = await db;
    const [rows] = await connection.query('SELECT * FROM invitation_links WHERE code_unique = ?', [codeUnique]);
    return rows[0];
};

module.exports = InvitationLink;