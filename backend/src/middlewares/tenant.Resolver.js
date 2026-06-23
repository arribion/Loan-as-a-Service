export const tenantResolver = (req, res, next) => {
  const tenantHeader = req.headers["x-tenant-id"];
  if (!tenantHeader) {
    return res
      .status(400)
      .json(
        { error: "Missing tenant identification context." }
      );
  }
  // Inject it into the req object for controllers to read
  req.tenant_id = tenantHeader;
  next();
};
export default tenantResolver