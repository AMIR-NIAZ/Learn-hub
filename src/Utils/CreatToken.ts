import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: string;
}

export function CreateToken(user: any) {    
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: "20d" }
    );

    return token
}
export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}