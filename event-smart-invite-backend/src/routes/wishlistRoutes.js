const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishListControler');

router.post('/', wishlistController.addWish);
router.get('/:inviteId', wishlistController.getWishlistByInvite);
router.get('/', wishlistController.getAllWishlist);
router.put('/:id', wishlistController.updateWish);
router.delete('/:id', wishlistController.deleteWish);

module.exports = router;
