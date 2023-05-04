import type {APIRoute} from "astro";

export const post: APIRoute = async ({ request }) => {
    const body = await request.body?.getReader().read();
    return new Response(request.body, {
        status: 200,
    })
}
