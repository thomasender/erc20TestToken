pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "./VRFConsumerBase.sol";

contract MyTestNetToken is ERC20, ERC20PresetFixedSupply, VRFConsumerBase {

    bytes32 public keyHash; //Identifies which oracle is to be used for
    uint256 public fee; //Fee to be send
    uint256 public randomResult; 
    address vrfCoordinatorMumbai = 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
    address linkOnMumbai = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;


constructor(
    string memory name, 
    string memory symbol, 
    uint256 initialSupply, 
    address payable owner
     ) ERC20PresetFixedSupply("MyTestNetToken", "MTNT", 1000000000000000000000000, msg.sender) 
       VRFConsumerBase (vrfCoordinatorMumbai, linkOnMumbai)
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.1 * 10 ** 18; //0.1 LINK 
    }

function getRandomNumber (uint256 userProvidedSeed) public returns(bytes32 requestId) {
    return requestRandomness(keyHash, fee, userProvidedSeed);
}

function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    randomResult = randomness;
}

function payout(uint256 amount) public {
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to transfer the funds, aborting.");
}

    receive() external payable {

    }
}