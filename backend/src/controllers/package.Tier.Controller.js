import tiers from "../../store/package.Tiers.js";

export const getPackageTiers = (req, res) => {  
    if (tiers.length === 0) {
        return res.status(404).json({
            success: false,
            message: "no package tiers found"
        });
    }
    const packageTiers = tiers.map(tier => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        features: tier.features
    }));
    res.json(packageTiers);
};

// export const editPackageTier = (req, res) => {
//     const { price, features } = req.body;
//     try {
        
//     } catch (error) {
        
//     }
// }

export default {
    getPackageTiers,
    editPackageTier
};