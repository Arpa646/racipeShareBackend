"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropUniqueReviewIndex = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bookId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Create a non-unique index for performance (allows multiple reviews per user per book)
// This explicitly allows users to create multiple reviews for the same book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: false });
const ReviewModel = mongoose_1.default.model("Review", reviewSchema);
// Function to drop the unique index if it exists
// Call this once after connecting to MongoDB
const dropUniqueReviewIndex = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const indexes = yield ReviewModel.collection.indexes();
        const uniqueIndex = indexes.find((idx) => {
            var _a, _b;
            return ((_a = idx.key) === null || _a === void 0 ? void 0 : _a.userId) === 1 &&
                ((_b = idx.key) === null || _b === void 0 ? void 0 : _b.bookId) === 1 &&
                idx.unique === true;
        });
        if (uniqueIndex) {
            const indexName = uniqueIndex.name;
            if (indexName) {
                yield ReviewModel.collection.dropIndex(indexName);
                console.log('✅ Dropped unique index on userId and bookId. Users can now create multiple reviews for the same book.');
                return;
            }
        }
        // Try dropping by the standard index name if not found above
        try {
            yield ReviewModel.collection.dropIndex('userId_1_bookId_1');
            console.log('✅ Dropped unique index on userId and bookId. Users can now create multiple reviews for the same book.');
        }
        catch (dropError) {
            if (dropError.code === 27 || dropError.codeName === 'IndexNotFound') {
                console.log('ℹ️  No unique index found - users can already create multiple reviews per book.');
            }
            else {
                throw dropError;
            }
        }
    }
    catch (error) {
        // Index might not exist or already dropped
        if (error.code === 27 || error.codeName === 'IndexNotFound') {
            console.log('ℹ️  Unique index not found (already removed or never existed).');
        }
        else {
            console.error('⚠️  Error checking/dropping index:', error.message);
        }
    }
});
exports.dropUniqueReviewIndex = dropUniqueReviewIndex;
exports.default = ReviewModel;
