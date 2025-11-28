import { ExecutionContext, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtPrismaGuard extends AuthGuard('jwt') {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {
    super();
  }

  // after passport validates token and sets req.user (from jwt.strategy.validate),
  // load the full user from Prisma and attach to request
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    if (!activate) return false;
    const req = context.switchToHttp().getRequest();
    const jwtUser = req.user as any;
    if (!jwtUser || !jwtUser.userId) throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({ where: { id: jwtUser.userId } });
    if (!user) throw new UnauthorizedException();
    // attach sanitized user object
    req.currentUser = { id: user.id, email: user.email, firstName: user.firstName ?? null, secondName: user.secondName ?? null, phone: user.phone ?? null };
    return true;
  }
}
