import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Account, connect, Contract, keyStores, utils } from 'near-api-js';

@Injectable()
export class NearService {
  constructor(private configService: ConfigService) {}

  async mintNft(serieId: string, receiverId: string) {
    const keyJSON = this.configService.get('NEAR_KEY_STORE');
    const keyData = JSON.parse(keyJSON);
    const keyStore = new keyStores.InMemoryKeyStore();
    await keyStore.setKey(
      this.configService.get('NEAR_NETWORK'),
      this.configService.get('NEAR_ACCOUNT_ID'),
      utils.KeyPair.fromString(keyData.private_key),
    );

    const config = {
      networkId: this.configService.get('NEAR_NETWORK'),
      nodeUrl: this.configService.get('NEAR_NODE_URL'),
      keyStore,
    };

    const near = await connect(config);

    const accountId = this.configService.get('NEAR_ACCOUNT_ID');
    const contractName = this.configService.get('NEAR_CONTRACT_ID');
    const account = new Account(near.connection, accountId);
    const contract = new Contract(account, contractName, {
      viewMethods: [],
      changeMethods: ['nft_mint'],
      useLocalViewExecution: false,
    });

    // eslint-disable-next-line
    const result = await (contract as any).nft_mint({
      args: { id: serieId, receiver_id: receiverId },
      gas: 300000000000000,
      amount: utils.format.parseNearAmount('1'),
    });

    return result;
  }

  async getNftForOwner(ownerId: string) {
    const keyJSON = this.configService.get('NEAR_KEY_STORE');
    const keyData = JSON.parse(keyJSON);
    const keyStore = new keyStores.InMemoryKeyStore();
    await keyStore.setKey(
      this.configService.get('NEAR_NETWORK'),
      this.configService.get('NEAR_ACCOUNT_ID'),
      utils.KeyPair.fromString(keyData.private_key),
    );

    const config = {
      networkId: this.configService.get('NEAR_NETWORK'),
      nodeUrl: this.configService.get('NEAR_NODE_URL'),
      keyStore,
    };

    const near = await connect(config);

    const accountId = this.configService.get('NEAR_ACCOUNT_ID');
    const contractName = this.configService.get('NEAR_CONTRACT_ID');
    const account = new Account(near.connection, accountId);
    const contract = new Contract(account, contractName, {
      viewMethods: ['nft_tokens_for_owner'],
      changeMethods: [],
      useLocalViewExecution: false,
    });

    // eslint-disable-next-line
    const result = await (contract as any).nft_tokens_for_owner({
      account_id: ownerId,
      from_index: '0',
      limit: 200,
    });

    return result;
  }
}
