export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const imgbb_api_key = config.imgbb_api_key
    const url = `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`

    // Đọc dữ liệu FormData từ event
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw new Error('Body must be FormData')
    }

    // Tạo một đối tượng FormData mới để gửi tới imgbb
    const uploadData = new FormData()
    formData.forEach((field) => {
        if (field.name === 'image' && field.type === 'file') {
            uploadData.append('image', field.data, field.filename)
        }
    })

    try {
        // Gửi yêu cầu tới imgbb
        const response = await $fetch(url, {
            method: 'POST',
            body: uploadData,
    
        })

        // Log phản hồi từ imgbb
        console.log('imgbb Response:', response)

        return response
    } catch (error) {
        console.error('Error uploading to imgbb:', error)
        throw error
    }
})