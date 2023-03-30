import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connect-button")
const fundButton = document.getElementById("fund")
const balanceButton = document.getElementById("get-balance")
const withdrawButton = document.getElementById("withdraw-button")

document.addEventListener("DOMContentLoaded", () => {
    getBalance()
})

const connect = async () => {
    const connectButton = document.getElementById("connect-button")
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected"
        } catch (error) {
            console.log(error)
        }
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

const fund = async () => {
    const ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            console.log(ethers.utils.parseEther(ethAmount))
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

const listenForTransactionMine = (transactionResponse, provider) => {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                alert(`Completed with ${transactionReceipt.confirmations} confirmations. `)
                document.getElementById("ethAmount").value = 0
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)
            document.getElementById("value").innerHTML = ethers.utils.formatEther(balance)
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = "Please install MetaMask"
    }
}

const withdraw = async () => {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            // await transactionResponse.wait(1)
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
