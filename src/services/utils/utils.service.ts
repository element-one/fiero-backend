import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class UtilsService {
  encodeString(text: string): string {
    return ethers.hexlify(ethers.toUtf8Bytes(text));
  }

  decodeString(text: string): string {
    return Buffer.from(text.substring(2), 'hex').toString('ascii');
  }
}
