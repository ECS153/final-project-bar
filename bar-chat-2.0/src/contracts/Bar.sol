pragma solidity ^0.5.0;

contract Bar {
    string public name;
    uint public messageCount = 0;
    mapping(uint => Message) public messages;

    struct Message {
        uint id;
        string content;
        address author;
    }

    event MessageCreated(
        uint id,
        string content,
        address author
    );

    constructor() public {
        name = "Bar Live Chat";
    }

    function createMessage(string memory _content) public {
        require(bytes(_content).length > 0); // reject empty string
        messageCount ++;
        messages[messageCount] = Message(messageCount, _content, msg.sender);
        emit MessageCreated(messageCount, _content, msg.sender); // emit event
    }
}