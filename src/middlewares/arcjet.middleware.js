import aj from "../config/arcjet.js";


const arcjetMiddleware = async (req, res, next) => {
    try {
        // 🟢 Geliştirme ortamında rate limit veya bot koruması çalışmasın
      

        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests - Rate limit exceeded",
                });
            }

            if (decision.reason.isBot()) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied - Bot detected",
                });
            }

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        next();
    } catch (error) {
        console.error("arcjet middleware error:", error);
        next(error);
    }
};

export default arcjetMiddleware;
