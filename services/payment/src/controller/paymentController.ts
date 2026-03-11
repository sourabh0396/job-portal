import { instnase } from "../index.js";
import { AuthenticatedRequest } from "../middleware/UserAuth.js";
import { SQL } from "../utils/DB.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import crypto from 'crypto'

export const checkOut = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        throw new ErrorHandler(401, 'No valid user');
    }
    const user_id = req.user.user_id;

    const [user] = await SQL`SELECT * FROM users WHERE user_id =${user_id}`;

    const subscriptionTime = user?.subscription ? new Date(user.subscription).getTime() : 0;
    const curruntTime = Date.now()

    const isSubscribed = subscriptionTime > curruntTime;
    if (isSubscribed) {
        throw new ErrorHandler(400, 'You already have an subscription')
    }

    const options = {
        amount: 119 * 100,
        currency: "INR",
        notes: {
            user_id: user_id.toString(),
        },
    };

    const order = await instnase.orders.create(options);

    res.status(201).json({
        order,
    });
});

export const paymentVerification = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RazorPayKey_secret as string).update(body).digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        const expiryDate = new Date(now.getTime() + thirtyDays);

        const [updatedUser] = await SQL`UPDATE user SET subscription = ${expiryDate} WHERE user_id = ${user?.user_id} RETURNING *`;

        res.json({
            message: 'Subscription Purchased SUcessfully',
            updatedUser
        });
    } else {
        return res.status(400).json({
            message: 'Payment Failed',
        })
    }
});