import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocusService } from './locus.service';
import { GetLocusQueryDto } from './dto/get-locus-query.dto';

@ApiTags('locus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  @ApiOperation({ summary: 'Get locus data with filters, sorting and pagination' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  findAll(@Query() query: GetLocusQueryDto, @Request() req: any) {
    return this.locusService.findAll(query, req.user);
  }
}
