import Navigation from './navigation';
import { ApolloProvider } from '@apollo/client';
import client from './config/apollo';
import { AuthContextProvider } from './context/AuthContext';
export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </ApolloProvider>
  );
}
