import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyService {
  private clientId = process.env.SPOTIFY_CLIENT_ID!;
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  private redirectUri = process.env.SPOTIFY_CALLBACK_URL!;

  getAuthUrl() {
    const scope = encodeURIComponent('user-library-read');

    return (
      `https://accounts.spotify.com/authorize` +
      `?response_type=code` +
      `&client_id=${this.clientId}` +
      `&scope=${scope}` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}`
    );
  }

  async getTokens(code: string) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return res.data;
  }

  async getMe(accessToken: string) {
    const res = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  }
}