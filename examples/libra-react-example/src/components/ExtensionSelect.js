import React, { useState, useEffect } from 'react';
import { Pane, Avatar, Heading } from 'evergreen-ui';

const supportedWallets = [
  {
    name: 'polkadot-js',
    displayName: 'Polkadot.{js}',
    logo: '',
  },
  {
    name: 'subwallet-js',
    displayName: 'SubWallet',
    logo: '',
  },
];

function ExtensionOption({ name, displayName, logo, onExtensionSelected }) {
  const handleClick = () => {
    onExtensionSelected && onExtensionSelected({ name });
  };

  return (
    <Pane className='selectable' onClick={handleClick} display="flex" paddingX="16px" paddingY="8px" alignItems="center" cursor="pointer">
      <Pane marginRight="16px">
        <Avatar size={56} name={displayName} src={logo} />
      </Pane>
      <Pane>
        <Heading is="h3">{displayName}</Heading>
      </Pane>
    </Pane>
  );
}

export default function ExtensionSelect({ onExtensionSelected }) {
  return (
    <Pane display="flex" flexDirection="column" width="100%">
      {supportedWallets.map((wallet) => (
        <ExtensionOption
          onExtensionSelected={onExtensionSelected}
          key={wallet.name}
          name={wallet.name}
          displayName={wallet.displayName}
          logo={wallet.logo}
        />
      ))}
    </Pane>
  );
}
