export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    let data = null

    await $fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
        method: 'POST',
        headers: {
            token: useRuntimeConfig().ghn_token
        },
        body: body,
        onResponse: ({ response }) => {
            if (response.ok) {
                data = response._data
            }
        }

    }
    )
    return data
})
