import * as React from 'react';
import { TextInput, Text, View, Button, FlatList, Image,ScrollView  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Tab = createBottomTabNavigator();


// Fazendo a tela de login.
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: undefined,
      senha: undefined,
    }
  }

  render(){
    return(
      <View>
        <Text>{"Digite seu usuario:"}</Text>
        <TextInput onChangeText = {(texto)=>this.setState({usuario: texto})}></TextInput>
        <Text>{"Digite sua senha:"}</Text>
        <TextInput onChangeText = {(texto)=>this.setState({senha:texto})} secureTextEntry={true}></TextInput>
        <Button title= "Logar" onPress={()=>this.ler()}></Button>
        <Text>{"Caso não tenha conta, clique para se cadastrar"}</Text>
        <Button title= "Criar Conta" onPress={() =>this.manda_para_cadastro()}></Button>
      </View>
    )
  }

  manda_para_cadastro(){
    this.props.navigation.navigate("Criar Usuário");
  }

  async ler(){
    try{
      let senha_login = await AsyncStorage.getItem(this.state.usuario);
      if(senha_login != null){
        if(senha_login == this.state.senha){
          alert("Usuário Logado !");
          await AsyncStorage.setItem('usuario_logado', 'true');//dando permissao para o usuario poder mexer na pagina.
          this.props.navigation.navigate("Livros");
        }
        else{
          alert("Senha Incorreta !");
        }
      }
      else{
        alert("Usuario não Cadastrado");
      } 
    }
    catch(erro){
        console.log(erro);
    }
  }
}

// async ler() {
//   try {
//     let senha = await AsyncStorage.getItem(this.state.usuario);
//     if (senha != null) {
//       if (senha == this.state.senha) {
//         alert("Logado!");
//         //await AsyncStorage.setItem('usuario_logado', 'true'); // Seta o login no AsyncStorage
//         this.props.navigation.navigate("Livros");
//         } 
//           else {
//             alert("Senha Incorreta!");
//           }
//       } 
//         else {
//           alert("Usuário não foi encontrado!");
//         }
//     } catch (erro) {
//       console.log(erro);
//     }
//   }
// }

// Fazedo Tela de Cadastro
class Cadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      password: undefined,
    }
  }

  async salvar() {
    try {
      await AsyncStorage.setItem(this.state.user, this.state.password);
      alert("Cadastro Realizado");
      
    } catch (erro) {
      alert("Erro!");
    }
  }

  render() {
    return (
      <View>
        <Text>{"Cadastrar Usuário:"}</Text>
        <TextInput onChangeText={(texto) => this.setState({ user: texto })}></TextInput>
        <Text>{"Cadastrar Senha:"}</Text>
        <TextInput onChangeText={(texto) => this.setState({ password: texto })} secureTextEntry={true}></TextInput>
        <Button title="Cadastrar" onPress={() => this.salvar()}></Button>
      </View>
    )
  }
}

class Livros extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario_logado: false, // Verifica se o usuário está logado
      comment: '', // Guarda o texto do comentário
      comments: {}, // Armazena os comentários por filme
    }
  }

  // Função chamada ao carregar a tela para verificar se o usuário está logado
  async componentDidMount() {
    const usuario_logado = await AsyncStorage.getItem('usuario_logado');
    if (usuario_logado !== 'true') {
      alert("Necessário fazer login para acessar essa página");
      // Se não estiver logado, pode redirecionar para a página de login
      this.props.navigation.navigate("Login");
    } else {
      this.setState({ usuario_logado: true });
    }
  }

  // Função para adicionar comentário para um filme específico
  addComment(movieId) {
    this.setState((prevState) => ({
      comments: {
        ...prevState.comments,
        [movieId]: (prevState.comments[movieId] || []).concat(prevState.comment),
      },
      comment: '', // Limpa o campo de comentário após enviar
    }));
  }

  render() {
    if (!this.state.usuario_logado) return null; // Não renderiza nada se o usuário não estiver logado

    // Definindo os filmes, agora com o caminho relativo para imagens locais
    const movies = [
      { id: '1', title: 'Suicidas', image: require('./img/SUICIDAS.jpg') }, // Imagem local
      { id: '2', title: 'Diário de um banana' ,image: require('./img/diario_banana.jpg') }, // Imagem local
      { id: '3', title: 'Pequeno Príncipe' ,image: require('./img/pequeno_principe.jfif') },
      { id: '4', title: 'A Culpa é das Estrelas' ,image: require('./img/culpa_estrela.jfif') },
      { id: '5', title: 'A Cabana' ,image: require('./img/cabana.jpg') }, 
    ];

    // Ordenando os filmes pelo número de comentários (ranking)
    const sortedMovies = [...movies].sort((a, b) => {
      const commentsA = this.state.comments[a.id] || [];
      const commentsB = this.state.comments[b.id] || [];
      return commentsB.length - commentsA.length; // Maior número de comentários primeiro
    });

    return (
      <ScrollView style={{ flex: 1 }}>
        {/* Exibindo os filmes com seus comentários */}
        <FlatList
          data={sortedMovies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
              {/* Exibindo imagem do filme */}
              <Image source={item.image} style={{ width: 200, height: 300, marginBottom: 10 }} />
              {/* Campo de entrada de comentário */}
              <TextInput
                placeholder="Escreva um comentário"
                value={this.state.comment}
                onChangeText={(text) => this.setState({ comment: text })}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  paddingLeft: 10,
                  width: 250,
                }}
              />
              {/* Botão para adicionar comentário */}
              <Button title="Comentar" onPress={() => this.addComment(item.id)} />
              {/* Exibe o número de comentários */}
              <Text>Comentarios: {this.state.comments[item.id]?.length || 0}</Text>
              {/* Exibe os comentários do filme */}
              {(this.state.comments[item.id] || []).map((c, index) => (
                <Text key={index} style={{ marginTop: 5 }}>{c}</Text>
              ))}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }} // Adicionando padding extra no final para melhorar a rolagem
        />
      </ScrollView>
    );
  }
}

// Navegação Login
class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="home-account" color={color} size={size} />)
            }}
          />
          <Tab.Screen
            name="Criar Usuário"
            component={Cadastro}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account-details" color={color} size={size} />)
            }}
          />
          <Tab.Screen
            name="Livros"
            component={Livros}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="book" color={color} size={size} />)
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
