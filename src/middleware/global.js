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
 * Express middleware that adds head asset management functionality to routes.
 * Provides arrays for storing CSS and JS assets with priority support.
 * 
 * Adds these methods to the response object:
 * - res.addStyle(css, priority) - Add CSS/link tags to head
 * - res.addScript(js, priority) - Add script tags 
 * 
 * Adds these functions to EJS templates via res.locals:
 * - renderStyles() - Outputs all CSS in priority order (high to low)
 * - renderScripts() - Outputs all JS in priority order (high to low)
 */
const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    // These functions will be available in EJS templates
    res.locals.renderStyles = () => {
        return res.locals.styles
            // Sort by priority: higher numbers load first
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts
            // Sort by priority: higher numbers load first
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };
};

/**
 * Middleware to add local variables to res.locals for use in all templates.
 * Templates can access these values but are not required to use them.
 */
const addLocalVariables = (req, res, next) => {

    // Enable head asset management for every response
    setHeadAssetsFunctionality(res);

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