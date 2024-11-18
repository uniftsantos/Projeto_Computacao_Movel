import * as React from 'react';
import {TextInput, Text, View, Button, Image, ScrollView, StyleSheet, Vibration } from 'react-native';
import {NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator } from '@react-navigation/stack';
import {MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const vibracao = () => Vibration.vibrate(1000);

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

//Salvando os comentarios usando async-storage
const salvarComentario = async (livroId, comentario) => {
    const comentariosString = await AsyncStorage.getItem('comentarios');
    const comentarios = comentariosString ? JSON.parse(comentariosString) : {};
    const comentariosLivro = comentarios[livroId] || [];
    comentarios[livroId] = [...comentariosLivro, comentario];
    await AsyncStorage.setItem('comentarios', JSON.stringify(comentarios));
  
}

const carregarComentarios = async () => {
  const comentariosString = await AsyncStorage.getItem('comentarios');
  return comentariosString ? JSON.parse(comentariosString) : {};
 
}


//css
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
        <Text style={estilo.titulo_inicial}>{"Seja Bem-vindo ao Leitura Vive"}</Text>
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
    if (!this.state.user || !this.state.password) {//verificacao para ver se não está vazio.
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



class Livros extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {}, // Comentários temporários por livro
      comentarios: {}, // Comentários carregados do AsyncStorage
    };
  }

  async componentDidMount() {
    const comentarios = await carregarComentarios();
    this.setState({ comentarios });
  }

handleAdicionarComentario = async (livroId) => {
  const { comment, comentarios } = this.state;

  if (comment[livroId]?.trim()) {
    const novoComentario = comment[livroId];
    await salvarComentario(livroId, novoComentario);

    const comentariosAtualizados = await carregarComentarios(); // Recarrega todos os comentários
    this.setState({
      comentarios: comentariosAtualizados,
      comment: { ...comment, [livroId]: '' },
    });

    vibracao();

  } else {
    alert('Comentário não pode ser vazio!');
  }
}


  render() {
    const { comment, comentarios } = this.state;

    const lista_livros = [
      { id: '1', title: 'Suicidas', image: require('./img/SUICIDAS.jpg') },
      { id: '2', title: 'Diário de um Banana', image: require('./img/diario_banana.jpg') },
      { id: '3', title: 'O Pequeno Príncipe', image: require('./img/pequeno_principe.jfif') },
      { id: '4', title: 'A Culpa é das Estrelas', image: require('./img/culpa_estrela.jfif') },
      { id: '5', title: 'A Cabana', image: require('./img/cabana.jpg') },
    ];

    return (
      <ScrollView>
        {lista_livros.map((livro) => (
          <View key={livro.id} style={estilo.container_imagem}>
            <Text style={estilo.titulo}>{livro.title}</Text>
            <Image source={livro.image} style={estilo.livros_imagens} />
            <TextInput
              placeholder="Comente sobre o livro:"
              placeholderTextColor="#999"
              style={estilo.input}
              value={comment[livro.id] || ''}
              onChangeText={(text) =>
                this.setState({ comment: { ...comment, [livro.id]: text } })
              }
            />
            <Button
              title="Comentar"
              onPress={() => this.handleAdicionarComentario(livro.id)}
            />
            <Text>Comentários:</Text>
            {comentarios[livro.id]?.map((comm, index) => (
              <View key={index} style={estilo.comentario}>
                <Text>{comm}</Text>
              </View>
            ))}
          </View>
        ))}
        <Button
          title="Sair"
          onPress={() => this.props.navigation.replace('Login')}
        />
      </ScrollView>
    );
  }
}

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comentarios: {}, // Comentários carregados do AsyncStorage
    }
  }

  // Função para carregar os comentários
  carregarComentarios = async () => {
    const comentarios = await carregarComentarios();
    this.setState({ comentarios });
  };

  componentDidMount() {
    this.carregarComentarios();
    this.remover_listener = this.props.navigation.addListener('focus', this.carregarComentarios);
  }

  componentWillUnmount() {
    this.remover_listener && this.remover_listener();
  }

  render() {
    const { comentarios } = this.state;

    const lista_livros = [
      { id: '1', title: 'Suicidas', image: require('./img/SUICIDAS.jpg') },
      { id: '2', title: 'Diário de um Banana', image: require('./img/diario_banana.jpg') },
      { id: '3', title: 'O Pequeno Príncipe', image: require('./img/pequeno_principe.jfif') },
      { id: '4', title: 'A Culpa é das Estrelas', image: require('./img/culpa_estrela.jfif') },
      { id: '5', title: 'A Cabana', image: require('./img/cabana.jpg') },
    ];

    //funcao para ordenar a lista.
    const livros_ordenados = lista_livros.sort(
      (a, b) => (comentarios[b.id]?.length || 0) - (comentarios[a.id]?.length || 0)
    );

    return (
      <ScrollView>
        <Text style={estilo.titulo}>{"Ranking dos Livros mais Polêmicos"}</Text>
        {livros_ordenados.map((livro) => (
          <View key={livro.id} style={estilo.container_imagem}>
            <Text style={estilo.titulo}>{livro.title}</Text>
            <Image source={livro.image} style={estilo.livros_imagens}></Image>
            <Text>{"Comentários:"} {comentarios[livro.id]?.length || 0}</Text>
          </View>
        ))}
        <Button
          title="Sair"
          onPress={() => this.props.navigation.replace('Login')}
        />
      </ScrollView>
    );
  }
}

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
        ></Tab.Screen>
        <Tab.Screen
          name="Ranking"
          component={Ranking}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="podium" color={color} size={size}></MaterialCommunityIcons>
            ),
          }}
        ></Tab.Screen>
      </Tab.Navigator>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Cadastro" component={Cadastro}></Stack.Screen>
          <Stack.Screen
            name="Tela_principal"
            component={Tela_principal}
            options={{ headerShown: false }}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
