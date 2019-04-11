import React, { Component } from 'react'
import axios from 'axios'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  BackHandler
} from 'react-native'

import {
  Header,
  Input,
  Item,
  Body,
  Title,
  Card,
  CardItem,
  Text,
  Button
} from 'native-base'

export class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.deleteTask = this.deleteTask.bind(this)
    this.addTask = this.addTask.bind(this)
    this.editTask = this.editTask.bind(this)

    this.state = {
      text: '',
      todos: [],
      modalVisible: false,
      updateText: '',
      selectedValue:null,
      // listViewData: this.state.todos,
    }
  }

  async componentDidMount() {



    BackHandler.addEventListener('hardwareBackPress', () => {
      this.setState({ modalVisible: false })
      return true;
    });




    try {
      let { data } = await axios.get('http://192.168.100.8:8000/todos/',
        {
          completed: true
        })
      // console.warn(data, "dataaaaaaaaa");
      this.setState({ todos: data.reverse() })

    }

    catch (err) {
      console.warn(err, "ERROR");
    }
  }

  async deleteTask(id) {
    try {
      let { data } = await axios.delete('http://192.168.100.8:8000/deltodos/' + id)
      this.setState({ todos: data.reverse(), text: '' })
    }
    catch (err) {
      console.warn(err, "ERROR");
    }
  }


  async editTask(id) {
    try {
      let { data } = await axios.post('http://192.168.100.8:8000/puttodo/' + id + '/',
        {
          title: this.state.text,
        })// post ends
      this.setState({ todos: data.reverse() })
    }
    catch (err) {
      console.warn(err, "ERROR");
    }
  }

  async addTask() {

    try {
      let { data } = await axios.post('http://192.168.100.8:8000/todos/',
        {
          title: this.state.text,
          description: 'no description',
          completed: false
        })// post ends
      this.setState({ todos: data.reverse(), text: '' })
    }
    catch (err) {
      console.warn(err, "ERROR");
    }
  }

  async addCompleted(id, status) {
    try {
      let { data } = await axios.post('http://192.168.100.8:8000/puttodo/' + id + '/',
        {
          completed: !status
        }
      )
      this.setState({ todos: data.reverse() })
    }
    catch (err) {
      console.warn(err, "ERROR");
    }
  }

  showModal =  (text) => {
    this.setState({ updateText: text, modalVisible: true })
  }

  updateTask = async (id)=>{
    try {
      let { data } = await axios.post('http://192.168.100.8:8000/puttodo/' + id + '/',
        {
          title: this.state.updateText
        }
      )
      this.setState({ todos: data.reverse(), modalVisible:false })
    }
    catch (err) {
      console.warn(err, "ERROR");
    }
  }
  render() {
    return (
      <>

        <View style={styles.container}>
          <Header>
            {/* <Left/> */}
            <Body>
              <Title>Todos</Title>
            </Body>
            {/* <Right /> */}
          </Header>

          <View style={styles.addInput}>
            <Item rounded style={styles.item}>

              <Input placeholder='Add Task'
                defaultValue={this.state.text}
                onChangeText={(text) => this.setState({ text })}
              />

              <TouchableOpacity onPress={() => this.addTask()}>
                <Image style={{ height: 35, width: 35 }} source={require('./../../assets/plus.png')} />
              </TouchableOpacity>
            </Item>
          </View>

          <View style={styles.todoList}>
            <ScrollView>

              {
                this.state.todos.map((e, i) => {
                  return <Card style={styles.todoItem} key={i}>
                    <CardItem>
                      <Body style={styles.body}>
                        <View style={styles.icon}>
                          <TouchableOpacity onPress={() => this.addCompleted(e.id, e.completed)}>
                            {
                              e.completed ?
                                <Image style={{ height: 25, width: 25 }} source={require('./../../assets/confirm.png')} /> :
                                <Image style={{ height: 25, width: 25 }} source={require('./../../assets/circle-shape-outline.png')} />

                            }

                          </TouchableOpacity>

                          {e.completed ? <Text style={[styles.text, styles.completedText]}>
                            {e.title}
                          </Text> :

                            <Text style={[styles.text]}>
                              {e.title}
                            </Text>
                          }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity onPress={() => this.setState({ modalVisible: true, selectedValue: e })}>
                            <Image style={{ height: 25, width: 25 }} source={require('./../../assets/edit.png')} />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.deleteTask(e.id)}>
                            <Image style={{ height: 25, width: 25 }} source={require('./../../assets/delete.png')} />
                          </TouchableOpacity>
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                })
              }
            </ScrollView>
          </View>
        </View>
        {this.state.modalVisible &&
          <View style={styles.modal}>
            <View style={styles.childModal}>
            
            <Item rounded style={styles.item}>
              <Input placeholder='Enter Text'
                defaultValue={this.state.selectedValue.title}
                onChangeText={(updateText) => this.setState({updateText})}
              />
            </Item>

            <TouchableOpacity >
              <Button onPress={() => this.updateTask(this.state.selectedValue.id)}>
                <Text>update</Text>
              </Button>
            </TouchableOpacity>

            </View>
          </View>
        }

      </>
    )
  }
}

export default MainScreen


const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: '#fff'
  },
  addInput: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center'

  },
  item: {
    paddingHorizontal: 10,
    marginLeft: 15,
    marginRight: 15
  },
  todoList: {
    flex: 1,
    marginTop: 15
  },
  todoItem: {
    marginLeft: 15,
    marginRight: 15,
  },
  completedText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
    color: '#ccc'
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginHorizontal: 10
  },
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  },
  childModal: {
    height: "70%",
    width: "80%",
    backgroundColor: "#fff",
    marginTop:30,
    alignItems:'center'
  }
})