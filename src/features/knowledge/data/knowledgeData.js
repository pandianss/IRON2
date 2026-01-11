export const WORKOUTS = [
    {
        id: 'iron-proto-1',
        title: 'The Iron Protocol',
        category: 'Strength',
        difficulty: 'Advanced',
        image: 'https://images.unsplash.com/photo-1517963879466-e9b5ce382d5d?q=80&w=1470&auto=format&fit=crop',
        summary: 'The signature strength program of the Forge. Focuses on compound lifts and progressive overload.',
        duration: '75-90 min',
        frequency: '4x / week',
        videoUrl: 'https://www.youtube.com/embed/biodT65e78k?si=1', // Placeholder workout video
        instructions: [
            { step: 1, title: 'Squat', description: 'Warm up with empty bar. Perform 5 sets of 5 reps, increasing weight each set.' },
            { step: 2, title: 'Bench Press', description: 'Keep elbows tucked at 45 degrees. 5 sets of 5 reps. Control the descent.' },
            { step: 3, title: 'Barbell Row', description: 'Pull to sternum/lower chest. Keep back flat. 5 sets of 5 reps.' }
        ]
    },
    {
        id: 'mobility-found',
        title: 'Mobility Foundations',
        category: 'Recovery',
        difficulty: 'All Levels',
        image: 'https://images.unsplash.com/photo-1552674605-46d5267761ce?q=80&w=1470&auto=format&fit=crop',
        summary: 'Essential daily mobility routine to maintain joint health and prevent injury.',
        duration: '15 min',
        frequency: 'Daily'
    }
];

export const DIETS = [
    {
        id: 'perf-fuel',
        title: 'Performance Fuel',
        category: 'Balanced',
        difficulty: 'Moderate',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
        summary: 'Optimized macronutrient balance for high-performance athletes.',
        tags: ['High Protein', 'Carb Cycling']
    },
    {
        id: 'metabolic-reset',
        title: 'Metabolic Reset',
        category: 'Fat Loss',
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1470&auto=format&fit=crop',
        summary: 'Whole-food based approach to reset insulin sensitivity and shed body fat.',
        tags: ['Clean Eating', 'Anti-Inflammatory']
    }
];
