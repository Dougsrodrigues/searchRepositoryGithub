import React, { Component } from "react";
import api from "../../services/api";
// import { Container } from './styles';

export default class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true
  };
  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    // faz a requisição das 2 ao mesmo tempo
    // a resposta é retornada em 1 array
    // primeira posição do array refere a primeira req e assim por diante
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: "open",
          per_page: 5
        }
      })
    ]);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false
    });
  }
  render() {
    const { repository, issues } = this.state;
    return <h1>Repository:</h1>;
  }
}
