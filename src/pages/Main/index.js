import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';

export default class Main extends Component {
  state = {
    newRepository: '',
    repositories: [],
    loading: false,
    error: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({
        repositories: JSON.parse(repositories),
      });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.state !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepository: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true, error: false });

    try {
      const { newRepository, repositories } = this.state;
      const response = await api.get(`/repos/${newRepository}`);
      const data = { name: response.data.full_name };
      this.setState({
        repositories: [...repositories, data],
      });
    } catch (err) {
      this.setState({
        error: true,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { newRepository, loading, repositories, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositories
        </h1>
        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Add repository"
            value={newRepository}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={String(repository.id)}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                details
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
