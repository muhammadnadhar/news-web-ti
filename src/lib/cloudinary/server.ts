// src/lib/server/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_API_KEY } from '$env/static/public';

// Konfigurasi cukup ditulis 1x saja di sini
cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: PUBLIC_CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

// Export instance cloudinary yang sudah siap digunakan
export { cloudinary };

// 
// Cek ada helper untuk membantu mendelete file di folder /helper/cloudinary.ts
//
