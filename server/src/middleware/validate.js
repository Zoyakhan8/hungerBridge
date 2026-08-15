export const validate = (schema) => {
    return (req, res, next) => {

        const result = schema.safeParse(req.body);
        if (!result.success) {
            console.log(result.error.issues);
            return res.status(400).json({
                errors: result.error.flatten().fieldErrors
            });
        }
        console.log("valid successfully");
        req.body = result.data;
        next();
    };
};