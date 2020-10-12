import { Injectable } from '@nestjs/common';
import { BarsRepository } from './bars.repository'
export type User = any;
@Injectable()
export class BarsService {
  private readonly users: User[];
  constructor(private readonly barsrepository: BarsRepository ) {}
}