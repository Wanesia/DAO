import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { Ensemble } from './schema/ensemble.schema';


@Controller('ensembles')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @Post()
  async create(@Body() ensembleDto: any): Promise<Ensemble> {
    return this.ensembleService.createEnsemble(ensembleDto);
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
