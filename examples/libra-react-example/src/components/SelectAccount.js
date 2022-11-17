import React, { useState, useEffect } from 'react';
import { Pane, Avatar, Heading, Text } from 'evergreen-ui';

function AccountOption({ name, address, onAccountSelected }) {
  const onSelect = () => {
    onAccountSelected && onAccountSelected({ address });
  };

  return (
    <Pane
      className="selectable"
      onClick={onSelect}
      display="flex"
      paddingX="16px"
      paddingY="8px"
      alignItems="center"
      cursor="pointer"
    >
      <Pane marginRight="16px">
        <Avatar size={48} name={name} />
      </Pane>
      <Pane>
        <Heading is="h3">{name}</Heading>
        <Text marginY="4px" is="p">
          {address}
        </Text>
      </Pane>
    </Pane>
  );
}

export default function SelectAccount({ accounts, onAccountSelected }) {
  return (
    <Pane display="flex" paddingY="16px" flexDirection="column" width="100%">
      {accounts.map((account) => (
        <AccountOption
          onAccountSelected={onAccountSelected}
          key={account.address}
          name={account.name}
          address={account.address}
          logo={account.logo}
        />
      ))}
    </Pane>
  );
}
