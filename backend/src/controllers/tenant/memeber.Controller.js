import { db } from "../../config/database/db.js";
import { users } from "../../config/database/schemas/users.js";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";

const add_member = async (req, res) => {
  const { tenant_id } = req.params;
  const { full_name, email_address, security_role } = req.body;
  try {
    if (!full_name || !email_address || !security_role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // check if member with same email already exists
    const member_exists = await db
      .select()
      .from(users)
      .where(eq(users.email_address, email_address))
      .limit(1);

    if (member_exists && member_exists.length > 0) {
      return res
        .status(400)
        .json({ message: "Member with this email already exists" });
    }

    // Placeholder password hash to satisfy your database schema's NOT NULL constraint
    const temporary_password_hash = await bcrypt.hash(
      "TemporaryPassword123!",
      10,
    );

    // create new member
    const [new_member] = await db
      .insert(users)
      .values({
        tenant_id,
        full_name,
        email_address,
        security_role,
        password_hash: temporary_password_hash,
      })
      .returning();
    
    // Destructure safely to remove password_hash from the response object
    const { password_hash, ...member_details } = new_member;

    return res.status(201).json({
      message: "Member added successfully",
      member: member_details,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("CAUSE:", error.cause);

    return res.status(500).json({
      message: error.message,
      cause: error.cause?.message,
    });
  }
};

const update_member = async (req, res) => {
  const { tenant_id, member_id } = req.params;
  const { full_name, email_address, security_role } = req.body;
  try {
    if (!full_name && !email_address && !security_role) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    // check if member exists
    const [member] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.id, member_id),
        eq(users.tenant_id, tenant_id)))
      .limit(1);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // update member details
    const [updated_member] = await db
      .update(users)
      .set({
        full_name: full_name || member.full_name,
        email_address: email_address || member.email_address,
        security_role: security_role || member.security_role,
      })
      .where(eq(users.id, member_id))
      .returning();

    const { password_hash, ...member_details } = updated_member;

    return res.status(200).json({
      message: "Member updated successfully",
      member: member_details,
    });
  } catch (error) {
    console.error("Update member error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const delete_member = async (req, res) => {
  const { tenant_id, member_id } = req.params;
  try {
    const [member] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, member_id), eq(users.tenant_id, tenant_id)))
      .limit(1);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await db.delete(users).where(eq(users.id, member_id));

    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting member",
    });
  }
};

const get_member = async (req, res) => {
  const { tenant_id, member_id } = req.params;
  try {
    const [member] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, member_id), eq(users.tenant_id, tenant_id)))
      .limit(1);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const { password_hash, ...member_details } = member;
    return res.status(200).json({
      message: "Member retrieved successfully",
      member: member_details,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving member",
    });
  }
};

const get_all_members = async (req, res) => {
  const { tenant_id } = req.params;
  try {
    const members = await db
      .select()
      .from(users)
      .where(eq(users.tenant_id, tenant_id)); // Fixed typo here

    const members_list = members.map(
      ({ password_hash, ...member_details }) => member_details,
    );
    return res.status(200).json({
      message: "Members retrieved successfully",
      members: members_list,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving members",
    });
  }
};

const generate_member_credentials = async (req, res) => {
  const { tenant_id, member_id } = req.params;
  const { password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // check if member exists
    const [member] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, member_id), eq(users.tenant_id, tenant_id)))
      .limit(1);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // hashed password
    const hashed_password = await bcrypt.hash(password, 10);

    const [updated_member] = await db
      .update(users)
      .set({ password_hash: hashed_password })
      .where(eq(users.id, member_id))
      .returning();

    return res.status(200).json({
      message: "Member credentials updated successfully",
      credentials: {
        username: updated_member.email_address,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating member credentials",
    });
  }
};

export {
  add_member,
  update_member,
  delete_member,
  get_member,
  get_all_members,
  generate_member_credentials,
};
