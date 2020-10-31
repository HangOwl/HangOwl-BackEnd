import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

var cors = require('cors')
const corsOptions = {
  origin: true,
  credentials: true
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule , { cors: corsOptions });
  //app.options('*', cors(corsOptions));
  await app.listen(3001);
}
bootstrap();
