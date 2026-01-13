"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../app/modules/Registration/user.model");
const defaultUsers = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        phone: "+1234567890",
        role: "admin",
        address: "Admin Address",
        isPremium: false,
        isDeleted: false,
        isBlock: false,
        followers: [],
        following: [],
    },
    {
        name: "Regular User",
        email: "user@example.com",
        password: "password123",
        phone: "+1234567891",
        role: "user",
        address: "User Address",
        isPremium: false,
        isDeleted: false,
        isBlock: false,
        followers: [],
        following: [],
    },
];
function seedDefaultUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect("mongodb+srv://sportFacility:eE8vmF9Tq8ebFt5s@cluster0.eep6yze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
            console.log("Connected to MongoDB");
            console.log("\n🔐 Creating default users...\n");
            for (const userData of defaultUsers) {
                // Check if user already exists
                const existingUser = yield user_model_1.UserRegModel.findOne({ email: userData.email });
                if (existingUser) {
                    // Update password if user exists
                    yield user_model_1.UserRegModel.updateOne({ email: userData.email }, {
                        password: userData.password, // Store as plain text (as per current system)
                        role: userData.role,
                        name: userData.name,
                        phone: userData.phone,
                        address: userData.address,
                        isDeleted: false,
                        isBlock: false
                    });
                    console.log(`✅ Updated existing ${userData.role}: ${userData.email}`);
                }
                else {
                    // Create new user
                    const newUser = yield user_model_1.UserRegModel.create(userData);
                    console.log(`✅ Created new ${userData.role}: ${userData.email}`);
                }
            }
            console.log("\n📋 Default User Credentials:");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("👤 ADMIN USER:");
            console.log("   Email:    admin@example.com");
            console.log("   Password: password123");
            console.log("   Role:     admin");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("👤 REGULAR USER:");
            console.log("   Email:    user@example.com");
            console.log("   Password: password123");
            console.log("   Role:     user");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("\n✅ Default users ready for use!");
            console.log("💡 Use these credentials to login and test the API.\n");
            process.exit(0);
        }
        catch (error) {
            console.error("❌ Error seeding default users:", error);
            if (error.code === 11000) {
                console.log("Some users already exist. Updated their passwords.");
            }
            process.exit(1);
        }
    });
}
seedDefaultUsers();
