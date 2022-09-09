const { LrpProtocol } = require('..');

describe('It should be works', () => {
  it('using lrp', () => {
    const lrp = new LrpProtocol();
    expect(lrp.createPayment()).toStrictEqual('success');
  })
})
