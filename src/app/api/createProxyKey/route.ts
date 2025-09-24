import { NextResponse } from "next/server";
import db from '@/lib/db';
import vpn from '@/lib/vpn';

export async function POST() {

    const {accessUrl} = await vpn.createAccessKey();

    const proxyKey = await db.proxyKey.create({
      data: {
        accessUrl,
      }
    });

    return NextResponse.json(proxyKey, { status: 200 });
}
