const web3 = new Web3(Web3.givenProvider);

var tokenContractAddress = "0xB9de79Bb75b259b47c1C5D332c89a2ABBCaf7E62";
var mtnt;
var x;
var y;
var didRequestToken;

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
        x = document.getElementById("fundingDiv");
        y = document.getElementById("requestTokens");
        didRequestToken = await mtnt.methods.tokenRequested().call();
        if(user != 0xD9Dbca32cC6Ae2A58445f65b8DEE4A4706D6C09a) {
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
        alert("Correct! You WIN!");
        let amount = web3.utils.toWei("0.1", "ether");
        console.log(amount);
         await mtnt.methods.payout(amount).send({from: user});
        
        } else{
        alert("You Loose! The number was " + randomNumber + " Try Again!");
    }
    console.log(userGuess);
    console.log(randomNumber);
    location.reload();
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
        web3.eth.sendTransaction({from: ethereum.selectedAddress, to: tokenContractAddress, value: fundingAmount});
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
        } catch (error) {
            console.log(error.reason);
        }
    }
  
}