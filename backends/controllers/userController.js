import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User Doesnt Exist" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });
        res.json({ success: true, token: createToken(user._id) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Please Enter Valid Email" });
        if (password.length < 8) return res.json({ success: false, message: "Please Enter Strong Password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await new userModel({ name, email, password: hashedPassword }).save();
        res.json({ success: true, token: createToken(user._id) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ===== Cart APIs =====
export const updateCart = async (req, res) => {
    const { cartData } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: false, message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return res.json({ success: false, message: "User not found" });

        user.cartData = cartData;
        await user.save();
        res.json({ success: true, message: "Cart updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getCart = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: false, message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return res.json({ success: false, message: "User not found" });

        res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};







