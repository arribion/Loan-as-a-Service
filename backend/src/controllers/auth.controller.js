

const register_tenant = (req, res) => {
    const { business_name, email, password } = req.body;
    try {
        if (!business_name || !email || !password) {
            res.status(401).json({
                success: false,
                message: "all fields are required"
            });
        }
    } catch (error) {
         res.status(500).json({
           success: false,
             message: "all fields are required",
           error
         });
    }
}

const login_tenant = (req, res) => {
    try {
        
    } catch (error) {
         res.status(500).json({
           success: false,
           message: "all fields are required",
           error,
         });
    }
}

const logout_tenant = (req, res) => {
  try {
    
  } catch (error) {
     res.status(500).json({
       success: false,
       message: "all fields are required",
       error,
     });
  }
}

export default {
    register_tenant,
    login_tenant,
    logout_tenant
}