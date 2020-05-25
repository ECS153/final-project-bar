import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px'}}>
                    <div className="content mr-auto ml-auto">
                    <p>&nbsp;</p>
                        <form onSubmit={(event) => {
                            event.preventDefault() // prevent loading page
                            const content = this.msgContent.value
                            this.props.createMessage(content)
                        }}>
                            <div className="form-group mr-sm-2">
                            <input
                                id="postContent"
                                type="text"
                                ref={(input) => { this.msgContent = input }}
                                className="form-control"
                                placeholder="Type here..."
                                required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Send</button>
                        </form>
                        <p>&nbsp;</p>
                        { this.props.messages.map((message, key) => {
                        return(
                            <div className="card mb-4" key={key} >
                            <div className="card-header">
                                <img
                                className='mr-2'
                                width='30'
                                height='30'
                                src={`data:image/png;base64,${new Identicon(message.author, 30).toString()}`}
                                />
                                <small className="text-muted">{message.author}</small>
                            </div>
                            <ul id="postList" className="list-group list-group-flush">
                            <li className="list-group-item">
                                <p>{message.content}</p>
                            </li>
                            </ul>
                        </div>
                        )
                        })}
                    </div>
                </main>
            </div>
          </div>
        );
    }
}

export default Main;