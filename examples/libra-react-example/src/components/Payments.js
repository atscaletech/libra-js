import React, { useState } from 'react';
import { Pane, Label, Button, TextareaField, TextInputField, TextInput, Dialog, toaster } from 'evergreen-ui';

const defaultFormState = {
  payee: '',
  amount: '',
  currencyId: 'Native',
  description: '',
  receipt: '',
};

export default function Payments({ libra, account }) {
  const [paymentForm, setPaymentForm] = useState(defaultFormState);

  const updatePaymentForm = (field, value) => {
    setPaymentForm({
      ...paymentForm,
      [field]: value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async () => {
    setIsSubmitting(true);

    try {
      const { hash, onCompleted } = await libra.lrp.createPayment(paymentForm, account);
      toaster.success(`Processing: Payment is process with tx hash: ${hash}`);

      await onCompleted;
      toaster.success(`Success: Payment is created successfully!`);
    } catch (e) {
      toaster.danger(`😞 Error: ${e.message}`);
    }

    setIsSubmitting(false);
  };

  const discardForm = () => {
    setPaymentForm(defaultFormState);
  };

  return (
    <Pane maxWidth='560px' marginX='auto'>
      <Pane display="flex" justifyContent="space-between">
        <Pane flex="2 0 0" paddingRight="16px">
          <TextInputField
            label="Payee:"
            placeholder="Payee address:"
            value={paymentForm.name}
            onInput={(e) => updatePaymentForm('payee', e.target.value)}
            required
          />
          <Pane display="flex" alignItems="flex-end">
            <TextInputField
              flex={1}
              value={paymentForm.amount}
              onChange={(e) => updatePaymentForm('amount', e.target.value)}
              label="Payment amount:"
              placeholder="Amount of currency"
              required
            />

            <Pane display="flex" flexDirection="column" marginLeft="8px" marginBottom="24px" width="80px">
              <Label marginBottom="8px">Currency:</Label>
              <TextInput width="100%" value="Native" disabled readOnly></TextInput>
            </Pane>
          </Pane>
        </Pane>
      </Pane>

      <TextareaField
        inputHeight={120}
        value={paymentForm.description}
        onInput={(e) => updatePaymentForm('description', e.target.value)}
        label="Payment description:"
        description="Please describe about the payment detail such as purpose"
        required
      />

      <TextareaField
        inputHeight={120}
        value={paymentForm.receipt}
        onInput={(e) => updatePaymentForm('receipt', e.target.value)}
        label="Payment receipt:"
        description="Please input the payment receipt"
        required
      />

      <Pane display="flex" justifyContent="flex-end" paddingBottom={24}>
        <Button disabled={isSubmitting} onClick={discardForm}>
          Discard
        </Button>
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting}
          appearance="primary"
          marginLeft={16}
          onClick={submitForm}
        >
          Create Payment
        </Button>
      </Pane>
    </Pane>
  );
}
