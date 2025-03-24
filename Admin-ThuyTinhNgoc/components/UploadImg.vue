<template>
  <div @click="open()">
    <slot name="main">
      <a-button icon>
        <UploadOutlined />
        Upload
      </a-button>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import { UploadOutlined } from '@ant-design/icons-vue'

const props = withDefaults(defineProps<{
  accept?: string
  directory?: boolean,
}>(), {
  accept: 'image/*',
  directory: false,
})

const emit = defineEmits(['handleChangeImage'])

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: props.accept,
  directory: props.directory,
  multiple: false,
})

const createBase64Image = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
const base64Image = ref<string | null>(null)
onChange(async (files) => {
  console.log(files)
  if (files && files.length > 0) {
    try {
      base64Image.value = await createBase64Image(files[0])
      emit('handleChangeImage', base64Image.value)
      const url = await handleUploadToImgBB(files[0])
      emit('handleChangeImage', url)  
    } catch (error) {
      console.error('Error converting file to base64:', error)
    }
  }
})

onCancel(() => {
  // console.log('File selection was canceled')
})

const handleUploadToImgBB = async(file:File) =>{
    const formData =  new FormData
    formData.append('image',file)
    const apiKey = '14cc7136f05a039beb83d8183385e78b'
    const url = ref<string | null>(null)
    await $fetch( `https://api.imgbb.com/1/upload?key=${apiKey}`,{
      method:'POST',
      body:formData,
      onResponse: ({response})=>{
        if(response.ok){
          message.success('Tải lên thành công')
          url.value = response._data?.data.url
        }
        else{
          message.error('Tải lên thất bại')
          url.value = null
        }
      }
    })
    return url.value
}
</script>