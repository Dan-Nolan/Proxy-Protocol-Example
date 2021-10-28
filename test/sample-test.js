const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Protocol", function () {
  let protocol, proxy, proxyAsProtocol;
  before(async () => {
    const Protocol = await ethers.getContractFactory("Protocol");
    protocol = await Protocol.deploy();
    await protocol.deployed();

    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy(protocol.address);
    await proxy.deployed();

    proxyAsProtocol = await ethers.getContractAt("Protocol", proxy.address);
  });

  it("should have a number with the value 100", async function () {
    const num = await proxy.num();
    assert.equal(num.toString(), "100");
  });

  describe("we change the num to 200", () => {
    before(async () => {
      await proxyAsProtocol.action(200);
    });

    it("should store 200 in the num", async () => {
      const num = await proxy.num();
      assert.equal(num.toString(), "200");
    });

    describe("deploying a new protocol", () => {
      let protocolV2, proxyAsProtocolV2;
      before(async () => {
        const ProtocolV2 = await ethers.getContractFactory("ProtocolV2");
        protocolV2 = await ProtocolV2.deploy();
        await protocolV2.deployed();

        await proxy.upgrade(protocolV2.address);

        proxyAsProtocolV2 = await ethers.getContractAt("ProtocolV2", proxy.address);
      });

      it("should have maintain that 200 value", async () => {
        const num = await proxy.num();
        assert.equal(num.toString(), "200");
      });

      describe("modify the num through the proxy", () => {
        before(async () => {
          await proxyAsProtocolV2.action2();
        });

        it("should store the value 400", async () => {
          const num = await proxy.num();
          assert.equal(num.toString(), "400");
        });
      });
    });
  });
});
