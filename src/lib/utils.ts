export function mergeNewPath(newPath : string)  : string {
  // Ambil URL saat ini
  const url = new URL(window.location.href);
  
  //  Gabungkan path lama dengan path baru, lalu bersihkan garis miring ganda (//)
  const cleanPath = `${url.pathname}/${newPath}`.replace(/\/+/g, '/');
  
  //  Update pathname tanpa merusak search params atau hash
  url.pathname = cleanPath;
  
  return url.toString(); // Mengembalikan URL penuh yang baru
}

/*
 * Menghapus segmen path terakhir
 */
export function removeLastPath(): string {
  // if (!browser) return '';

  const url = new URL(window.location.href);
  
  const pathSegments = url.pathname.split('/');
  
  // Hapus elemen terakhir dari array jika path tidak kosong
  if (pathSegments.length > 1) {
    pathSegments.pop();
  }
  
  // Gabungkan kembali array menjadi string path, pastikan diawali '/'
  const cleanPath = pathSegments.join('/') || '/';
  url.pathname = cleanPath;
  
  return url.toString(); // Mengembalikan URL penuh setelah path terakhir dihapus
}
