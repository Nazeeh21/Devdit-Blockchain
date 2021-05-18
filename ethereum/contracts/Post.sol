pragma solidity ^0.4.17;

contract PostFactory {
    address public manager;
    mapping(address => bool) public isUserRegistered;
    mapping(address => string) public users;
    address[] public deployedPosts;
    
    function PostFactory() public {
        manager = msg.sender;
    }
    
    function registerUser(string username) public {
        require(!isUserRegistered[msg.sender]);
        users[msg.sender] = username;
        isUserRegistered[msg.sender] = true;
    }
    
    function getUsername() public view returns(string) {
        address currentAddress = msg.sender;
        require(isUserRegistered[currentAddress]);
        
        return users[currentAddress];
    }
    
    function isRegistered() public view returns(bool) {
        return isUserRegistered[msg.sender];
    }
    
    function deployPost(string postTitle, string postBody) public {
        require(isUserRegistered[msg.sender]);
        address newPost = new Post(msg.sender, postTitle, postBody, users[msg.sender], manager);
        deployedPosts.push(newPost);
    }
    
    function deletePost(uint index, address creator) public {
        require(msg.sender == manager || msg.sender == creator);
        delete deployedPosts[index];
    }
}

contract Post {
    struct Comment {
        address creator;
        string username;
        string text;
        uint votes;
        mapping(address => bool) voters;
    }
    
    Comment[] public comments;
    address public factoryManager;
    address public creator;
    string public username;
    string public title;
    string public body;
    uint public votes;
    mapping(address => bool) public voters;
    
    function Post(address postCreator, string postTitle, string postBody, string user, address manager) public {
        creator = postCreator;
        title = postTitle;
        body = postBody;
        votes = 0;
        username = user;
        factoryManager = manager;
    }
    
    function createComment(string commentText, string user) public {
        Comment memory newComment = Comment({
            creator: msg.sender,
            text: commentText,
            votes: 0,
            username: user
        });
        
        comments.push(newComment);
    }
    
    function votePost() public {
        if(!voters[msg.sender]) {
            votes++;
            voters[msg.sender] = true;
        } else if(voters[msg.sender]) {
            require(votes > 0);
            votes--;
            voters[msg.sender] = false;
        }
    }
    
    function voteComment(uint commentIndex) public {
        Comment storage comment = comments[commentIndex];
        
        if(!comment.voters[msg.sender]) {
            comment.votes++;
            comment.voters[msg.sender] = true;
        } else if(comment.voters[msg.sender]) {
            require(comment.votes > 0);
            comment.votes--;
            comment.voters[msg.sender] = false;
        }
        
    }
    
    function deleteComment(uint index, address creator) public {
        require(msg.sender == factoryManager || msg.sender == creator);
        delete comments[index];
    }
    
    function getPostSummary() public view returns(string, string, string, uint, uint) {
        return (username, title, body, votes, comments.length);
    }
    
    function getCommentSummary(uint commentIndex) public view returns(string, string, uint) {
        Comment storage comment = comments[commentIndex];
        return (comment.username, comment.text, comment.votes);
    }
    
    function getCommentsCount() public view returns(uint) {
        return comments.length;
    }
    
    function getPostCreator() public view returns(address) {
        return creator;
    }
}