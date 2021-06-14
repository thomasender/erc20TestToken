// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";



contract MyTestNetToken is ERC20, ERC20PresetFixedSupply {
   
constructor(
    string memory name, 
    string memory symbol, 
    uint256 initialSupply, 
    address payable owner,
    address forwarder
     ) ERC20PresetFixedSupply("MyTestNetToken", "MTNT", 1000000000000000000000000, msg.sender) 
    {
    }


function payout(uint256 amount) public {
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to transfer the funds, aborting.");
}

    receive() external payable {

    }


}