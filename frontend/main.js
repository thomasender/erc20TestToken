const web3 = new Web3(Web3.givenProvider);

var tokenContractAddress = "0x54956E74cb8bF3974A7a03Aef313287956E4c254";
var mtnt;
var x;
var y;
var didRequestToken;
var rewardGranted = false;

$(document).ready(function() {
    window.ethereum.enable().then(async function (accounts) {
        mtnt = new web3.eth.Contract(abi, tokenContractAddress, {from: accounts[0]});
        let user = ethereum.selectedAddress;
        console.log(user);
        userData();
        contractData();
        contractBalance();
        $("#transferTokenBtn").click(transferToken);
        $("#fundContractBtn").click(fundContract);
        $("#randomNumberBtn").click(getRandomNumber);
        $("#requestTokens").click(payToken);
        $("#grantRewardBtn").click(grantReward);
        $("#flipToken").click(flipCoin);
        
        x = document.getElementById("fundingDiv");
        y = document.getElementById("requestTokens");
        didRequestToken = await mtnt.methods.tokenRequested(user).call();
        console.log(didRequestToken);
        if(user != 0xE7D693e35fe25a6776523e1dE04F877A18f33B08) {
            x.style.display = "none";
        }
        if(didRequestToken){
            y.style.display = "none";
        }
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
    if(userTokenBalance == 0){
     console.log("Request Tokens!");
    }
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
        alert("Correct! You WIN! Sign Transanction to receive 0.1 ETH! Page will reload after TX has been approved, please stand by...");
        let amount = web3.utils.toWei("0.1", "ether");
         await mtnt.methods.payout(amount).send({from: user});
         location.reload();
        } else{
        alert("You Loose! Your Guess: " + userGuess + " Correct number: " + randomNumber + " Try Again!");
    }
    
}

async function contractBalance() {
    let contractBalance = await web3.eth.getBalance(tokenContractAddress);
    $("#contractEthBalance").append(web3.utils.fromWei(contractBalance) + " ETH");
    let contractTokenBalance = await mtnt.methods.balanceOf(tokenContractAddress).call();
    $("#contractTokenBalance").append(web3.utils.fromWei(contractTokenBalance) + " MTNT");
}

async function fundContract() {
    let fundingAmount = parseInt(web3.utils.toWei($("#fundingAmount").val()));
    try{
        await web3.eth.sendTransaction({from: ethereum.selectedAddress, to: tokenContractAddress, value: fundingAmount});
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

async function payToken(){
    let user = ethereum.selectedAddress;
    if(didRequestToken == true){
        alert("You already did request Tokens once!");
    } else{
        try{
            await mtnt.methods.payToken().send({from: user});
            location.reload();
        } catch (error) {
            console.log(error.reason);
        }
    }
  
}

async function grantReward() {
    let user = ethereum.selectedAddress;
    await mtnt.methods.setRewardGranted().send();
    let isGranted = await mtnt.methods.rewardGranted(user).call();
    console.log(isGranted);
    rewardGranted = true;
    payTokenReward();
}

async function payTokenReward(){
    if(rewardGranted == true){
        try{
            await mtnt.methods.tokenReward().send();
            rewardGranted = false;
            location.reload();
        } catch (error) {
            console.log(error);
        }
    } else {
        alert("You have not been granted any rewards!");
    }    
}

async function flipCoin(){
    var heads = $("#heads").is(':checked');
    var tails = $("#tails").is(':checked');
    var bet;
    var flip = Math.floor(Math.random() * 2);
    if (flip == 0 && heads || flip == 1 && tails){
        alert("You win! 100 MTNT Tokens go to your Account!");
        grantReward();
    } else {
        alert ("You loose!");
    }
}
