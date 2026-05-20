"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyService = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
let SpotifyService = class SpotifyService {
    clientId = process.env.SPOTIFY_CLIENT_ID;
    clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    redirectUri = process.env.SPOTIFY_CALLBACK_URL;
    getAuthUrl() {
        const scope = encodeURIComponent('user-library-read');
        return (`https://accounts.spotify.com/authorize` +
            `?response_type=code` +
            `&client_id=${this.clientId}` +
            `&scope=${scope}` +
            `&redirect_uri=${encodeURIComponent(this.redirectUri)}`);
    }
    async getTokens(code) {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });
        const res = await axios_1.default.post('https://accounts.spotify.com/api/token', body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return res.data;
    }
    async getMe(accessToken) {
        const res = await axios_1.default.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    }
};
exports.SpotifyService = SpotifyService;
exports.SpotifyService = SpotifyService = __decorate([
    (0, common_1.Injectable)()
], SpotifyService);
//# sourceMappingURL=spotify.service.js.map