export interface StyleSample {
  id: string;
  name: string;
  artist: string;
  url: string; // Base64 or placeholder
  description: string;
}

export interface ContentSample {
  id: string;
  name: string;
  url: string;
}

export interface GenerationHistory {
  id: string;
  timestamp: string;
  contentImage: string; // base64
  styleImage: string; // base64
  resultImage: string; // base64/url
  styleName: string;
  strength: number;
  resolution: string;
}

export interface AppSettings {
  backendUrl: string;
  isSimulationMode: boolean;
  compressionQuality: number; // 0.1 to 1.0
  maxUploadSizeBytes: number;
}
