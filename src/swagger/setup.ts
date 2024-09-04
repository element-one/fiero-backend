import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises } from 'fs';

import { version } from '../../package.json';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('GLASS API Documentation')
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  if (process.env.EXPORT_SWAGGER) {
    (async () => {
      try {
        await promises.writeFile(
          './swagger-spec.json',
          JSON.stringify(document),
        );
      } catch (e) {
        console.log(e);
      }
    })();
  }

  SwaggerModule.setup('/api-docs', app, document);
}
