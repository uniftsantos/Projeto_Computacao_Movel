import * as React from 'react';
import { TextInput, Text, View, Button, Image, ScrollView, StyleSheet, Vibration } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const vibracao = () => Vibration.vibrate(1000);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Estilos
const estilo = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4F8', 
  },
  titulo_inicial: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D9CDB', //azul
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    marginBottom: 15,
    fontSize: 16,
    elevation: 2, 
  },
  button: {
    backgroundColor: '#2D9CDB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagem: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 20, 
    color: '#333', 
  },
  container_imagem: {
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 10, 
  },
  livros_imagens: {
    resizeMode: 'contain', // Ajusta a proporção da imagem
    width: 100,
    height: 150,
  },
  comentario: {
  borderWidth: 1, 
  borderColor: '#ccc', 
  borderRadius: 5, 
  padding: 10, 
  marginVertical: 5, 
  backgroundColor: '#f9f9f9', 
  },
});


//Fazendo a tela de Login
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: undefined,
      senha: undefined,
    }
  }

  render() {
    return (
      <View style={estilo.container}>
        <Text style={estilo.titulo_inicial}>Seja Bem-vindo ao Leitura Vive</Text>
        <Image source={require('./img/capa.webp')} style={estilo.imagem}></Image>
        <Text>{"Digite seu usuario:"}</Text>
        <TextInput
          style={estilo.input}
          onChangeText={(texto) => this.setState({ usuario: texto })}
        ></TextInput>
        <Text>{"Digite sua senha:"}</Text>
        <TextInput
          style={estilo.input}
          onChangeText={(texto) => this.setState({ senha: texto })}
          secureTextEntry={true}
        ></TextInput>
        <View style={estilo.button}>
          <Text
            style={estilo.buttonText}
            onPress={() => this.ler()}
          >
          Logar
          </Text>
        </View>
        <View style={estilo.button}>
          <Text
            style={estilo.buttonText}
            onPress={() => this.manda_para_cadastro()}
          >
          Criar Conta
          </Text>
        </View>
      </View>
    );
  }

  manda_para_cadastro() {
    this.props.navigation.navigate('Cadastro');
  }

  async ler() {
    try {
      let senha_login = await AsyncStorage.getItem(this.state.usuario);
      if (senha_login != null) {
        if (senha_login == this.state.senha) {
          alert('Usuário Logado!');
          this.props.navigation.navigate('Tela_principal');
        } else {
          alert('Senha Incorreta!');
        }
      } else {
        alert('Usuário não cadastrado');
      }
    } catch (erro) {
      console.log(erro);
    }
  }
}

class Cadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      password: undefined,
    }
  }

  async salvar() {
    if (!this.state.user || !this.state.password) {
      alert('Necessário preencher as informações');
      return;
    }
    try {
      await AsyncStorage.setItem(this.state.user, this.state.password);
      alert('Cadastro Realizado');
      this.props.navigation.navigate('Login');
    } 
    catch (erro) {
      alert('Erro!');
    }
  }

  render() {
    return (
      <View style={estilo.container}>
        <Text style={estilo.titulo}>Tela de Cadastro</Text>
        <Text>{"Cadastrar Usuário:"}</Text>
        <TextInput
          style={estilo.input}
          onChangeText={(texto) => this.setState({ user: texto })}
        ></TextInput>
        <Text>{"Cadastrar Senha:"}</Text>
        <TextInput
          style={estilo.input}
          onChangeText={(texto) => this.setState({ password: texto })}
          secureTextEntry={true}
        />
        <View style={estilo.button}>
          <Text
            style={estilo.buttonText}
            onPress={() => this.salvar()}
          >
            Cadastrar
          </Text>
        </View>
      </View>
    );
  }
}




// Contexto para gerenciar comentários
const CommentContext = React.createContext(); 
// Cria um contexto chamado `CommentContext`.
// Este contexto será usado para compartilhar dados relacionados a comentários entre os componentes sem a necessidade de passar props manualmente.


// Provedor de Contexto
class CommentProvider extends React.Component {
  // Esta classe funciona como um "provedor" para o contexto. 
  // Ela encapsula os dados e a lógica para manipular os comentários.

  constructor(props) {
    super(props); 
    // Chama o construtor da classe React.Component.
    // `props` são as propriedades passadas para o componente.

    this.state = {
      comentarios_livros: {}, //inicializando um dicionario para armazenar os comentarios.
      // Cada `livroId` será uma chave nesse objeto, e o valor será uma lista de comentários.
    };
  }

  // Função para adicionar um comentário a um filme específico
  adiciona_comentario = (livroId, comment) => {
    // Atualiza o estado adicionando um novo comentário ao `livroId` fornecido.
    // Se não houver comentários existentes para esse `livroId`, cria uma nova lista.

    this.setState((prevState) => ({
      comentarios_livros: {
        ...prevState.comentarios_livros, 
        // Garante que os comentários existentes não sejam sobrescritos.
        [livroId]: (prevState.comentarios_livros[livroId] || []).concat(comment),
        // Adiciona o novo comentário à lista de comentários do `livroId`.
        // Se não houver uma lista para este `livroId`, cria uma lista nova.
      },
    }));
  };

  render() {
    return (
      // Provedor do contexto
      <CommentContext.Provider 
        // Passa os dados e funções do contexto para os componentes filhos
        value={{
          ...this.state, 
          // Passa o estado atual (que contém os comentários) para o contexto.
          adiciona_comentario: this.adiciona_comentario, 
          // Passa a função `adiciona_comentario` para que os componentes filhos possam usá-la.
        }}
      >
        {this.props.children}
      </CommentContext.Provider>
    );
  }
}


