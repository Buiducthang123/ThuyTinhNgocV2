export default defineEventHandler(async (event) => { 
    const body = await readBody(event)
    let data = null
    await $fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', { 
        method: 'POST', 
        headers: { 
            token: useRuntimeConfig().ghn_token 
        }, 
        body: body,
        onResponse:({response})=>{ 
            if(response.ok){ 
                data = response._data 
            } 
        } 
    }) 
    return { 
        data 
    }
});

// export default defineEventHandler(async (event) => { 
//     const body = await readBody(event)
//     let data = null
//     // let url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services"
//     let url = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services"
//     let token = "97fffa03-7d6c-11ef-9c21-2ea71359104f"
//     await $fetch(url, { 
//         method: 'POST', 
//         headers: { 
//             // token: useRuntimeConfig().ghn_token 
//             token: token
//         }, 
//         body: body,
//         onResponse:({response})=>{ 
//             if(response.ok){ 
//                 data = response._data 
//             } 
//         } 
//     }) 
//     return { 
//         data 
//     }
// });