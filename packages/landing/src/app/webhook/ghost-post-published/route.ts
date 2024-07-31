// import assert from 'assert';
// import { revalidateTag } from 'next/cache';
// import { NextRequest, NextResponse } from 'next/server';

// import { BLOG_TAG } from '@/global/constants';

// const isError = (e: unknown): e is Error => !!e && Reflect.has(e, 'message');

// export async function GET(req: NextRequest) {
//   try {
//     assert(process.env.GHOST_WEBHOOK_SECRET, 'GHOST_WEBHOOK_SECRET is not set');
//     const secret = req.nextUrl.searchParams.get('secret');

//     if (secret !== process.env.GHOST_WEBHOOK_SECRET) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     revalidateTag(BLOG_TAG);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       {
//         error: isError(error) ? error.message : 'Internal Server Error',
//       },
//       { status: 500 },
//     );
//   }
// }
