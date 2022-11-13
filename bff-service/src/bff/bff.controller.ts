import { Controller, All, Req, Request } from '@nestjs/common';
import { BffService } from './bff.service';

@Controller('*')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @All()
  public async redirect(@Req() req: Request) {
    return this.bffService.redirect(req);
  }
}
