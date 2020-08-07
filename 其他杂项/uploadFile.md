# fetch FormData uploadFile
    
```sh
const formData = new FormData();

formData.append('file', fileInput.files[0]);

const options = {
    method: 'POST',
    body: formData,
    // If you add this, upload won't work
    // 注意： 上传文件时，不要设置content-type
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // }
};

fetch('your-upload-url', options);
```