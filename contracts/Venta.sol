//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Venta{
    address payable comprador;
    bool public estadoVenta = false;
    uint public valor;
    address payable vendedor;

    event TaskCreated (
        address vendedor,
        uint valor
    );

    event TaskToggleDone (
        bool estado
    );

    function crearVenta (address payable _vendedor, uint _valor) payable public {
        valor = _valor;
        vendedor = _vendedor;
    }

    // constructor (uint _valor, address payable _vendedor) {
    //     crearVenta(_vendedor, _valor);
    // }

    function iniciarVenta() payable public {
        uint oferta = msg.value;
        uint fondos = msg.sender.balance;
        require(msg.sender == vendedor, "No eres el vendedor, no puedes confirmar el recibo");
        require(oferta >= (valor * 2), "La oferta debe de ser mayor al doble del valor de la propiedad");
        require(fondos >= (valor * 2), "No tiene fondos suficientes");
        estadoVenta = true;
    }

    function confirmarCompra() payable public{
        uint oferta = msg.value;
        uint fondos = msg.sender.balance;
        require(estadoVenta == true,"La venta no esta activa");
        require(oferta >= (valor * 2), "La oferta debe de ser mayor al doble del valor de la propiedad");
        require(fondos >= (valor * 2), "No tiene fondos suficientes");
        comprador = payable(msg.sender);
    }

    function confirmaRecibo() payable public{
        require(estadoVenta == true, "Venta inactiva");
        comprador.transfer(valor/2);
        vendedor.transfer(valor*3);
        estadoVenta = false;
    }

    function cancelarCompra() payable public{
        require(msg.sender == comprador || msg.sender == vendedor, "No eres el comprador ni el vendedor, no puedes confirmar el recibo");
        require(estadoVenta == true, "Venta inactiva");
        comprador.transfer(valor*2);
        vendedor.transfer(valor*2);
        estadoVenta= false;
    }

}