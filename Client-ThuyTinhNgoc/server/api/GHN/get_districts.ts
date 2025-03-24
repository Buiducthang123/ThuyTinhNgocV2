export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let data = null
  if (body.province_id!=-1) {
    await $fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id', {
      method: 'GET',
      headers: {
        token: useRuntimeConfig().ghn_token
      },
      query: {
        province_id: body.province_id
      },
      onResponse: ({ response }) => {
        if (response.ok) {
          data = response._data
        }
      }
    })
  }
  return {
    data
  }
})
