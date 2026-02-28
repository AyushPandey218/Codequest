import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { quests, questDetails } from '../data/quests.js';
import { modules } from '../data/modules.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env.local');

// Simple env parser
const loadEnv = () => {
    const env = {};
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
    }
    return env;
};

const env = loadEnv();

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey) {
    console.error('❌ Error: Firebase API Key not found in .env.local');
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const migrateData = async () => {
    console.log('🚀 Starting migration for project:', firebaseConfig.projectId);

    try {
        // 1. Migrate Quests (Full details)
        console.log('📝 Migrating quests...');
        for (const [id, details] of Object.entries(questDetails)) {
            const dataToSet = { ...details };

            if (details.type === 'debugging' || details.category === 'debugging') {
                if (!dataToSet.debugData) {
                    dataToSet.debugData = {
                        code: "def calculate_average(numbers):\n    total = 0\n    if len(numbers) > 0:  # BUG 1\n        return 0\n    \n    for num in numbers:\n        total += int(num  # BUG 2\n    \n    average = total / len(numbers)\n    \n    result = str(average)\n    return result",
                        bugs: [
                            { id: 1, line: 3, type: 'Logic Error', hint: 'Check the comparison operator', description: 'Should use >= instead of >' },
                            { id: 2, line: 7, type: 'Syntax Error', hint: 'Missing closing parenthesis', description: 'Add ) at the end' },
                            { id: 3, line: 12, type: 'Type Error', hint: 'Variable type mismatch', description: 'Convert string to integer' }
                        ]
                    };
                }
            }

            await setDoc(doc(db, 'quests', id), {
                ...dataToSet,
                updatedAt: new Date().toISOString()
            });
            console.log(`✅ Migrated full quest details: ${id}`);
        }

        // 2. Migrate Modules
        console.log('📦 Migrating modules...');
        for (const module of modules) {
            await setDoc(doc(db, 'modules', module.id.toString()), {
                ...module,
                updatedAt: new Date().toISOString()
            });
            console.log(`✅ Migrated module: ${module.title}`);
        }

        // 3. Create Default Users (Documents only, Auth must be created via UI)
        console.log('👤 Creating default user profiles...');
        const defaultUsers = [
            {
                uid: 'demo_user_placeholder', // Note: Auth will generate real UIDs
                username: 'DemoExplorer',
                email: 'demo@codequest.com',
                role: 'user',
                xp: 1250,
                level: 5,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
                createdAt: new Date().toISOString()
            },
            {
                uid: 'admin_user_placeholder',
                username: 'SystemAdmin',
                email: 'admin@codequest.com',
                role: 'admin',
                xp: 9999,
                level: 99,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
                createdAt: new Date().toISOString()
            }
        ];

        for (const userProfile of defaultUsers) {
            // We use the email as the doc ID for these placeholders to make them easy to find/link
            await setDoc(doc(db, 'users', userProfile.email.replace(/[@.]/g, '_')), userProfile);
            console.log(`✅ Created profile placeholder for: ${userProfile.email}`);
        }

        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateData();
