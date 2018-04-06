import React, { Component } from 'react';
import { graphql, ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { typeDefs } from './schema';
import './App.css';

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema });
const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });
const client = new ApolloClient({
  link: new HttpLink(mockNetworkInterface),
  cache: new InMemoryCache()
});

const channelsListQuery = gql`
query ChannelsListQuery{
  channels{
    id
    name
  }
}`;


const ChannelsList = ({ data: { loading, error, channels } }) => {
  console.log('----------channels---------', channels);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul>
      {channels.map(ch => <li key={ch.id}>{ch.name}</li>)}
    </ul>
  );
}
const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Instant Message</h1>
          </header>
          <div className="channels-list">
            <ChannelsListWithData />
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
