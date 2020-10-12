import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
@Injectable()
export class JWTUtil {
    constructor(private readonly jwtService: JwtService) {}

    decode(auth: string): any {
        const jwt = auth.replace('bearer ', '');
        return this.jwtService.decode(jwt, { json: true }) ;
    }
}