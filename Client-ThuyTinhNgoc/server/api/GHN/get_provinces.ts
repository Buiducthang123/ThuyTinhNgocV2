// lấy danh sách tỉnh thành từ GHN
export default defineEventHandler(async (event) => {
    let data = null
    await $fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        method: 'GET',
        headers: {
            token: useRuntimeConfig().ghn_token
        },
        onResponse:({response})=>{
            if(response.ok){
                data = response._data
            }
        }
    })
    return {
        data
    }
})
