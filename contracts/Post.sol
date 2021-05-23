pragma solidity ^0.4.17;

// import "hardhat/console.sol";

contract PostFactory {
    address public manager;
    mapping(address => bool) public isUserRegistered;
    mapping(address => string) public users;
    address[] public deployedPosts;
    
    // constructor() public {
    //     manager = msg.sender;
    // }
    
    function PostFactory() public {
      manager = msg.sender;
    }
    
    function registerUser(string memory username) public {
        require(!isUserRegistered[msg.sender]);
        users[msg.sender] = username;
        isUserRegistered[msg.sender] = true;
    }
    
    function getUsername() public view returns(string memory) {
        address currentAddress = msg.sender;
        require(isUserRegistered[currentAddress]);
        
        return users[currentAddress];
    }
    
    function isRegistered() public view returns(bool) {
        return isUserRegistered[msg.sender];
    }
    
    function deployPost(string memory postTitle, string memory postBody) public {
        require(isUserRegistered[msg.sender]);
        address newPost = new Post(msg.sender, postTitle, postBody, users[msg.sender], manager);
        deployedPosts.push(newPost);
    }
    
    function deletePost(uint index, address creator) public {
        require(msg.sender == manager || msg.sender == creator);
        delete deployedPosts[index];
    }

    function getDeployedPostsLength() public view returns(uint) {
        return deployedPosts.length;
    }
    
    function getDeployedPosts() public view returns (address[]) {
    return deployedPosts;
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
    
    // constructor(address postCreator, string memory postTitle, string memory postBody, string memory user, address manager) public {
    //     creator = postCreator;
    //     title = postTitle;
    //     body = postBody;
    //     votes = 0;
    //     username = user;
    //     factoryManager = manager;
    // }
    
    function Post(address postCreator, string memory postTitle, string memory postBody, string memory user, address manager) public {
        creator = postCreator;
        title = postTitle;
        body = postBody;
        votes = 0;
        username = user;
        factoryManager = manager;
    }

    function createComment(string memory commentText, string memory user) public {
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
    
    function vottedPost(address user) public view returns(bool) {
        return voters[user];
    }
    
    function vottedComment(uint index, address user) public view returns(bool) {
        Comment storage comment = comments[index];
        return comment.voters[user];
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
    
    function deleteComment(uint index, address _creator) public {
        require(msg.sender == factoryManager || msg.sender == _creator);
        delete comments[index];
    }
    
    function getPostSummary() public view returns(string memory, string memory, string memory, uint, uint, bool) {
        return (username, title, body, votes, comments.length, voters[msg.sender]);
    }
    
    function getCommentSummary(uint commentIndex) public view returns(string memory, string memory, uint, bool) {
        Comment storage comment = comments[commentIndex];
        return (comment.username, comment.text, comment.votes, comment.voters[msg.sender]);
    }
    
    function getCommentsCount() public view returns(uint) {
        return comments.length;
    }
    
    function getPostCreator() public view returns(address) {
        return creator;
    }
}