class Livros extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {}, // Armazena comentários temporários do usuário, separados por `livroId`.
    };
  }

  // Associa o contexto `CommentContext` à classe, permitindo acesso aos dados e funções do contexto.
  static contextType = CommentContext;

  // Método para adicionar um comentário e vibrar o dispositivo
  handlead_adiciona_comentario = (livroId) => {
    const { comment } = this.state; // Obtém o comentário temporário do estado.
    const { adiciona_comentario } = this.context; // Obtém a função `adiciona_comentario` do contexto.

    if (comment[livroId]?.trim()) {
      // Adiciona o comentário ao contexto se ele não estiver vazio.
      adiciona_comentario(livroId, comment[livroId]);

      // Faz o celular vibrar
      vibracao();

      // Limpa o comentário temporário no estado.
      this.setState({ comment: {...comment, [livroId]: '' } });
    } else {
      // Exibe um alerta se o comentário estiver vazio.
      alert("Comentário não pode ser vazio!");
    }
  };

  // Renderiza a interface de usuário.
  render() {
    const { comentarios_livros } = this.context; // Obtém os comentários armazenados no contexto.
    const { comment } = this.state; // Obtém os comentários temporários do estado.

    // Array contendo informações dos livros.
    const movies = [
      { id: '1', title: 'Suicidas', image: require('./img/SUICIDAS.jpg') },
      { id: '2', title: 'Diário de um Banana', image: require('./img/diario_banana.jpg') },
      { id: '3', title: 'O Pequeno Príncipe', image: require('./img/pequeno_principe.jfif') },
      { id: '4', title: 'A Culpa é das Estrelas', image: require('./img/culpa_estrela.jfif') },
      { id: '5', title: 'A Cabana', image: require('./img/cabana.jpg') },
    ];

    return (
      <ScrollView>
        {movies.map((movie) => (
          <View key={movie.id} style={estilo.container_imagem}>
            {/* Título do livro */}
            <Text style={estilo.titulo}>{movie.title}</Text>
            {/* Imagem do livro */}
            <Image source={movie.image} style={estilo.livros_imagens} ></Image>
            {/* Entrada de texto para adicionar comentário */}
            <TextInput
              placeholder="Comente sobre o livro :"
              style={estilo.input}
              value={comment[movie.id] || ''} // Mostra o comentário temporário correspondente ao livro.
              onChangeText={(text) => this.setState({ comment: { ...comment, [movie.id]: text } })}
            ></TextInput>
            {/* Botão para enviar o comentário */}
            <Button title="Comentar" onPress={() => this.handlead_adiciona_comentario(movie.id)} />
            {/* Lista de comentários existentes */}
            <Text>{"Comentários:"}</Text>
            <View>
              {comentarios_livros[movie.id]?.map((comm, index) => (
                <View key={index} style={estilo.comentario}>
                  <Text>{comm}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        {/* Botão para sair */}
        <Button title="Sair" onPress={() => this.props.navigation.replace("Login")} />
      </ScrollView>
    );
  }
}




class Ranking extends React.Component {
  // Conecta a classe ao contexto para acessar os comentários.
  static contextType = CommentContext;

  // Renderiza a interface de usuário.
  render() {
    const { comentarios_livros } = this.context; // Obtém os comentários do contexto.

    // Array contendo informações dos livros.
    const movies = [
      { id: '1', title: 'Suicidas', image: require('./img/SUICIDAS.jpg') },
      { id: '2', title: 'Diário de um Banana', image: require('./img/diario_banana.jpg') },
      { id: '3', title: 'O Pequeno Príncipe', image: require('./img/pequeno_principe.jfif') },
      { id: '4', title: 'A Culpa é das Estrelas', image: require('./img/culpa_estrela.jfif') },
      { id: '5', title: 'A Cabana', image: require('./img/cabana.jpg') },
    ];

    // Ordena os livros com base no número de comentários.
    const sortedMovies = movies.sort(
      (a, b) => (comentarios_livros[b.id]?.length || 0) - (comentarios_livros[a.id]?.length || 0)
    );

    return (
      // Exibe os livros ordenados pelo número de comentários.
      <ScrollView>
        <Text style={estilo.titulo}>Ranking dos Livros mais Polêmicos</Text>
        {sortedMovies.map((movie) => (
          <View key={movie.id} style={estilo.container_imagem}>
            {/* Título e imagem do livro */}
            <Text style={estilo.titulo}>{movie.title}</Text>
            <Image source={movie.image} style={estilo.livros_imagens}></Image>
            {/* Número de comentários */}
            <Text> {"Comentários:"} {comentarios_livros[movie.id]?.length || 0}</Text>
          </View>
        ))}
        {/* Botão para sair */}
        <Button title="Sair" onPress={() => this.props.navigation.replace("Login")} />
      </ScrollView>
    );
  }
}


// telas principais após login
class Tela_principal extends React.Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Livros"
          component={Livros}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Ranking"
          component={Ranking}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="podium" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

// Navegação principal
class App extends React.Component {
  render() {
    return (
      <CommentProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
            <Stack.Screen name="Cadastro" component={Cadastro}></Stack.Screen>
            <Stack.Screen name="Tela_principal" component={Tela_principal} options={{ headerShown: false }}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </CommentProvider>
    );
  }
}

export default App;
