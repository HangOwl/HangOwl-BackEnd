import { Injectable } from '@nestjs/common';

export type Bar = any;
@Injectable()
export class BarsService{
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
        //payload in bar is  'Email','Password' ,'BarName','LineID','OpenTime','CloseTime','CloseWeekDay','Address' , 'BarDescription', 'BarRule'
        //Doesn't have Role , ProfilePicPath , AdditionalPicture 
        // Set default
        bar.Role = 1
        bar.ProfilePicPath = ""
        bar.AdditionalPicture = []
        // Check if is true format
        // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // return re.test(String(bar.Email).toLowerCase());
    }
    async bar_profile(id): Promise<Bar | undefined>
    {
        //return  bar that match with id
        //bar_id is string
        return this.bars.find(bar => bar.userId === id);
    }

}