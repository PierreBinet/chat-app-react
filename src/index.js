import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql} from "@apollo/client";

//simple message element
function MessageBox(props) {
  return (
      <div classname={props.side}>
          <div classname="userName">{props.message.user}</div>
          <div classname="chatText">{props.message.text}</div>
          <div classname="time">{props.message.time}</div>
      </div>
  )
}

//intermediate container with currently dispayed messages
class MessageContainer extends React.Component {
  renderBox(i) {

      let side; //logic for message placement (left or right)
      //if (this.props.messages[i].user === this.props.sessionUser) {
      //    side="chat-right"
      //} else {
      //    side="chat-left"
      //}

      return (
          <MessageBox
            message={this.props.messages[i]}
            side={this.props.side}
          />
      )
  }

  render () {
      return (
        //we want to display 10 messages at a time
        // (future improvement: change number dynamically with window size)
          <div className="chat-box">
              {this.renderBox(0)}
              {this.renderBox(1)}
              {this.renderBox(2)}
              {this.renderBox(3)}
              {this.renderBox(4)}
              {this.renderBox(5)}
              {this.renderBox(6)}
              {this.renderBox(7)}
              {this.renderBox(8)}
              {this.renderBox(9)}
          </div>
      );
  }
}


//graphql client
//does not seem to be working, maybe address is wrong
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphiql"
});

//constant containing code for the fetchlatestmessages query
const GET_LATEST = gql`
  query GetLatest($channelId: String!) {
    fetchLatestMessages(channelId: $channelId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

const GET_NEWER = gql`
  query GetNewer($channelId: String!, $messageId: String!){
    fetchMoreMessages(channelId: $channelId, messageId: $messageId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

function FetchLatest({channelId}) {
  const { loading, error, data } = useQuery(GET_LATEST, {
    variables: {channelId},
  });
  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error.message}`;

  const result = data.fetchLatestMessages.map(({ messageId, text, datetime, userId }) => {
    return (
    <div key={messageId}>
        <div className="userId">{userId}</div>
        <div className="text">{text}</div>
        <div className="datetime">{datetime}</div>
    </div>
    );
  });

  return (
    <div>{result}</div>
  );
}

//debug function while waiting to fix address problem
function FetchDummy({channelId}) {
  return (
    <div>
      <div key={"message1"}>
          <div className="userId">{"user1"}</div>
          <div className="text">{"Bonjour"}</div>
          <div className="datetime">{"2021-08-11T13:47:51.807Z"}</div>
      </div>
      <div key={"message2"}>
        <div className="userId">{"user2"}</div>
        <div className="text">{"Hola"}</div>
        <div className="datetime">{"2021-08-12T06:47:51.807Z"}</div>
      </div>
    </div>
  );
}


//general container with:
//one column for user and channel selection
//another column with the chatbox and messages displayed
class Container extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          messages: Array(10).fill(null),
          currentUser: 1,
          currentChannelId: 1,
          currentMessage: null
      };
  }
  handleClickChannel(i) {
    this.setState({
      currentChannelId: i
    })
  }

  render() {
    //this.setState({
      //messages: {FetchDummy(channelId={this.props.currentChannelId}))}
    //})
      return (
          <div className="content-wrapper">
              <td className="user-container">
                <div>{"1. Choose your user:"}</div>
                <div>
                  {"2. Choose your channel:"}<br />
                  <button onClick={() => this.handleClickChannel(1)}>{"Channel 1"}</button><br />
                  <button onClick={() => this.handleClickChannel(2)}>{"Channel 2"}</button><br />
                  <button onClick={() => this.handleClickChannel(3)}>{"Channel 3"}</button><br />
                </div>
              </td>
              <td className="message-container">
                  <button className="readMoreUp" onClick={() => this.handleClickMoreUp(this.state.currentMessage)}>
                      {"Read more"}
                  </button><br />
                  <FetchLatest channelId={this.state.currentChannelId}/><br />
                  
                  <button className="readMoreDown">
                      {"Read more"}
                  </button><br />
              </td>
          </div>
      );
  }
}

//----- TO DO : DEBUG -------
//<MessageContainer
//squares={this.state.messages}
//sessionUser={this.state.currentUser}
///>


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Container />
    </ApolloProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
