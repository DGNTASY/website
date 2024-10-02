import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const cookieName = process.env.NEXT_PUBLIC_COOKIE || 'session';
    const sessionCookie = req.cookies.get(cookieName);

    return NextResponse.json({
        hasSession: sessionCookie !== undefined,
    });
}
