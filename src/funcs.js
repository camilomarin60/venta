import VentaJSON from "../build/contracts/Venta.json";
import Web3 from "web3";
var contract = require("@truffle/contract");
let ventaContract;

export const load = async () => {
  await loadWeb3();
  const addressAcount = await loadAccount();
  ventaContract = await loadContract();
  return { addressAcount, contract: ventaContract };
};

export const getContract = async () => {
  return ventaContract;
};

const loadContract = async () => {
  const theContract = await contract(VentaJSON);
  theContract.setProvider(web3.eth.currentProvider);
  const ventaContract = await theContract.deployed();
  return ventaContract;
};

export const getBalance = async (addressAcount) => {
  return await web3.eth.getBalance(addressAcount);
};

export const loadAccount = async () => {
  await loadWeb3();
  const account = await web3.eth.getAccounts();
  return account[0];
};

const loadWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    web3.eth.sendTransaction({
      /* ... */
    });
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const crearVenta = async (input, addressAccount) => {
  try {
    const venta = await ventaContract.crearVenta(addressAccount, input, {
      from: addressAccount,
    });
    return venta;
  } catch (e) {
    console.log(e);
  }
};

export const getValor = async () => {
  const valor = await ventaContract.valor();
  return valor.toNumber();
};

export const iniciarVenta = async (addressAccount, input) => {
  try {
    const venta = await ventaContract.iniciarVenta({
      from: addressAccount,
      value: input,
    });
    return venta;
  } catch (e) {
    console.log(e);
  }
};

export const confirmarCompra = async (addressAccount, input) => {
  try {
    const compra = await ventaContract.confirmarCompra({
      from: addressAccount,
      value: input,
    });
    return compra;
  } catch (e) {
    console.log(e);
  }
};

export const cancelarCompra = async (addressAccount) => {
  try {
    const cancelar = await ventaContract.cancelarCompra({
      from: addressAccount,
    });
    return cancelar;
  } catch (e) {
    console.log(e);
  }
};

export const confirmarRecibo = async (addressAccount) => {
  try {
    const confirmacion = await ventaContract.confirmaRecibo({
      from: addressAccount,
    });
    return confirmacion;
  } catch (e) {
    console.log(e);
  }
};
