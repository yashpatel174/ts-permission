const isAdmin = (req, res, next) => {
    if (req.user?.role === "admin") {
        return next();
    }
    else {
        return res
            .status(403)
            .send({ message: "Only admin can access this route." });
    }
};
export default isAdmin;
