// const authorizedRoles = ["admin", "staff", "member"];

const roleChecker = (...auth_roles) => {
    const userRole = req.user.role;
    if (!authorizedRoles.includes(userRole)) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Insufficient permissions"
        });
    }
    next();
};
export default roleChecker;