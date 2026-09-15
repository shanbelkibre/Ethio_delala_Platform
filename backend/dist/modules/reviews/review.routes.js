"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
router.get('/', review_controller_1.ReviewController.getPublicReviews);
router.get('/public', review_controller_1.ReviewController.getPublicReviews);
exports.default = router;
