import { Post, Body, Controller, HttpStatus, HttpCode, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor, MulterModule } from '@nestjs/platform-express'
import { AppService } from './app.service';
import { Email as Interface } from './mail.interface'
import { CardRequest } from './card_request.interface'
import { editFileName } from './file-config'

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path'
import * as fs from 'fs'

@ApiTags('Email')
@Controller('emails')
export class AppController {
  constructor(private readonly MailService: AppService) {
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: '/tmp',
      }),
    })
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email enviado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor('file', 20, {
    storage: diskStorage({
      destination: './tmp',
      filename: editFileName,
    }),
  }))
  async sendMail(
    @Body() email: Interface,
    @UploadedFiles() files) {

    try {
      const filesResponse = []

      files.forEach(file => {
        const fileReponse = {
          filename: `${file.filename}`,
          path: path.resolve(__dirname, '..', 'tmp', file.filename),
        };
        filesResponse.push(fileReponse);
      });

      email.attachments = filesResponse

      const response = await this.MailService.sendMail(email)
      
      /*console.log(filesResponse)
      
      filesResponse.map(file => {
        fs.unlinkSync(path.resolve(__dirname, '..', 'tmp', file.filename))
      })*/

      return { response };
    } catch (error) {
      console.log(error);
    }

  }

  @Post('cards')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email enviado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  @HttpCode(HttpStatus.OK)
  async carRequest(
    @Body() card: CardRequest) {

    try {
      const response = await this.MailService
        .cardRequest(card)

      return response;

    } catch (error) {
      console.log(error);
    }

  }
}
