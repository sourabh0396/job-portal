import { AuthenticatedRequest } from "../middleware/UserAuth.js";
import { TryCatch } from "../utils/TryCatch.js";


export const MyProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    res.json(user)

})