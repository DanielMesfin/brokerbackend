import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface GoogleProfile extends Profile {
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class GoogleOAuth2Strategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const apiUrl = configService.get<string>('API_URL');

    if (!clientID || !clientSecret || !apiUrl) {
      throw new Error('Missing required OAuth2 configuration. Please check your environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and API_URL');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: `${apiUrl}/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true
    });
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos?.[0]?.value || '',
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
