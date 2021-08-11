import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql} from "@apollo/client";

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

function FetchLatest() {
  const { loading, error, data } = useQuery(GET_LATEST, {
    variables: { channelId:"1" },
  });
  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error.message}`;
  return data.fetchLatestMessages.map(({ messageId, text, datetime, userId }) => (
    <div key={messageId}>
        <div className="userId">{userId}</div>
        <div className="text">{text}</div>
        <div className="datetime">{datetime}</div>
    </div>
  ));
}

//debug function while waiting to fix address problem
function FetchDummy() {
  return (
    <div key={"message1"}>
        <div className="userId">{"user1"}</div>
        <div className="text">{"Bonjour"}</div>
        <div className="datetime">{"2021-08-11T13:47:51.807Z"}</div>
    </div>
  );
}

//simple message element
function MessageBox(props) {
  return (
      <div classname={props.side}>
          <div classname="userName">{props.user}</div>
          <div classname="chatText">{props.text}</div>
          <div classname="time">{props.time}</div>
      </div>
  )
}

//intermediate container with currently dispayed messages
class MessageContainer extends React.Component {
  renderBox(i) {
      let side; //logic for message placement (left or right)
      if (this.props.messageUser[i] === this.props.sessionUser) {
          side="chat-right"
      } else {
          side="chat-left"
      }
      return (
          <MessageBox
          text={this.props.text[i]}
          user={this.props.messageUser[i]}
          side={side}
          time={this.props.time[i]}
          />
      )
  }

  render () {
      return (
        //we want to print 10 messages at a time
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

//general container with:
//one column for user and channel selection
//another column with the chatbox and messages displayed
class Container extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          messages: Array(10).fill(null)
      };
  }
  render() {
      return (
          <div className="content-wrapper">
              <div className="user-container">

              </div>
              <div className="message-container">
                  <button className="readMoreUp">
                      {"Read more"}
                  </button>
                  <MessageContainer
                      
                  />
                  <button className="readMoreDown">
                      {"Read more"}
                  </button>
              </div>
          </div>
      );
  }
}




ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <FetchDummy />
    </ApolloProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
