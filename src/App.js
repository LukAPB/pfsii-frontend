import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [quartos, setQuartos] = useState([]);
  const [hospedes, setHospedes] = useState([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState(-1);
  const [hospedeSelecionado, setHospedeSelecionado] = useState(-1);

  function buscarQuartos() {
    fetch("http://localhost:4000/acomodacao")
      .then(res => res.json())
      .then(res => {
        setQuartos(res.listaAcomodacaos);
      })
      .catch(erro => {
        console.log('erro', erro)
      })
  }

  function buscarHospedes() {
    fetch("http://localhost:4000/hospede")
      .then(res => res.json())
      .then(res => {
        setHospedes(res.listaHospedes);
        console.log('res', res.listaHospedes) 
      })
      .catch(erro => {
        console.log('erro', erro)
      })
  }

  useEffect(() => {
    buscarQuartos();
    buscarHospedes();
  }, [])

  function onQuartoClick(e) {
    const id = e.target.value - 1;
    if (quartos) {
      setQuartoSelecionado(quartos[id]);
    }
  }

  function onHospedeClick(e) {
    const id = e.target.value - 1;
    console.log('id', id) 
    if (hospedes) {
      console.log('hospedes', hospedes) 
      setHospedeSelecionado(hospedes[id]);
    }
  } 

  const [dados, setDados] = useState([{}])

  function checkin(hospede_codigo, acomodacao_codigo, data_checkin, hosp_qtd) {
      console.log("aqui",acomodacao_codigo,acomodacao_codigo, data_checkin, hosp_qtd)
    const obj = {
      hospede_codigo,
      acomodacao_codigo,
      data_checkin,
      hosp_qtd
    }

    console.log('obj', obj)

    fetch("http://localhost:4000/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setQuartos(res.listaAcomodacaos);
        alert('Checkin realizado com sucesso!')
      })
      .catch(erro => {
        alert('Erro ao realizar checkin!')
        console.log('erro', erro)
      })
  }
  const handleChange = (event, index) => {
    const novoValor = event.target.value;
    const novosDados = [...dados];
    novosDados[index] = novoValor;
    setDados(novosDados);
  };

  console.log('dados', dados)
  return (
    <Container fluid className='w-100 h-100 d-flex justify-content-center mt-5'>
    <Form className='w-50 bg-dark text-white p-3 d-flex justify-content-center flex-column' style={{ borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)' }}>
      <Form.Group className="mb-3" controlId="hospede_codigo">
        <Form.Label style={{ color: '#F9A825' }}>Hóspede</Form.Label>
        <Form.Select onClick={onHospedeClick} style={{ backgroundColor: '#424242', color: '#F9A825' }}>
          <option value="-1" style={{ backgroundColor: '#424242' }}>Selecione um hóspede</option>
          {hospedes && hospedes.map((hospede, index) => (
            <option value={hospede.codigo} key={index} style={{ backgroundColor: '#424242' }}>{hospede.nome}</option>
          ))}
        </Form.Select>
        <Form.Control type="text" placeholder="Documento" className='mt-3' disabled value={hospedeSelecionado?.cpf} style={{ backgroundColor: '#424242', color: '#F9A825' }} />
        <Form.Control type="text" placeholder="Telefone" className='mt-3' disabled value={hospedeSelecionado?.telefone} style={{ backgroundColor: '#424242', color: '#F9A825' }} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="acomodacao_codigo">
        <Form.Label style={{ color: '#F9A825' }}>Quarto</Form.Label>
        <Form.Select onClick={onQuartoClick} style={{ backgroundColor: '#424242', color: '#F9A825' }}>
          <option value="-1" style={{ backgroundColor: '#424242' }}>Selecione um quarto</option>
          {quartos && quartos.map((quarto, index) => (
            <option value={quarto.codigo} key={index} style={{ backgroundColor: '#424242' }}>{quarto.tipo}</option>
          ))}
        </Form.Select>
        <Form.Control type="text" placeholder="Capacidade do quarto" className='mt-3' disabled value={quartoSelecionado?.capacidade} style={{ backgroundColor: '#424242', color: '#F9A825' }} />
        <Form.Control as="textarea" multiple placeholder="Descricao" className='mt-3' disabled value={quartoSelecionado?.descricao} style={{ backgroundColor: '#424242', color: '#F9A825' }} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="data_checkin">
        <Form.Label style={{ color: '#F9A825' }}>Data da entrada</Form.Label>
        <Form.Control type="date" onChange={(e) => handleChange(e, 1)} style={{ backgroundColor: '#424242', color: '#F9A825' }} />
      </Form.Group>
      <Button variant="warning" className='mt-5' onClick={(e) => { e.preventDefault(); checkin(hospedeSelecionado.codigo, quartoSelecionado.codigo, dados[1], quartoSelecionado.capacidade) }} >
        Enviar
      </Button>
    </Form>
  </Container>
  );
}
