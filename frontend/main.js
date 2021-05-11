const web3 = new Web3(Web3.givenProvider);

var tokenContractAddress = "0x5692924fA5Bbd483eEf88b4d02D288D849824ceE";
var mtnt;

$(document).ready(function() {
    window.ethereum.enable().then(async function (accounts) {
        mtnt = new web3.eth.Contract(abi, tokenContractAddress, {from: accounts[0]});
        userData();
        contractData();
        contractBalance();
        $("#transferTokenBtn").click(transferToken);
        $("#fundContractBtn").click(fundContract);
        $("#randomNumberBtn").click(getRandomNumber);
    })
})

async function contractData() {
    let tokenName = await mtnt.methods.name().call();
    let tokenSymbol = await mtnt.methods.symbol().call();
    let tokenTotalSupply = await mtnt.methods.totalSupply().call();
    let tokenDecimals = await mtnt.methods.decimals().call();

    $("#tokenName").append(tokenName);
    $("#tokenSymbol").append(tokenSymbol);
    $("#tokenTotalSupply").append(tokenTotalSupply);
    $("#tokenDecimals").append(tokenDecimals);

    
}

async function userData() {
    let user = ethereum.selectedAddress;
    let userEthBalance = await web3.eth.getBalance(user);
    let userTokenBalance = await mtnt.methods.balanceOf(user).call();

    $("#userEthBalance").append(web3.utils.fromWei(userEthBalance)  + " ETH");
    $("#userTokenBalance").append(web3.utils.fromWei(userTokenBalance) + " MTNT");
}

async function transferToken () {
    let user = ethereum.selectedAddress;
    let recipient = $("#transferRecipient").val();
    let isAddress = web3.utils.isAddress(recipient);
    let transferAmount = $("#transferTokenAmount").val();
    if(isAddress){
        try{
            await mtnt.methods.transfer(recipient, transferAmount).send({from: user});
            location.reload();
        } catch(error){
            console.log(error);
        }
    } else {
        alert("Please enter a valid Ethereum address!");
    }
}

async function getRandomNumber() {
    let user = ethereum.selectedAddress;
    let userGuess = parseInt($("#userGuess").val());
    let randomNumber = Math.floor(Math.random() * 11);
    if(isNaN(userGuess)){
        alert("Please insert a valid number!");
    }
    else if(userGuess === randomNumber){
        alert("You WIN!");
        let amount = web3.utils.toWei("0.1", "ether");
        console.log(amount);
         await mtnt.methods.payout(amount).send({from: user});
         location.reload();
        } else{
        alert("You Loose!");
    }
    console.log(userGuess);
    console.log(randomNumber);
}

async function contractBalance() {
    let contractBalance = await web3.eth.getBalance(tokenContractAddress);
    $("#contractEthBalance").append(web3.utils.fromWei(contractBalance) + " ETH");
}

async function fundContract() {
    let fundingAmount = parseInt(web3.utils.toWei($("#fundingAmount").val()));
    try{
        web3.eth.sendTransaction({from: ethereum.selectedAddress, to: tokenContractAddress, value: fundingAmount});
        location.reload();
    } catch (error) {
        console.log(error);
    }
}