const MyTestNetToken = artifacts.require("MyTestNetToken");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(
    MyTestNetToken,
    "MyTestNetToken",
    "MTNT",
    1000000,
    accounts[0]
  );
  console.log("Owner should be: " + accounts[0]);
};
