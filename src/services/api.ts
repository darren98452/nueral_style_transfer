import axios, { AxiosError } from 'axios';

/**
 * Converts a base64 / data URL string to a binary Blob
 */
export function dataUrlToBlob(dataUrl: string, fileName: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}

export interface StylizeResponse {
  output_image: string;
}

/**
 * Sends content and style images to the Raspberry Pi Flask Service
 */
export async function sendStyleTransferRequest(
  contentDataUrl: string,
  styleDataUrl: string,
  backendUrl: string,
  retriesLeft: number = 2
): Promise<StylizeResponse> {
  // Normalize URL to have /stylize if just domain is provided
  let url = backendUrl.trim();
  if (!url.endsWith('/stylize')) {
    url = url.endsWith('/') ? `${url}stylize` : `${url}/stylize`;
  }

  // Convert base64 dataUrls to real binary Files
  const contentFile = dataUrlToBlob(contentDataUrl, 'content.jpg');
  const styleFile = dataUrlToBlob(styleDataUrl, 'style.jpg');

  const formData = new FormData();
  formData.append('content_image', contentFile);
  formData.append('style_image', styleFile);

  try {
    const response = await axios.post<StylizeResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 35000, // Raspberry Pi neural style transfer can take a few seconds
    });

    if (response.data && response.data.output_image) {
      return response.data;
    } else {
      throw new Error('API response does not contain "output_image"');
    }
  } catch (error) {
    if (retriesLeft > 0) {
      console.warn(`Style transfer failed. Retrying... (${retriesLeft} retries left)`, error);
      // Brief delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return sendStyleTransferRequest(contentDataUrl, styleDataUrl, backendUrl, retriesLeft - 1);
    }

    const err = error as AxiosError | Error;
    let errorMessage = 'Could not process Style Transfer request.';

    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. The Raspberry Pi server took too long to respond.';
      } else if (!err.response) {
        errorMessage = `Failed to connect to Pi server at ${backendUrl}. Please check that the server is online and CORS is enabled in Flask using "flask-cors".`;
      } else {
        errorMessage = `Server Error (${err.response.status}): ${
          typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data) || err.message
        }`;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
}
