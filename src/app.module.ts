import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Module } from '@nestjs/common';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ MailerModule.forRootAsync({
    useFactory: () => ({
      //Mailtrap's user and password
      transport: `smtp://contato@advancedcorretora.com.br:Advanced@2021@smtp.office365.com`,
      template: {
        dir: './src/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      },
    }),
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}