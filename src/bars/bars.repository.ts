import { Injectable } from '@nestjs/common';

export type Bar = any;
@Injectable()
export class BarsRepository{
    private readonly bars: Bar[];
    constructor() {
        this.bars = [
          {
            userId: '1',
            username: 'john',
            password: 'changeme',
            barname: '123'
          },
          {
            userId: '2',
            username: 'chris',
            password: 'secret',
            barname: '456'
          },
          {
            userId: '3',
            username: 'maria',
            password: 'guess',
            barname: '789'
          },
        ];
      }
    async list_bars(): Promise<Bar> {
        //return list of all bars
        return this.bars;
      }
    async add_bar(bar): Promise<Bar | undefined>
    {
        //add bar then return bar that added
        //bar is detail of bar
        return bar
    }
    async bar_profile(barid): Promise<Bar | undefined>
    {
        //return  bar that id == barid
        //bar_id is string
        return this.bars.find(bar => bar.userId === barid);
    }


}