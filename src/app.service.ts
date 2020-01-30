import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { Email as Interface } from './mail.interface'
import { CardRequest } from './card_request.interface'


@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) { }

  sendMail = async (mail: Interface): Promise<any> => {

    const response = await this.mailerService
      .sendMail({
        to: 'contato@advancedcorretora.com.br',
        from: 'contato@advancedcorretora.com.br',
        subject: mail.title,
        template: 'mail',
        attachments: mail.attachments,
        context: {
          name: mail.name,
          title: mail.title,
          message: mail.message,
        },
      })
      .then(() => response)
      .catch((error) => console.log(error))
  }

  cardRequest = async (card: CardRequest): Promise<any> => {
    this.mailerService
      .sendMail({
        to: 'contato@advancedcorretora.com.br',
        from: 'contato@advancedcorretora.com.br',
        subject: card.typeCard,
        template: 'type_card',
        context: {
          name: card.name,
          phone: card.phone,
          mail: card.email,
          urgency: card.urgency,
          contactTime: card.contactTime,
          cpf: card.cpf,
          wantToSpend: card.wantToSpend,
          money: card.money,
          typeCard: card.typeCard,
        },
      })
      .then((response) => response)
      .catch((error) => console.log(error))
  }

}