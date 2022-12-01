import Head from "next/head";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Box,
  Spacer,
  Textarea,
  ButtonGroup,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";
import {
  load,
  getBalance,
  loadAccount,
  crearVenta,
  getValor,
  iniciarVenta,
  confirmarCompra,
  cancelarCompra,
  confirmarRecibo,
} from "../src/funcs";

export default function Home() {
  const [input, setInput] = React.useState<number>(0);
  const [refresh, setRefresh] = React.useState<boolean>(true);
  const [textArea, setTextArea] = React.useState<string>("");
  const [venta, setVenta] = React.useState<any>(null);
  const isError = input ? input < 0 : false;
  const [addressAccount, setAddresAccount] = React.useState<any>(null);
  const [ownerAddress, setOwnerAddress] = React.useState<any>(null);
  const [contract, setContract] = React.useState<boolean>(false);
  const [estadoVenta, setEstadoVenta] = React.useState<boolean>(false);
  const [compradorAddress, setCompradrorAddress] = React.useState<any>(null);

  // Handlers

  const handleInputChange = (e: any) => setInput(e.currentTarget.value);
  const handleTextAreaChange = (e: any) => setInput(e.currentTarget.value);
  const crearVentaAction = async () => {
    if (!(input > 0)) {
      setTextArea("El valor debe de ser mayor a 0");
      return;
    }
    try {
      const v = await crearVenta(input, addressAccount);
      console.log(v);
      setVenta(true);
      setOwnerAddress(addressAccount);
      localStorage.setItem("ownerAddress", addressAccount);
      localStorage.setItem("valorVenta", input.toString());
      setInput(0);
    } catch (e) {
      console.log(e);
    }
  };

  const iniciarVentaAction = async () => {
    const balance: number = Number(await getBalance(addressAccount));
    const valor = await getValor();
    const oferta = Number(input);
    console.log(oferta);
    console.log(valor);
    if (balance < oferta) {
      setTextArea("No tienes el balance suficiente");
      return;
    } else if (oferta < Number(valor * 2)) {
      setTextArea("La oferta es menor al doble de valor del inmueble");
      return;
    } else {
      setTextArea("");
    }

    try {
      const venta = await iniciarVenta(addressAccount, oferta);
      localStorage.setItem("estadoVenta", JSON.stringify(true));
      localStorage.setItem("venta", JSON.stringify(true));
      console.log(venta);
      setEstadoVenta(true);
      setTextArea("Venta en proceso.");
      setInput(0);
    } catch (e: any) {
      console.log(e);
    }
  };

  const confirmarCompraAction = async () => {
    const balance: number = Number(await getBalance(addressAccount));
    const oferta = Number(input);
    const valor: number = await getValor();
    if (oferta > balance) {
      setTextArea("No tienes el balance suficiente");
      return;
    } else if (oferta < valor * 2) {
      setTextArea("La oferta es menor al doble de valor del inmueble");
      return;
    } else if (!estadoVenta) {
      setTextArea("La venta está inactiva");
      return;
    } else {
      setTextArea("");
    }

    try {
      const compra = await confirmarCompra(addressAccount, oferta);
      console.log(compra);
      localStorage.setItem("compradorAddress", addressAccount);
      setCompradrorAddress(addressAccount);
      setInput(0);
    } catch (e: any) {
      console.log(e);
    }
  };

  const cancelarCompraAction = async () => {
    if (addressAccount != compradorAddress && addressAccount != ownerAddress) {
      setTextArea("No eres el comprador.");
      return;
    } else if (!estadoVenta) {
      setTextArea("La venta está inactiva");
      return;
    } else {
      setTextArea("");
    }

    try {
      await cancelarCompra(addressAccount);
      setEstadoVenta(false);
      localStorage.removeItem("compradorAddress");
      setCompradrorAddress(null);
    } catch (e: any) {
      console.log(e);
    }
  };

  const confirmarReciboAction = async () => {
    if (addressAccount != compradorAddress) {
      setTextArea("No eres el comprador.");
      return;
    } else if (!estadoVenta) {
      setTextArea("La venta está inactiva");
      return;
    } else {
      setTextArea("");
    }

    try {
      const confirmacion = await confirmarRecibo(addressAccount);
      console.log(confirmacion);
      setTextArea("La venta fue completada");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      localStorage.clear();
      window.location.reload();
    } catch (e: any) {
      console.log(e);
    }
  };

  const crearContrato = async () => {
    load().then(async (e) => {
      setAddresAccount(e.addressAcount);
      setContract(e.contract ? true : false);
      localStorage.setItem("contract", JSON.stringify(true));
      localStorage.setItem("ownerAddress", e.addressAcount);
      console.log("Account: " + e.addressAcount);
    });
  };
  // React useEffect

  React.useEffect(() => {
    if (localStorage.getItem("ownerAddress")) {
      setOwnerAddress(localStorage.getItem("ownerAddress"));
    }

    if (localStorage.getItem("contract")) {
      setContract(localStorage.getItem("contract") ? true : false);
    }

    if (localStorage.getItem("estadoVenta")) {
      setEstadoVenta(localStorage.getItem("estadoVenta") ? true : false);
    }

    if (localStorage.getItem("compradorAddress")) {
      setCompradrorAddress(localStorage.getItem("compradorAddress"));
    }

    if (localStorage.getItem("venta")) {
      setVenta(localStorage.getItem("venta"));
    }
    loadAccount().then((e) => {
      setAddresAccount(e);
    });
    load();
  });

  return (
    <VStack>
      <Head>
        <title>Venta</title>
        <meta name="description" content="Blockchain TodoList." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HStack w="full">
        <Spacer />
        <VStack>
          <Heading textColor="green">Blockchain Venta</Heading>
          <Box h="30px" />
          {contract && (
            <>
              {!compradorAddress && (
                <FormControl isInvalid={isError}>
                  <FormLabel>
                    {venta ? "Valor de oferta" : "Valor de la venta"}
                  </FormLabel>
                  <Input
                    type="number"
                    size="md"
                    placeholder={
                      venta ? "Valor de oferta" : "Valor de la venta"
                    }
                    onChange={handleInputChange}
                    value={input}
                  />
                  {!isError ? null : (
                    <FormErrorMessage>
                      Ingresa un valor positivo
                    </FormErrorMessage>
                  )}
                </FormControl>
              )}
              <Textarea
                value={textArea}
                onChange={handleTextAreaChange}
                size="lg"
                disabled={true}
              ></Textarea>
              {venta && ownerAddress != addressAccount && !compradorAddress && (
                <div>
                  <Text>
                    {"El valor del inmueble es : " +
                      localStorage.getItem("valorVenta")}
                  </Text>
                </div>
              )}

              <ButtonGroup gap="2">
                {!venta && ownerAddress == addressAccount && (
                  <Button onClick={crearVentaAction} bg="green" color="white">
                    Crear Venta
                  </Button>
                )}
                {venta && ownerAddress == addressAccount && !estadoVenta && (
                  <Button onClick={iniciarVentaAction} bg="green" color="white">
                    iniciar venta
                  </Button>
                )}
                {venta && estadoVenta && compradorAddress == addressAccount && (
                  <Button
                    onClick={cancelarCompraAction}
                    bg="green"
                    color="white"
                  >
                    Cancelar Venta
                  </Button>
                )}
                {venta && ownerAddress != addressAccount && !compradorAddress && (
                  <Button
                    onClick={confirmarCompraAction}
                    bg="green"
                    color="white"
                  >
                    Confirmar compra
                  </Button>
                )}
                {venta && compradorAddress == addressAccount && (
                  <>
                    <Button
                      onClick={confirmarReciboAction}
                      bg="green"
                      color="white"
                    >
                      Confirmar recibo
                    </Button>
                  </>
                )}
              </ButtonGroup>
            </>
          )}
          {!contract && (
            <ButtonGroup gap="2">
              <Button onClick={crearContrato} colorScheme="blue">
                Crear contrato
              </Button>
            </ButtonGroup>
          )}
          <Box />
        </VStack>
        <Spacer />
      </HStack>
    </VStack>
  );
}
