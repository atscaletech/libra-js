import { ApiRx, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

let clients: Record<string, ApiRx>;

export async function createClient(rpc: string): Promise<ApiRx> {
  if (!clients[rpc]) {
    const provider = new WsProvider(rpc);
    clients[rpc] = await new ApiRx({
      provider,
      rpc: jsonrpc
    });
  }

  return clients[rpc];
}

export class Client {
  
}
