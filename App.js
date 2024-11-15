import * as React from 'react';
import { TextInput, Text, View, Button, FlatList } from 'react-native';
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
      </View>
    )
  }

  async ler(){
    try{
      let senha_login = await AsyncStorage.getItem(this.state.usuario);
      if(senha_login != null){
        if(senha_login == this.state.senha){
          alert("Usuário Logado !");
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
//         //await AsyncStorage.setItem('isLogged', 'true'); // Seta o login no AsyncStorage
//         this.props.navigation.navigate("Filmes");
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

// Tela de Cadastro
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
      alert("Salvo com sucesso!!!");
    } catch (erro) {
      alert("Erro!");
    }
  }

  render() {
    return (
      <View>
        <Text>{"Cadastrar Usuário:"}</Text>
        <TextInput onChangeText={(texto) => this.setState({ user: texto })} />
        <Text>{"Cadastrar Senha:"}</Text>
        <TextInput onChangeText={(texto) => this.setState({ password: texto })} secureTextEntry={true} />
        <Button title="Cadastrar" onPress={() => this.salvar()} />
      </View>
    );
  }
}

// Tela de Filmes com sistema de comentários
class Filmes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      comment: '',
      comments: {},
    };
  }

  async componentDidMount() {
    const isLogged = await AsyncStorage.getItem('isLogged');
    if (isLogged !== 'true') {
      alert("Por favor, faça login para acessar esta página.");
      this.props.navigation.navigate("Login");
    } else {
      this.setState({ isLogged: true });
    }
  }

  addComment(movieId) {
    this.setState((prevState) => ({
      comments: {
        ...prevState.comments,
        [movieId]: (prevState.comments[movieId] || []).concat(prevState.comment),
      },
      comment: '',
    }));
  }

  render() {
    if (!this.state.isLogged) return null; // Não renderiza se o usuário não está logado

    const movies = [
      { id: '1', title: 'Inception' },
      { id: '2', title: 'The Matrix' },
      { id: '3', title: 'Interstellar' },
    ];

    return (
      <View>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
              <TextInput
                placeholder="Escreva um comentário"
                value={this.state.comment}
                onChangeText={(text) => this.setState({ comment: text })}
              />
              <Button title="Comentar" onPress={() => this.addComment(item.id)} />
              <Text>Comentários:</Text>
              {(this.state.comments[item.id] || []).map((c, index) => (
                <Text key={index}>{c}</Text>
              ))}
            </View>
          )}
        />
      </View>
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
            name="Filmes"
            component={Filmes}
            options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="movie" color={color} size={size} />)
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
