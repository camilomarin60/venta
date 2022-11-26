const TodoList = artifacts.require("TodoList.sol");
const Venta = artifacts.require("Venta.sol");

module.exports = function (deployer) {
  deployer.deploy(TodoList);
  deployer.deploy(Venta);
};
