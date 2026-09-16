import { cloudinary } from '$lib/cloudinary/server';
import { createLecturerStaff } from '$lib/server/admin/repository/article/profile/dosen&staff';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const nidn = formData.get('nidn')?.toString().trim() || null;
		const expertise = formData.get('expertise')?.toString().trim();
		const pddiktiUrl = formData.get('pddikti_url')?.toString().trim() || null;
		const category = formData.get('category')?.toString().trim();

		// Menerima input gambar (Bisa berupa File langsung atau String URL/Public ID dari Client)
		const photoFile = formData.get('photo') as File | null;
		let photoUrl = formData.get('photo_url')?.toString().trim() || null;
		let publicId = formData.get('public_id')?.toString().trim() || null;

		// 1. Validasi Input Wajib
		if (!name || !expertise) {
			return fail(400, {
				message: {
					type: 'error',
					text: 'Harap isi Nama Lengkap dan Bidang Keahlian / Tugas.'
				},
				values: { name, nidn, expertise, pddiktiUrl, category }
			});
		}

		// 2. Handle Upload ke Cloudinary di Sisi Server (Jika menerima Input File)
		if (photoFile && photoFile.size > 0 && photoFile.name !== 'undefined') {
			try {
				// Konversi File ke Buffer -> Base64
				const arrayBuffer = await photoFile.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				const base64Image = `data:${photoFile.type};base64,${buffer.toString('base64')}`;

				// Upload langsung dari Server ke Cloudinary
				const uploadResult = await cloudinary.uploader.upload(base64Image, {
					folder: 'prodi-ti/dosen-staff' // Sesuaikan folder tujuan Anda
				});

				photoUrl = uploadResult.secure_url;
				publicId = uploadResult.public_id;
			} catch (uploadError: any) {
				console.error('Cloudinary Server Upload Error:', uploadError);
				return fail(500, {
					message: {
						type: 'error',
						text: 'Gagal mengunggah foto ke server Cloudinary.'
					},
					values: { name, nidn, expertise, pddiktiUrl, category }
				});
			}
		}

		const id = randomUUID();

		try {
			await createLecturerStaff(id, {
				name,
				nidn,
				expertise,
				pddikti_url: pddiktiUrl,
				photo_url: photoUrl,
				role: category
			});
		} catch (err: any) {
			console.error('Error creating lecturer/staff:', err);

			// Rollback: Hapus foto dari Cloudinary jika simpan DB Gagal
			if (publicId) {
				try {
					await cloudinary.uploader.destroy(publicId);
					console.log(`Rollback: Berhasil menghapus foto ${publicId} dari Cloudinary`);
				} catch (cleanupErr) {
					console.error('Gagal melakukan cleanup Cloudinary:', cleanupErr);
				}
			}

			return fail(500, {
				message: {
					type: 'error',
					text: err.message || 'Gagal menyimpan data Dosen/Staff ke database.'
				},
				values: { name, nidn, expertise, pddiktiUrl, category }
			});
		}

		// Jika ingin redirect setelah sukses:
		// throw redirect(303, '/admin/dosen-staff');

		return {
			message: {
				type: 'success',
				text: 'Berhasil menambahkan data Dosen/Staff baru!'
			}
		};
	}
};
