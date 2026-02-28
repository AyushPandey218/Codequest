/**
 * Achievement Definitions
 * 
 * Each achievement has:
 * - id: unique string
 * - name: display name
 * - description: how it's earned
 * - icon: material symbol name
 * - color: tailwind color class for the icon/bg
 * - criteria: function that takes (userData, userProgress, moduleProgress) and returns boolean
 */

export const achievements = [
    {
        id: 'profile_100',
        name: 'Profile Perfectionist',
        description: 'Complete your profile 100% (Add bio, university, and website)',
        icon: 'how_to_reg',
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        criteria: (stats) => stats.profileCompleted === true
    },
    {
        id: 'first_quest',
        name: 'Code Initiate',
        description: 'Complete your first coding quest',
        icon: 'rocket_launch',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        criteria: (stats) => stats.completedQuests >= 1
    },
    {
        id: 'quest_master_5',
        name: 'Algorithm Apprentice',
        description: 'Complete 5 different quests',
        icon: 'psychology',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        criteria: (stats) => stats.completedQuests >= 5
    },
    {
        id: 'quest_master_10',
        name: 'Logic Architect',
        description: 'Complete 10 different quests',
        icon: 'architecture',
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        criteria: (stats) => stats.completedQuests >= 10
    },
    {
        id: 'quest_master_all',
        name: 'Quest Legend',
        description: 'Complete all available quests',
        icon: 'workspace_premium',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        criteria: (stats) => stats.completedQuests >= stats.totalQuests && stats.totalQuests > 0
    },
    {
        id: 'level_5',
        name: 'Power User',
        description: 'Reach Level 5',
        icon: 'trending_up',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        criteria: (stats) => stats.level >= 5
    },
    {
        id: 'level_10',
        name: 'Elite Coder',
        description: 'Reach Level 10',
        icon: 'star',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        criteria: (stats) => stats.level >= 10
    },
    {
        id: 'streak_3',
        name: 'Consistent Coder',
        description: 'Maintain a 3-day coding streak',
        icon: 'local_fire_department',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        criteria: (stats) => stats.streak >= 3
    },
    {
        id: 'module_master',
        name: 'Project Finisher',
        description: 'Complete 1 full project module',
        icon: 'inventory_2',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10',
        criteria: (stats) => stats.completedModules >= 1
    },
    {
        id: 'expert_solver',
        name: 'Expert Solver',
        description: 'Solve your first Expert-level quest',
        icon: 'diamond',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        criteria: (stats) => stats.expertQuests >= 1
    },
    {
        id: 'web_dev_3',
        name: 'Web Architect',
        description: 'Complete 3 Web Development quests',
        icon: 'html',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        criteria: (stats) => stats.webQuests >= 3
    },
    {
        id: 'data_wizard_3',
        name: 'Data Wizard',
        description: 'Complete 3 Data Analysis quests',
        icon: 'query_stats',
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
        criteria: (stats) => stats.dataQuests >= 3
    },
    {
        id: 'algo_expert_5',
        name: 'Algorithm Master',
        description: 'Complete 5 Algorithm & DSA quests',
        icon: 'account_tree',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        criteria: (stats) => stats.algoQuests >= 5
    },
    {
        id: 'polyglot_2',
        name: 'Polyglot Coder',
        description: 'Solve quests using 2 different languages',
        icon: 'translate',
        color: 'text-teal-500',
        bgColor: 'bg-teal-500/10',
        criteria: (stats) => stats.languagesUsed >= 2
    },
    {
        id: 'xp_1000',
        name: 'XP Thousandnaire',
        description: 'Earn a total of 1,000 XP',
        icon: 'toll',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        criteria: (stats) => stats.totalXP >= 1000
    },
    {
        id: 'xp_5000',
        name: 'XP Elite',
        description: 'Earn a total of 5,000 XP',
        icon: 'military_tech',
        color: 'text-purple-600',
        bgColor: 'bg-purple-600/10',
        criteria: (stats) => stats.totalXP >= 5000
    },
    {
        id: 'streak_7',
        name: 'Unstoppable',
        description: 'Maintain a 7-day coding streak',
        icon: 'electric_bolt',
        color: 'text-orange-600',
        bgColor: 'bg-orange-600/10',
        criteria: (stats) => stats.streak >= 7
    }
]

export const getAchievementById = (id) => achievements.find(a => a.id === id)
