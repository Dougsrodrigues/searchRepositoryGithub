import React, { Component } from "react";
import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

import api from "../../services/api";

import Container from "../../components/Container";
import { Form, SubmitButton, List } from "./styles";

export default class Main extends Component {
  state = {
    newRepo: "",
    repositories: [],
    loading: false
  };

  //Carregar dados local storage
  componentDidMount() {
    const respositories = localStorage.getItem("repositories");

    if (respositories) {
      // JSON.parse converte para objeto
      this.setState({ repositories: JSON.parse(respositories) });
    }
  }

  //Salvar dados local storage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    // se o estados de repositorios mudou do estado atual
    if (prevState.repositories !== repositories) {
      //JSON.stringify converte parse para json
      localStorage.setItem("repositories", JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    const response = await api.get(`/repos/${newRepo}`);

    const data = { name: response.data.full_name };

    this.setState({
      repositories: [...repositories, data],
      newRepo: "",
      loading: false
    });
  };
  render() {
    const { newRepo, repositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt></FaGithubAlt>
          Repositorys
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={newRepo}
            placeholder="Adicionar repositório"
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14}></FaSpinner>
            ) : (
              <FaPlus color="#fff" size={14}></FaPlus>
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
