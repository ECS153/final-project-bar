pragma solidity ^0.5.0;

contract Bar {
    uint public msgCount = 0; // state variable

    // Data Model
    struct Message {
        uint id;
        string content;
        // string sender;
    }

    mapping(uint => Message) public messages;

    event MsgCreated(
        uint id,
        string content
        // string sender
    );

    constructor() public {
        createMessage("Hello World");
    }

    function createMessage(string memory _content) public {
        msgCount ++;
        messages[msgCount] = Message(msgCount, _content);
        emit MsgCreated(msgCount, _content); // broadcast an event that a message is created

    }
}

