import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { Ensemble } from './schema/ensemble.schema';
import { CreateEnsembleDto } from './dto/ensemble.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string; 
    accessToken: string; 
  };
}

@Controller('ensembles')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() ensembleDto: CreateEnsembleDto, @Req() req: AuthenticatedRequest): Promise<Ensemble> {
    const creatorId = req.user.id;
    return this.ensembleService.createEnsemble(ensembleDto, creatorId);
  }

  @Get()
  async findAll(): Promise<Ensemble[]> {
    return this.ensembleService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() ensembleDto: any): Promise<Ensemble> {
    return this.ensembleService.updateEnsemble(id, ensembleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ensembleService.deleteEnsemble(id);
  }
}
