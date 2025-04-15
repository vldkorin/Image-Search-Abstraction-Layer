import express from 'express';
import { searchImages, getRecentSearches } from '../controllers/searchController.js';

const router = express.Router();

router.get('/search', searchImages);

router.get('/recent', getRecentSearches);

export default router;