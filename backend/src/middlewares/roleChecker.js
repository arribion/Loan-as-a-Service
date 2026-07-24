// const authorizedRoles = ["admin", "staff", "member"];

const roleChecker = (...auth_roles) => {
    return (req, res, next) => {
        if(!auth_roles.includes(req.user.user_type)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Insufficient permissions"
            });
        }
        next();
    };
};
export default roleChecker;