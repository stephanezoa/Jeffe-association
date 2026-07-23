import { knex } from '../../core/database/knex';
import { v4 as uuidv4 } from 'uuid';

interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export class ContactService {
  public async submit(input: ContactInput) {
    await knex('contact_messages').insert({
      id: uuidv4(),
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject,
      message: input.message,
      status: 'new',
      created_at: new Date().toISOString(),
    });

    return { message: 'Votre message a bien été envoyé. Notre équipe vous répondra rapidement.' };
  }
}
