// src/melodify/melodify.client.ts

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const melodifyApi = axios.create({
  baseURL: 'https://melodify.pw/api/desktop/v9',

  headers: {
    authorization: process.env.MELODIFY_TOKEN,

    'app-version': '9.1.3',

    'pwa-version': '9.2.2 Desktop',

    'device-id': process.env.MELODIFY_DEVICE_ID,

    'device-name': 'Mac OS 10.15 (os)',

    'device-token': process.env.MELODIFY_DEVICE_TOKEN,

    'user-id': process.env.MELODIFY_USER_ID,

    'user-device-info': 'screen_w:1238-screen_w:633',

    platform: 'Mac OS-Desktop',

    Origin: 'https://desktop.melodify.app',

    Referer: 'https://desktop.melodify.app/',

    'Content-Type': 'application/json',
  },
});