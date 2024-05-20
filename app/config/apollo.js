import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  createHttpLink,
} from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { setContext } from '@apollo/client/link/context';
const httpLink = createHttpLink({
  uri: 'https://hacktilinked.nathanielkevin.xyz/',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? 'Bearer ' + token : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
