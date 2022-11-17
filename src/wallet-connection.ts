import { web3Enable } from '@polkadot/extension-dapp';
import type { Signer } from '@polkadot/api/types';
import { InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';
export class WalletConnection {
  name: string;
  extensions: InjectedExtension[];
  isReady: boolean;

  constructor(name: string) {
    this.name = name;
    this.extensions = [];
    this.isReady = false;
  }

  async connect(): Promise<void> {
    try {
      const extensions = await web3Enable(this.name);
      this.extensions = extensions;
      this.isReady = true;
    } catch (_) {
      throw new Error('Extensions not found.');
    }
  }

  async getExtensions(): Promise<InjectedExtension[]> {
    if (!this.isReady) {
      await this.connect();
    }
    return this.extensions;
  }

  async getExtension(extensionName: string): Promise<InjectedExtension | null> {
    if (!this.isReady) {
      await this.connect();
    }
    const extension = this.extensions.find((item) => item.name === extensionName);

    if (extension) {
      return extension;
    }

    return null;
  }

  async getAccounts(extensionName: string): Promise<InjectedAccount[]> {
    const extension = await this.getExtension(extensionName);
    return extension ? extension.accounts.get() : [];
  }

  async getSigner(extensionName: string): Promise<Signer | null> {
    const extension = await this.getExtension(extensionName);
    return extension ? extension.signer : null;
  }
}
