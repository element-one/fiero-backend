import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenaiSomethingException } from '@exceptions/openai-something-wrong';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async getReceiptText(url: string, keywords: string[]) {
    try {
      const prompt = `Please extract the following keywords from the receipt: ${keywords.join(
        ', ',
      )}`;

      const now = Date.now();
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt, // 'This is a receipt that could not be extracted possibly Do your best to extract the image text and format the text into a receipt.',
              },
              {
                type: 'image_url',
                image_url: {
                  url,
                },
              },
            ],
          },
        ],
        max_tokens: 60,
      });

      const { content } = completion.choices[0].message;
      console.log(Date.now() - now);

      return content;
    } catch (err) {
      console.log(err);
      throw new OpenaiSomethingException();
    }
  }
}
