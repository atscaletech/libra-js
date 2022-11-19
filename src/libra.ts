import { LibraConfig } from './types';
import { Client } from './client';
import { WalletConnection } from './wallet-connection';
import LrpProtocol from './lrp';
import DisputeResolution from './dispute-resolution';
import Identities from './identities';
import Currencies from './currencies';
import Resolvers from './resolvers';

export class Libra {
  readonly walletConnection: WalletConnection;
  readonly lrp: LrpProtocol;
  readonly ddr: DisputeResolution;
  readonly identities: Identities;
  readonly currencies: Currencies;
  readonly resolvers: Resolvers;

  constructor(config: LibraConfig) {
    const client = Client.connect(config);
    this.walletConnection = new WalletConnection(config.appName);
    this.lrp = new LrpProtocol(client);
    this.ddr = new DisputeResolution(client);
    this.identities = new Identities(client);
    this.currencies = new Currencies(client);
    this.resolvers = new Resolvers(client);
  }
}
