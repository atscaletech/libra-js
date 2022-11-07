import { web3Enable } from '@polkadot/extension-dapp';
import type { Signer } from '@polkadot/api/types';
import { InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';

export class WalletConnection {
  extensions: InjectedExtension[];
  isReady: boolean;

  constructor(extensions: InjectedExtension[]) {
    this.extensions = extensions;
    this.isReady = false;
  }

  async init(appName: string): Promise<WalletConnection> {
    try {
      const extensions = await web3Enable(appName);
      return new WalletConnection(extensions);
    } catch (_) {
      throw new Error('Extensions not found.');
    }
  }

  getExtensions(): InjectedExtension[] {
    return this.extensions;
  }

  getExtension(extensionName: string): InjectedExtension {
    const extension = this.extensions.find((item) => item.name === extensionName);

    if (extension) {
      return extension;
    }

    throw new Error('Invalid extension name.');
  }

  async getAccounts(extensionName: string): Promise<InjectedAccount[]> {
    const extension = this.getExtension(extensionName);
    return extension.accounts.get();
  }

  async getSigner(extensionName: string): Promise<Signer> {
    const extension = this.getExtension(extensionName);
    return extension.signer;
  }
}
