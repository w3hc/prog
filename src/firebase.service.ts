import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './service_key.json';

@Injectable()
export class FirebaseService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  async sendNotification(
    tokens: string[],
    message: { title: string; body: string },
  ) {
    if (!tokens || tokens.length === 0) {
      throw new Error('No tokens provided');
    }

    const payload = {
      tokens: tokens,
      notification: {
        title: message.title,
        body: message.body,
      },
    };

    const response = await admin.messaging().sendMulticast(payload);
    return response;
  }
}
