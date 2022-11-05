import { LibraConfig } from './types';
import { Client } from './client';
import { WalletConnection } from './wallet-connection';
import LrpProtocol from './lrp';
import DisputeResolution from './dispute-resolution';

export class Libra {
  readonly lrp: LrpProtocol;
  readonly ddr: DisputeResolution;
  readonly walletConnection: WalletConnection;

  constructor(config: LibraConfig) {
    const client = new Client(config);
    this.walletConnection = new WalletConnection([]);
    this.lrp = new LrpProtocol(client);
    this.ddr = new DisputeResolution(client);
  }
}