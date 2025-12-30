"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuth2Strategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GoogleOAuth2Strategy = class GoogleOAuth2Strategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(configService) {
        const clientID = configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
        const apiUrl = configService.get('API_URL');
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
        this.configService = configService;
    }
    async validate(request, accessToken, refreshToken, profile, done) {
        var _a;
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: ((_a = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _a === void 0 ? void 0 : _a.value) || '',
            accessToken,
            refreshToken,
        };
        done(null, user);
    }
};
exports.GoogleOAuth2Strategy = GoogleOAuth2Strategy;
exports.GoogleOAuth2Strategy = GoogleOAuth2Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleOAuth2Strategy);
//# sourceMappingURL=google-oauth2.strategy.js.map