/**
1️⃣ What is Middleware?
✅ Middleware functions in Express.js are functions that execute before reaching the final request handler.
✅ They have access to the request (req), response (res), and next function (next()).

📌 Think of middleware as a security checkpoint at an airport:

Middleware 1: Security checks your passport.
Middleware 2: You go through baggage screening.
Middleware 3: You pass through a metal detector.
Final Destination (Route Handler): If all checks pass, you board the flight.
🔹 In Express, middleware works the same way:

It runs before the route handler.
It modifies the request or response.
It decides whether to pass control (next()) or block the request.

*/

import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;
    // console.log({ token });
    if (!token) {
        return response.status(401).send("User not authenticated!");
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) {
            return response.status(403).send("Token not valid!");
        }
        request.userId = payload.userId;
        next();
    })
}