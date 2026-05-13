const shouldExposePasswordResetLink = (env = process.env) =>
    env.EXPOSE_PASSWORD_RESET_LINK === 'true';

module.exports = {
    shouldExposePasswordResetLink,
};
