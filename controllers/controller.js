const { generate } = require("../services/gemini");

class Controller {
    static async generateText(req, res, next) {
        try {
            const { style } = req.body;
            if (!style) return res.status(400).json({ message: "Style is required" });

            const text = await generate(style);
            res.status(200).json({ success: true, data: text.split(/\s+/) });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { Controller };
