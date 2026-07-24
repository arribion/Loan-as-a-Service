
// GENERAL SETTINGS
const update_tenant = async (req, res) => { 
    const { id } = req.params;
    const { name, Business_Name, Email, Phone, Timezone,logo } = req.body;
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const delete_tenant = async (req, res) => {
    const { id } = req.params;
    try { 

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}