const add_member = async (req, res) => { 
    const { tenant_id } = req.params;
    const { full_name, email_address, security_role } = req.body;
    try {
        if(!full_name || !email_address || !security_role) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // check if member with same email already exists
        const member_exists = await db
            .select().from(users)
            .where(eq(users.email_address, email_address))
            .limit(1);
        if(member_exists) {
            return res.status(400).json({ message: "Member with this email already exists" });
        }
        // create new member
        const [new_member] = await db
            .insert(users)
            .values({
                tenant_id,
                full_name,
                email_address,
                security_role,
            })
            .returning();
        // respond with new member details (excluding password hash)
        return res.status(201).json({
            message: "Member added successfully",
            member: new_member
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding member"
        });
    }
}
const update_member = async (req, res) => { 
    const { tenant_id, member_id } = req.params;
    const { full_name, email_address, security_role } = req.body;
    try {
        if(!full_name && !email_address && !security_role) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }
        // check if member exists
        const [member] = await db
            .select().from(users)
            .where(and(eq(users.id, member_id), eq(users.tenant_id, tenant_id)))
            .limit(1);
        if(!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        // update member details
        const updated_member = await db
            .update(users)
            .set({
                full_name: full_name || member.full_name,
                email_address: email_address || member.email_address,
                security_role: security_role || member.security_role
            })
            .where(eq(users.id, member_id))
            .returning();
        // respond with updated member details (excluding password hash)
        return res.status(200).json({
            message: "Member updated successfully",
            member: updated_member[0]
        });
    }catch (error) {
        return res.status(500).json({
            message: "Error updating member"
        });
    }
}
const delete_member = async (req, res) => {
    const { tenant_id, member_id } = req.params;
    try {
        // check if member exists
        const [member] = await db
            .select().from(users)
            .where(and(eq(users.id, member_id), eq(users.tenant_id, tenant_id)))
            .limit(1);
        if(!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        // delete member
        await db
            .delete(users)
            .where(eq(users.id, member_id));
        return res.status(200).json({ message: "Member deleted successfully" });
    }catch (error) {
        return res.status(500).json({
            message: "Error deleting member"
        });
    }
}
 
const get_member = async (req, res) => {
    const { tenant_id, member_id } = req.params;
    try {
        // check if member exists
        const [member] = await db
            .select().from(users)
            .where(and(eq(users.id, member_id), eq(users.tenant_id, tenant_id)))
            .limit(1);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        // respond with member details (excluding password hash)
        const { password_hash, ...member_details } = member;
        return res.status(200).json({
            message: "Member retrieved successfully",
            member: member_details
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving member"
        });
    }
}


const get_all_members = async (req, res) => {
    const { tenant_id } = req.params;
    try {
        // retrieve all members for the tenant
        const members = await db
            .select().from(users)
            .where(eq(users.tenant_id, tenant_id));
        // respond with list of members (excluding password hashes)
        const members_list = members.map(({ password_hash, ...member_details }) => member_details);
        return res.status(200).json({
            message: "Members retrieved successfully",
            members: members_list
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving members"
        });
    }
 }

// generate member login credentials
const generate_member_credentials = async (req, res) => {
    const { tenant_id, member_id } = req.params;
    try {
        // check if member exists
        const [member] = await db
            .select().from(users)
            .where(and(eq(users.id, member_id), eq(users.tenant_id, tenant_id)))
            .limit(1);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        // generate login credentials (example implementation - replace with actual credential generation logic)
        const credentials = {
            username: member.email_address,
            password: "temporary_password" // Replace with actual password generation logic
        };
        return res.status(200).json({
            message: "Member credentials generated successfully",
            credentials: credentials
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error generating member credentials"
        });
    }
}

export {
    add_member,
    update_member,
    delete_member,
    get_member,
    get_all_members,
    generate_member_credentials
}
