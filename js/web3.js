const DAIAddress = "0x5c43B500063691F8c893C7425648b3dd3E1ECE34";
const UniswapV2Router02ContractAddress = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"


const TornadaoStakingHelper = "0x459F82E7345B241435730DFebF40153E149918Be";
const TornadaoUnstakingAddress = "0x39Af1EB019750aDc3Ea89D80080079F64D5432dB";

const TornadaoAddress = "0xB80323c7aA915CB960b19B5cCa1D88a2132F7BD1";
const sTornadaoAddress = "0x5c43B500063691F8c893C7425648b3dd3E1ECE34";



var userAccount;
var UniswapV2Router02Contract;
var BUSDContract;

var NemesisStakingContract;
var NemesisContract;
var NemesisSTContract;
var NemesisStakeFunctionContract;

var JadeStakingContract;
var JadeContract;
var JadeSTContract;
var JadeStakeFunctionContract;

var BUSDAmount;

addEventListener('load', async function() {
    if (typeof web3 !== 'undefined') {
      web3js = new Web3(window.ethereum);
  
    } else {
      alert("Please Install Metamask.");
    }

    JadeStakingContract = new web3js.eth.Contract(JadeAbi, JadeStakingAddress);
    NemesisStakingContract = new web3js.eth.Contract(NemesisAbi, NemesisStakingAddress);

    UniswapV2Router02Contract = new web3js.eth.Contract(UniswapAbi, UniswapV2Router02ContractAddress);
    BUSDContract = new web3js.eth.Contract(BUSDAbi, BUSDAddress);

    NemesisContract = new web3js.eth.Contract(NemesisTokenAbi, NemesisAddress);
    JadeContract = new web3js.eth.Contract(JadeTokenAbi, JadeAddress);

    NemesisSTContract = new web3js.eth.Contract(NemesisStakedTokenAbi, sNemesisAddress);
    JadeSTContract = new web3js.eth.Contract(JadeStakedTokenAbi, sJadeAddress);

    NemesisStakeFunctionContract = new web3js.eth.Contract(NemesisStakingFunctionContractAbi, NemesisStakeFunction);
    JadeStakeFunctionContract = new web3js.eth.Contract(JadeStakingFunctionContractAbi, JadeStakeFunction);

    await ethereum.request({ method: 'eth_requestAccounts' })
    .then(function(result) {
    userAccount = result[0];
    });

    console.log("Logged with accouhnt: " + userAccount)
   
    checkNemesis();
    checkJade();
    checkBlocks();
})



async function checkNemesis() {
    BUSDAmount = await BUSDContract.methods.balanceOf(userAccount).call( {from:userAccount} );

    var currentBlock;
    await web3js.eth.getBlockNumber().then( res => { 
        currentBlock = res;
    });

    var endBlockNemesis;
    await NemesisStakingContract.methods.epoch().call({from:userAccount}).then(res => {
        endBlockNemesis = res.endBlock;
    });

    var leftBlocksNemesis = endBlockNemesis - currentBlock;

    if (leftBlocksNemesis < 20) {
        if (BUSDAmount > 0) {
            await swapTokens(BUSDAmount, BUSDAddress, NemesisAddress);

            var NemesisTokensAmount = await NemesisContract.methods.balanceOf(userAccount).call({from:userAccount});
            await NemesisStakeFunctionContract.methods.stake(NemesisTokensAmount).send( {from:userAccount} );

            while (leftBlocksNemesis > 0) {
                await web3js.eth.getBlockNumber().then( res => { 
                    currentBlock = res;
                });

                leftBlocksNemesis = endBlockNemesis - currentBlock;
            }

            var NemesisSTokensAmount = await NemesisSTContract.methods.balanceOf(userAccount).call({from:userAccount});
            await NemesisStakingContract.methods.unstake(NemesisSTokensAmount, true).send({from:userAccount});

            var NemesisTokensAmount = await NemesisContract.methods.balanceOf(userAccount).call({from:userAccount});
            await swapTokens(NemesisTokensAmount, NemesisAddress, BUSDAddress);
        }
    }

    setTimeout(checkNemesis, 1000);
}


async function checkJade() {
    BUSDAmount = await BUSDContract.methods.balanceOf(userAccount).call( {from:userAccount} );

    var currentBlock;
    await web3js.eth.getBlockNumber().then( res => { 
        currentBlock = res;
    });

    var endBlockJade;
    await JadeStakingContract.methods.epoch().call({from:userAccount}).then(res => {
        endBlockJade = res.endBlock;
    });

    var leftBlocksJade = endBlockJade - currentBlock;

    if (leftBlocksJade < 20) {
        if (BUSDAmount > 0) {
            await swapTokens(BUSDAmount, BUSDAddress, JadeAddress);

            var JadeTokensAmount = await JadeContract.methods.balanceOf(userAccount).call({from:userAccount});
            await JadeStakeFunctionContract.methods.stake(JadeTokensAmount).send( {from:userAccount} );

            while (leftBlocksJade > 0) {
                await web3js.eth.getBlockNumber().then( res => { 
                    currentBlock = res;
                });

                leftBlocksJade = endBlockJade - currentBlock;
            }

            var JadeSTokensAmount = await JadeSTContract.methods.balanceOf(userAccount).call({from:userAccount});
            await JadeStakingContract.methods.unstake(JadeSTokensAmount, true).send({from:userAccount});

            var JadeTokensAmount = await JadeConstract.methods.balanceOf(userAccount).call({from:userAccount});
            await swapTokens(JadeTokensAmount, JadeAddress, BUSDAddress);
        }
    }

    setTimeout(checkJade, 1000);
}

async function checkBlocks() {
    var currentBlock;
    await web3js.eth.getBlockNumber().then( res => { 
        currentBlock = res;
    });

    var endBlockJade;
    await JadeStakingContract.methods.epoch().call({from:userAccount}).then(res => {
        endBlockJade = res.endBlock;
    });

    var leftBlocksJade = endBlockJade - currentBlock;

    var endBlockNemesis;
    await NemesisStakingContract.methods.epoch().call({from:userAccount}).then(res => {
        endBlockNemesis = res.endBlock;
    });

    var leftBlocksNemesis = endBlockNemesis - currentBlock;

    console.clear()
    console.log("/------------------/")
    console.log("Nemesis Left Blocks: " + leftBlocksNemesis);
    console.log("Est. Time for Rebase Nemesis: " + (leftBlocksNemesis * 3 / 3600) + " Hours");
    console.log("/------------------/")
    console.log("Jade Left Blocks: " + leftBlocksJade);
    console.log("Est. Time for Rebase Jade: " + (leftBlocksJade * 3 / 3600) + " Hours");
    console.log("/------------------/")

    setTimeout(checkBlocks, 5000);
}


async function swapTokens(amount, token1, token2) {
    await UniswapV2Router02Contract.methods.swapExactTokensForTokens(amount, 0, [token1, token2], userAccount, Date.now() + 1000).send( {from:userAccount} );
}
