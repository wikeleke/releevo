const express = require('express');
const protect = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
    listMine,
    createList,
    getOne,
    renameList,
    deleteList,
    addBusiness,
    removeBusiness,
} = require('../controllers/watchlistController');

const router = express.Router();

router.use(protect);
router.use(roleCheck(['buyer', 'admin']));

router.get('/', listMine);
router.post('/', createList);
router.get('/:id', getOne);
router.patch('/:id', renameList);
router.delete('/:id', deleteList);
router.post('/:id/items', addBusiness);
router.delete('/:id/items/:businessId', removeBusiness);

module.exports = router;
