/**
 * Compressed file helper. Downscales heavy images to a reasonable web size (max 1024px width/height)
 * and outputs a compressed JPEG base64 string.
 */
export function compressAndValidateImage(
  file: File,
  maxSizeBytes: number = 5242880 // Default 5MB
): Promise<{ base64: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    // 1. Support check
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('Invalid image format! Please upload a JPG, PNG, WEBP, or GIF image.'));
    }

    // 2. Initial size check
    if (file.size > maxSizeBytes) {
      const mbMax = (maxSizeBytes / (1024 * 1024)).toFixed(1);
      return reject(new Error(`File size is too heavy! Maximum limit is ${mbMax} MB.`));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return reject(new Error('Could not parse file data.'));

      // If file is quite small (e.g., under 400KB), don't compress - just return original to ensure high styling details
      if (file.size < 400000) {
        return resolve({
          base64: dataUrl,
          originalSize: file.size,
          compressedSize: file.size,
        });
      }

      // Create offscreen image to downscale
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve({ base64: dataUrl, originalSize: file.size, compressedSize: file.size });
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as compressed progressive JPEG
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          
          // Estimate base64 byte count (3/4 of string length minus padding)
          const approxBytes = Math.round((compressedBase64.length - 22) * 3 / 4);

          resolve({
            base64: compressedBase64,
            originalSize: file.size,
            compressedSize: approxBytes,
          });
        } catch (err) {
          resolve({ base64: dataUrl, originalSize: file.size, compressedSize: file.size });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
