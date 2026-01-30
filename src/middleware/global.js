/**
 * Helper function to get the current greeting based on the time of day.
 */
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return 'Good Morning!';
    }

    if (currentHour < 18) {
        return 'Good Afternoon!';
    }

    return 'Good Evening!';
};

/**
 * Middleware to add local variables to res.locals for use in all templates.
 * Templates can access these values but are not required to use them.
 */
const addLocalVariables = (req, res, next) => {
    // Set current year for use in templates
    res.locals.currentYear = new Date().getFullYear();

    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Make req.query available to all templates
    res.locals.queryParams = { ...req.query };

    // Set greeting based on time of day (plain text)
    res.locals.greeting = getCurrentGreeting();

    // Determine a seasonal greeting string for the header
    const month = new Date().getMonth(); // 0-11
    let seasonGreeting;
    if (month >= 2 && month <= 4) {
        seasonGreeting = 'Happy Spring!';
    } else if (month >= 5 && month <= 7) {
        seasonGreeting = 'Enjoy your Summer!';
    } else if (month >= 8 && month <= 10) {
        seasonGreeting = 'Welcome to Fall!';
    } else {
        seasonGreeting = 'Happy Holidays!';
    }
    res.locals.seasonGreeting = seasonGreeting;

    // Randomly assign a theme class to the body
    const themes = ['blue-theme', 'green-theme', 'red-theme', 'purple-theme', 'orange-theme'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

    next();
};

export { addLocalVariables };