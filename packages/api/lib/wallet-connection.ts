import { web3Enable } from '@polkadot/extension-dapp';
import type { Signer } from '@polkadot/api/types';
import { InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';

export class WalletConnection {
  extensions: InjectedExtension[];

  constructor(extensions: InjectedExtension[]) {
    this.extensions = extensions;
  }

  async init(appName: string) {
    try {
      const extensions = await web3Enable(appName);
      return new WalletConnection(extensions);
    } catch {
      throw new Error('Extensions not found.');
    }
  }

  getExtensions(): InjectedExtension[] {
    return this.extensions;
  }

  getExtension(extensionName: string) {
    const extension = this.extensions.find((item) => item.name === extensionName);

    if (extension) {
      return extension;
    }

    throw new Error('Invalid extension name.');
  }

  async getAccounts(extensionName: string): Promise<InjectedAccount[]> {
    try {
      const extension = this.getExtension(extensionName);
      return extension.accounts.get();
    } catch (err) {
      throw err;
    }
  }

  async getSigner(extensionName: string): Promise<Signer> {
    try {
      const extension = this.getExtension(extensionName);
      return extension.signer;
    } catch (err) {
      throw err;
    }
  }
}
