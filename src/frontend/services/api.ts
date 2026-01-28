import axios from "axios";

export interface ShortenResponse {
  code: string;
  shortUrl: string;
}

export async function shortenUrl(url: string): Promise<ShortenResponse> {
  const res = await axios.post<ShortenResponse>("/api/shorten", { url });
  return res.data;
}

